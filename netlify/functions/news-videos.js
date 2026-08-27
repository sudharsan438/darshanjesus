/* =========================================================
   DARSHAN VIDEO NEWS
   Netlify Function -> YouTube Data API v3
   Environment variable: YOUTUBE_API_KEY
   ========================================================= */

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

const CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Cache-Control": "public, max-age=300, s-maxage=300"
};

function response(statusCode, body) {
    return {
        statusCode,
        headers: CORS_HEADERS,
        body: JSON.stringify(body)
    };
}

exports.handler = async function (event) {
    if (event.httpMethod === "OPTIONS") {
        return response(200, {});
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        return response(500, {
            status: "error",
            message: "YouTube Video News is not configured. Add YOUTUBE_API_KEY to Netlify environment variables.",
            results: []
        });
    }

    const params = event.queryStringParameters || {};
    const query = String(params.q || "India news latest").trim().slice(0, 100);
    const maxResults = Math.min(Math.max(Number(params.maxResults) || 8, 1), 10);
    const regionCode = String(params.regionCode || "IN").toUpperCase().slice(0, 2);
    const language = String(params.language || "en").slice(0, 5);

    /*
       Search only the recent 48-hour window.
       YouTube supports publishedAfter and date ordering.
    */
    const publishedAfter = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const youtubeParams = new URLSearchParams({
        part: "snippet",
        key: apiKey,
        q: query,
        type: "video",
        order: "date",
        maxResults: String(maxResults),
        publishedAfter,
        regionCode,
        relevanceLanguage: language,
        safeSearch: "strict",
        videoEmbeddable: "true",
        videoSyndicated: "true"
    });

    try {
        const apiResponse = await fetch(`${YOUTUBE_API_URL}?${youtubeParams.toString()}`);
        const data = await apiResponse.json();

        if (!apiResponse.ok || data.error) {
            console.error("YouTube API error:", data.error || data);
            return response(502, {
                status: "error",
                message: data?.error?.message || "YouTube could not return fresh videos.",
                results: []
            });
        }

        const results = (Array.isArray(data.items) ? data.items : [])
            .filter(item => item?.id?.videoId && item?.snippet?.publishedAt)
            .map(item => ({
                videoId: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                channelTitle: item.snippet.channelTitle,
                channelId: item.snippet.channelId,
                publishedAt: item.snippet.publishedAt,
                thumbnail: item.snippet.thumbnails?.high?.url ||
                    item.snippet.thumbnails?.medium?.url ||
                    item.snippet.thumbnails?.default?.url || ""
            }))
            .filter(item => Date.parse(item.publishedAt) >= Date.now() - 48 * 60 * 60 * 1000)
            .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

        return response(200, {
            status: "success",
            totalResults: results.length,
            results,
            freshness: "48 hours",
            source: "YouTube Data API"
        });
    } catch (error) {
        console.error("Darshan Video News error:", error);
        return response(502, {
            status: "error",
            message: "Unable to reach YouTube right now.",
            results: []
        });
    }
};
