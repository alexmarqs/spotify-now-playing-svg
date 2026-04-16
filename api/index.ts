import {
  getNowPlaying,
  parseTrack,
  getImgBase64
} from '../lib/spotifyClientApi';
import PlayingNowCard from '../components/PlayingNowCard';
import render from 'preact-render-to-string';

export const config = {
  runtime: 'edge'
};

const renderSvg = (
  theme: 'light' | 'dark',
  track: {
    title?: string;
    artist?: string;
    cover?: string;
    isPlaying?: boolean;
  },
  cacheSeconds = 1
): Response => {
  const svg = render(
    PlayingNowCard({ width: 460, height: 60, theme, track })
  );

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': `s-maxage=${cacheSeconds}, stale-while-revalidate`
    }
  });
};

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const theme =
    url.searchParams.get('theme') === 'dark' ? 'dark' : 'light';
  const demo = url.searchParams.get('demo') === 'true';

  if (demo) {
    return renderSvg(theme, {
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      isPlaying: true
    }, 3600);
  }

  try {
    const playingNowData = await getNowPlaying();
    const track = parseTrack(playingNowData);
    const cover = track?.albumImgUrl
      ? await getImgBase64(track.albumImgUrl)
      : null;

    return renderSvg(theme, {
      title: track?.title,
      artist: track?.artist,
      cover: cover ?? undefined,
      isPlaying: track?.isPlaying
    });
  } catch (error) {
    console.error('Error generating now-playing SVG:', error);
    return renderSvg(theme, {}, 60);
  }
}
