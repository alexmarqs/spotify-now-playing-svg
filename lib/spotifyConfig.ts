export default {
  CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
  TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token',
  NOW_PLAYING_ENDPOINT:
    'https://api.spotify.com/v1/me/player/currently-playing?additional_types=track,episode'
};
