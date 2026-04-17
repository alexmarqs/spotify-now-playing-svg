import spotifyConfig from './spotifyConfig';

// Spotify API types (minimal, only what we need)
interface SpotifyAuthToken {
  access_token: string;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { images: SpotifyImage[] };
}

interface SpotifyEpisode {
  name: string;
  show: { name: string; publisher: string };
  images: SpotifyImage[];
}

interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
  item: SpotifyTrack | SpotifyEpisode | null;
}

export interface SpotifyTrackInfo {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImgUrl?: string;
}

const basic = btoa(`${spotifyConfig.CLIENT_ID}:${spotifyConfig.CLIENT_SECRET}`);

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

  if (!response.ok) {
    throw new Error(`Spotify auth failed: ${response.status}`);
  }

  const data: SpotifyAuthToken = await response.json();

  if (!data.access_token) {
    throw new Error('No access token in Spotify response');
  }

  return data.access_token;
};

export const getNowPlaying =
  async (): Promise<SpotifyCurrentlyPlaying | null> => {
    const accessToken = await getAccessToken();

    const response = await fetch(spotifyConfig.NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.status === 204) {
      return null;
    }

    if (response.status >= 400) {
      console.error(
        `Spotify now-playing failed: ${response.status}`,
        await response.text().catch(() => '')
      );
      return null;
    }

    return response.json();
  };

export const parseTrack = (
  playingNowData: SpotifyCurrentlyPlaying | null
): SpotifyTrackInfo | null => {
  if (!playingNowData?.item) {
    return null;
  }

  const {
    item,
    is_playing: isPlaying,
    currently_playing_type: type
  } = playingNowData;

  if (type === 'track') {
    const track = item as SpotifyTrack;
    return {
      isPlaying,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      albumImgUrl: track.album.images[0]?.url
    };
  }

  if (type === 'episode') {
    const episode = item as SpotifyEpisode;
    return {
      isPlaying,
      title: episode.name,
      artist: `${episode.show.publisher} (${episode.show.name})`,
      albumImgUrl: episode.images[0]?.url
    };
  }

  return null;
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const getImgBase64 = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buff = await res.arrayBuffer();
    return arrayBufferToBase64(buff);
  } catch {
    return null;
  }
};
