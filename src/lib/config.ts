// This file centralizes the configuration for your application.

// Get the API URL from the environment variables.
// The `NEXT_PUBLIC_` prefix is required by Vercel/Next.js to expose it to the browser.
// We provide a fallback for local development.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// You can add other configurations here in the future.
