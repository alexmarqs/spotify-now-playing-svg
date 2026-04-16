import { h } from 'preact';

type PlayingNowCardProps = {
  width: number;
  height: number;
  theme?: 'light' | 'dark';
  track: {
    title?: string;
    artist?: string;
    cover?: string;
    isPlaying?: boolean;
  };
};

const themes = {
  light: {
    bg: '#ffffff',
    text: '#1a1a1a',
    sub: '#6b7280',
    border: '#e5e7eb'
  },
  dark: {
    bg: '#181818',
    text: '#ffffff',
    sub: '#b3b3b3',
    border: '#282828'
  }
};

const PlayingNowCard = ({
  width,
  height,
  theme = 'light',
  track
}: PlayingNowCardProps) => {
  const c = themes[theme];

  return (
    <svg
      fill="none"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <foreignObject width={width} height={height}>
        <style>{`
          @keyframes eq1 {
            0%, 100% { height: 4px; }
            50% { height: 16px; }
          }
          @keyframes eq2 {
            0%, 100% { height: 8px; }
            50% { height: 4px; }
          }
          @keyframes eq3 {
            0%, 100% { height: 6px; }
            50% { height: 14px; }
          }
          .card {
            border-radius: 6px;
            background-color: ${c.bg};
            padding: 8px 12px;
            display: flex;
            align-items: center;
            font-size: 13px;
            font-weight: 400;
            line-height: 1.5;
            font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
            box-sizing: border-box;
            height: ${height}px;
          }
          .cover {
            border-radius: 4px;
            flex-shrink: 0;
          }
          .info {
            display: flex;
            flex-direction: column;
            margin-left: 12px;
            min-width: 0;
            flex: 1;
          }
          .title {
            font-weight: 600;
            font-size: 13px;
            color: ${c.text};
          }
          .artist {
            font-size: 12px;
            color: ${c.sub};
          }
          .no-track {
            font-weight: 500;
            font-size: 13px;
            margin-left: 12px;
            color: ${c.sub};
          }
          .truncate {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .eq {
            display: flex;
            align-items: flex-end;
            gap: 2px;
            height: 18px;
            margin-left: 10px;
            flex-shrink: 0;
          }
          .eq-bar {
            width: 3px;
            border-radius: 1.5px;
            background: #1DB954;
          }
          .eq-bar-1 {
            height: 4px;
            animation: eq1 0.8s ease-in-out infinite;
          }
          .eq-bar-2 {
            height: 8px;
            animation: eq2 0.6s ease-in-out infinite;
          }
          .eq-bar-3 {
            height: 6px;
            animation: eq3 0.9s ease-in-out infinite;
          }
          .eq-paused .eq-bar {
            animation-play-state: paused;
          }
        `}</style>
        <div className="card" {...{ xmlns: 'http://www.w3.org/1999/xhtml' }}>
          {track.cover ? (
            <img
              className="cover"
              src={`data:image/jpeg;base64,${track.cover}`}
              width="42"
              height="42"
            />
          ) : (
            <svg
              width="36"
              height="36"
              viewBox="0 0 168 168"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#1DB954"
                d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l.001-.004zm38.404 120.78a5.217 5.217 0 01-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 01-6.249-3.93 5.213 5.213 0 013.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35a6.538 6.538 0 014.354-8.143c30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-.001zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 015.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 012.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z"
              />
            </svg>
          )}
          {track.title ? (
            <div className="info">
              <span className="title truncate">{track.title}</span>
              <span className="artist truncate">{track.artist}</span>
            </div>
          ) : (
            <span className="no-track">Not playing...</span>
          )}
          {track.title && (
            <div
              className={`eq${track.isPlaying === false ? ' eq-paused' : ''}`}
            >
              <div className="eq-bar eq-bar-1" />
              <div className="eq-bar eq-bar-2" />
              <div className="eq-bar eq-bar-3" />
            </div>
          )}
        </div>
      </foreignObject>
    </svg>
  );
};

export default PlayingNowCard;
