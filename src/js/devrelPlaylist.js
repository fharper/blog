require('dotenv').config();

const PLAYLIST_ID = 'PLjMw8c44mBQuNaqruua27_oX9lQeUwrgO';
const PAGE_SIZE = 50;        // API maximum for playlistItems
const EPISODES_SHOWN = 6;    // how many recent episodes the page displays
const TIMEOUT_MS = 30000;
const MAX_PAGES = 20;        // safety net so a misbehaving API can't loop forever

const LOG_PREFIX = '[devrelshow]';
const log = (message) => console.log(`${LOG_PREFIX} ${message}`);
const warn = (message) => console.warn(`${LOG_PREFIX} ${message}`);
const error = (message) => console.error(`${LOG_PREFIX} ${message}`);
const plural = (count, noun) => `${count} ${noun}${count === 1 ? '' : 's'}`;

// YouTube reports failures as {"error":{"message":"..."}}; fall back to the raw
// body (truncated, since an error page can be enormous) when it isn't JSON.
function describeApiError(status, body) {
  try {
    const message = JSON.parse(body)?.error?.message;
    if (message) return `HTTP ${status}: ${message}`;
  } catch {
    // not JSON, use the body below
  }

  const snippet = body.replace(/\s+/g, ' ').trim().slice(0, 200);
  return snippet ? `HTTP ${status}: ${snippet}` : `HTTP ${status}`;
}

// `label` identifies which request is being attempted (e.g. "page 2"), so the
// retry chatter is readable when several requests are in play.
async function fetchWithRetry(url, label, retries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      log(`${label}: attempt ${attempt} of ${retries}...`);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Eleventy-Site-Builder/1.0'
          }
        });

        if (!response.ok) {
          throw new Error(describeApiError(response.status, await response.text()));
        }

        return await response.json();

      } finally {
        clearTimeout(timeout);
      }

    } catch (err) {
      const reason = err.name === 'AbortError'
        ? `timed out after ${TIMEOUT_MS / 1000}s`
        : err.message;

      error(`${label}: attempt ${attempt} of ${retries} failed — ${reason}`);

      if (attempt === retries) throw new Error(`${label}: ${reason}`, { cause: err });

      log(`${label}: waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

// The API caps a page at PAGE_SIZE items, so walk every page: the episode count
// has to be exact, and an unavailable video can sit anywhere in the playlist.
async function fetchAllPlaylistItems(apiKey) {
  const items = [];
  let pageToken = '';
  let pagesFetched = 0;

  while (pagesFetched < MAX_PAGES) {
    const label = `page ${pagesFetched + 1}`;
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${PAGE_SIZE}&playlistId=${PLAYLIST_ID}&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;

    const data = await fetchWithRetry(url, label);
    pagesFetched++;

    if (!data.items) {
      throw new Error(`${label}: response contained no items`);
    }

    items.push(...data.items);

    const playlistSize = data.pageInfo?.totalResults;
    log(`${label}: got ${plural(data.items.length, 'item')}` +
      (playlistSize ? ` (${playlistSize} in the playlist)` : ''));

    pageToken = data.nextPageToken || '';
    if (!pageToken) break;
  }

  if (pageToken) {
    throw new Error(`more than ${MAX_PAGES} pages of results, so the episode count would be incomplete`);
  }

  return { items, pagesFetched };
}

module.exports = async function() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error(`${LOG_PREFIX} YOUTUBE_API_KEY is not set, so the playlist cannot be fetched. Add it to .env and build again.`);
  }

  try {
    log(`Fetching playlist ${PLAYLIST_ID}...`);
    const { items, pagesFetched } = await fetchAllPlaylistItems(apiKey);

    // Deleted and private videos stay in the playlist, but YouTube returns them
    // with an empty thumbnails object, so skip anything without a thumbnail.
    const availableItems = items.filter(item => item.snippet?.thumbnails?.medium?.url);
    const unavailable = items.filter(item => !item.snippet?.thumbnails?.medium?.url);

    if (unavailable.length > 0) {
      const listed = unavailable
        .map(item => `"${item.snippet?.title || 'untitled'}" (${item.snippet?.resourceId?.videoId || 'unknown id'})`)
        .join(', ');
      warn(`⚠ Skipped ${plural(unavailable.length, 'unavailable video')} (deleted or private): ${listed}`);
    }

    const allVideos = availableItems.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      description: item.snippet.description
    }));

    const totalCount = allVideos.length;

    if (totalCount === 0) {
      throw new Error(items.length === 0
        ? 'the playlist is empty'
        : `none of the ${plural(items.length, 'item')} in the playlist are available`);
    }

    const lastEpisodes = allVideos.reverse().slice(-EPISODES_SHOWN).reverse();
    log(`✓ ${plural(totalCount, 'episode')} available across ${plural(pagesFetched, 'page')} — showing the ${lastEpisodes.length} most recent`);

    // Add total count as a property
    lastEpisodes.totalCount = totalCount;

    return lastEpisodes;

  } catch (err) {
    // Fail the build rather than publish the devrelshow page with a missing
    // section or a wrong episode count.
    error(`✗ Could not build the playlist: ${err.message}`);
    throw new Error(`${LOG_PREFIX} playlist fetch failed — ${err.message}`, { cause: err });
  }
};
