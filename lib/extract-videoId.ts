/**
 * This function is responsible for extracting the video ID from a YouTube URL
 * This id will be use to fetch the video details from the YouTube API
 */

export function extractVideoID(url:string) {
    try {
        const params = new URLSearchParams(new URL(url).search);
        return params.get('v');
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}