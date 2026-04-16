const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export default {
  CLIENT_ID: getEnvVar('SPOTIFY_CLIENT_ID'),
  CLIENT_SECRET: getEnvVar('SPOTIFY_CLIENT_SECRET'),
  REFRESH_TOKEN: getEnvVar('SPOTIFY_REFRESH_TOKEN'),
  TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token',
  NOW_PLAYING_ENDPOINT:
    'https://api.spotify.com/v1/me/player/currently-playing?additional_types=track,episode'
} as const;
