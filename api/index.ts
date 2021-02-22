import { NowRequest, NowResponse } from '@vercel/node';
import { getNowPlaying, extractMySong } from './_utils/spotifyClientApi';

export default async (req: NowRequest, res: NowResponse) => {
  try {
    const spotifyPlayingNow = await getNowPlaying();
    const song = extractMySong(spotifyPlayingNow);
    res.status(200).json(song);
  } catch (error) {
    console.log(error);
    res.status(200).json({ isPlaying: false });
  }
};
