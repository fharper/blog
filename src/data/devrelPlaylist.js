require('dotenv').config();

async function fetchWithRetry(url, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1} of ${retries} to fetch playlist...`);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Eleventy-Site-Builder/1.0'
        }
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`YouTube API error (${response.status}):`, errorText);
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);

      if (i < retries - 1) {
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error;
      }
    }
  }
}

module.exports = async function() {
  const playlistId = 'PLjMw8c44mBQuNaqruua27_oX9lQeUwrgO';
  const apiKey = process.env.YOUTUBE_API_KEY;

  console.log('API Key exists:', !!apiKey);

  if (!apiKey) {
    console.warn('YOUTUBE_API_KEY not found. Playlist will be empty.');
    return [];
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
    const data = await fetchWithRetry(url);

    console.log(`✓ Found ${data.items?.length || 0} videos in playlist`);

    if (!data.items) {
      console.error('No items in response');
      return [];
    }

    const allVideos = data.items.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      description: item.snippet.description
    }));

    const totalCount = data.pageInfo?.totalResults || allVideos.length;

    const lastEpisodes = allVideos.reverse().slice(-6).reverse();
    console.log(`✓ Returning ${lastEpisodes.length} most recent videos out of ${totalCount} total`);

    // Add total count as a property
    lastEpisodes.totalCount = totalCount;

    return lastEpisodes;

  } catch (error) {
    console.error('Error fetching playlist after all retries:', error);
    return [];
  }
};