import spotifyConfig from './spotifyConfig';
import fetch from 'node-fetch';

interface SpotifyAuthToken {
  access_token: string;
}

interface SpotifyTrackInfo {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImgUrl: string;
}

const basic = Buffer.from(
  `${spotifyConfig.CLIENT_ID}:${spotifyConfig.CLIENT_SECRET}`
).toString('base64');

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

export const getNowPlaying = async (): Promise<null | SpotifyApi.CurrentlyPlayingResponse> => {
  const accessToken = await getAccessToken();

  const response = await fetch(spotifyConfig.NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status !== 200) {
    return null;
  }

  const data = await response.json();

  return data;
};

export const parseTrack = (
  playingNowData: SpotifyApi.CurrentlyPlayingResponse
): null | SpotifyTrackInfo => {
  if (!playingNowData) {
    return null;
  }

  const {
    item,
    is_playing: isPlaying,
    currently_playing_type: currentlyPlayingType
  } = playingNowData;

  if (currentlyPlayingType === 'track') {
    const itemTrack = item as SpotifyApi.TrackObjectFull;
    return {
      isPlaying,
      title: itemTrack.name,
      artist: itemTrack.artists.map(artist => artist.name).join(', '),
      albumImgUrl: itemTrack.album.images[0].url
    };
  } else if (currentlyPlayingType === 'episode') {
    const itemEpisode = item as SpotifyApi.EpisodeObjectFull;
    return {
      isPlaying,
      title: itemEpisode.name,
      artist: itemEpisode.show.publisher + ' (' + itemEpisode.show.name + ')',
      albumImgUrl: itemEpisode.images[0].url
    };
  } else {
    return null;
  }
};

export const getImgBase64 = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const buff = await res.arrayBuffer();

  return Buffer.from(buff).toString('base64');
};
