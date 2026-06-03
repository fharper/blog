const fs = require('fs');
const path = require('path');
const https = require('https');

const CACHE_PATH = path.join(__dirname, 'geocodingCache.json');

function nominatimFetch(city) {
    return new Promise((resolve, reject) => {
        const q = encodeURIComponent(city);
        const options = {
            hostname: 'nominatim.openstreetmap.org',
            path: `/search?q=${q}&format=json&limit=1`,
            headers: { 'User-Agent': 'fred.dev/blog (+https://fred.dev)' },
        };
        https.get(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function () {
    const talks = require('./talks.json');

    let cache = {};
    if (fs.existsSync(CACHE_PATH)) {
        cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    }

    const now = new Date();
    const cityCount = new Map();
    for (const talk of talks) {
        if (!talk.city || !talk.date) continue;
        if (new Date(talk.date + 'T23:59:59Z') > now) continue;
        cityCount.set(talk.city, (cityCount.get(talk.city) || 0) + 1);
    }

    let cacheUpdated = false;

    for (const city of cityCount.keys()) {
        if (cache[city]) continue;

        try {
            const results = await nominatimFetch(city);
            if (results && results.length > 0) {
                cache[city] = {
                    lat: parseFloat(results[0].lat),
                    lng: parseFloat(results[0].lon),
                };
                cacheUpdated = true;
                console.log(`[talkLocations] Geocoded: ${city}`);
            } else {
                console.warn(`[talkLocations] No result for: ${city}`);
            }
        } catch (e) {
            console.warn(`[talkLocations] Geocoding failed for "${city}":`, e.message);
        }

        // Nominatim rate limit: max 1 request per second
        await sleep(1100);
    }

    if (cacheUpdated) {
        fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n');
    }

    return Array.from(cityCount.entries())
        .filter(([city]) => cache[city])
        .map(([city, count]) => ({
            lat: cache[city].lat,
            lng: cache[city].lng,
            name: city,
            intensity: Math.min(5, count),
        }));
};
