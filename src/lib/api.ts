
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const endpoints = {
    health: `${API_URL}/health`,
    image: `${API_URL}/api/image/predict`,
    video: `${API_URL}/api/video/detect`,
    audio: `${API_URL}/api/audio/analyze`,
    text: `${API_URL}/api/text/detect`,
    factcheck: `${API_URL}/api/text/factcheck`,
};
