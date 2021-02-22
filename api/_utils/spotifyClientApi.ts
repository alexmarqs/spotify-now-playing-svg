import spotifyConfig from './spotifyConfig';
import fetch from 'node-fetch';

const basic = Buffer.from(
  `${spotifyConfig.CLIENT_ID}:${spotifyConfig.CLIENT_SECRET}`
).toString('base64');

type SpotifyAuthToken = {
  access_token: string;
};

type SpotifyMySongInfo = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImgUrl: string;
  songUrl?: string;
};

const getAccessToken = async (): Promise<string> => {
  const payload = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: spotifyConfig.REFRESH_TOKEN
  });

  const response = await fetch(spotifyConfig.TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: payload.toString()
  });

  const data: SpotifyAuthToken = await response.json();

  return data.access_token;
};

export const getNowPlaying = async (): Promise<SpotifyApi.CurrentlyPlayingResponse> => {
  const accessToken = await getAccessToken();

  const response = await fetch(spotifyConfig.NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status !== 200) {
    throw new Error(`Invalid Spotify Response: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
};

export const extractMySong = (
  song: SpotifyApi.CurrentlyPlayingObject
): SpotifyMySongInfo => {
  const { item, is_playing: isPlaying } = song;
  const { name: title, artists, album } = item;

  return {
    isPlaying,
    title,
    artist: artists.map(artist => artist.name).join(', '),
    album: album.name,
    albumImgUrl: album.images[0].url
  };
};
