import { NowRequest, NowResponse } from '@vercel/node';
import {
  getNowPlaying,
  parseTrack,
  getImgBase64
} from '../lib/spotifyClientApi';
import PlayingNowCard from '../components/PlayingNowCard';
import render from 'preact-render-to-string';

export default async (req: NowRequest, res: NowResponse) => {
  const playingNowData = await getNowPlaying();
  const track = parseTrack(playingNowData);
  const albumImgUrlBase64 = track && (await getImgBase64(track.albumImgUrl)); // update album url with base 64 encoding

  const svg = render(
    PlayingNowCard({
      width: 460,
      height: 60,
      track: {
        title: track?.title,
        artist: track?.artist,
        cover: albumImgUrlBase64
      }
    })
  );

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  res.status(200).send(svg);
};
