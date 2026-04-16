# Spotify Playing Now SVG Generator 🎵

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Falexmarqs%2Fspotify-now-playing-svg)

A serverless Edge Function that generates a dynamic SVG showing what you're currently listening to on Spotify. Embed it in your GitHub README or any markdown file.

```html
<img src="<YOUR_VERCEL_APP_URL>/api" width="460" height="60">

<!-- dark theme -->
<img src="<YOUR_VERCEL_APP_URL>/api?theme=dark" width="460" height="60">
```

### Demo

Light theme:

<img src="https://spotify-now-playing-svg.vercel.app/api?demo=true" width="460" height="60">

Dark theme:

<img src="https://spotify-now-playing-svg.vercel.app/api?demo=true&theme=dark" width="460" height="60">

### Live

<img src="https://spotify-now-playing-svg.vercel.app/api" width="460" height="60">

## Built with

- TypeScript (strict mode)
- Preact — renders JSX components to SVG strings
- SVG with `<foreignObject>` for rich HTML/CSS inside SVG
- Vercel Edge Functions (zero cold start)
- Spotify Web API

## Architecture

![Diagram architecture](/docs/diagram.png)

## Prerequisites

> **Important:** As of late 2024, the Spotify Web API requires the **app owner** to have an active **Spotify Premium** subscription. If your subscription lapses, the now-playing endpoint will return 403. It can take a few hours to propagate after re-subscribing.

## Setup

The required environment variables are listed in `.env.example`:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

### Getting your Spotify credentials

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and **create a new app**
2. Copy your **Client ID** and **Client Secret**
3. In the app settings, add `http://localhost/callback/` as a **Redirect URI**
4. Authorize your app by navigating to:

   ```
   https://accounts.spotify.com/authorize?client_id={SPOTIFY_CLIENT_ID}&response_type=code&scope=user-read-currently-playing&redirect_uri=http://localhost/callback/
   ```

   After logging in, you'll be redirected to `http://localhost/callback/?code={CODE}`. Copy the `CODE` from the URL.

5. Exchange the code for a refresh token:

   ```bash
   curl -X POST https://accounts.spotify.com/api/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -H "Authorization: Basic $(echo -n 'SPOTIFY_CLIENT_ID:SPOTIFY_CLIENT_SECRET' | base64)" \
     -d "grant_type=authorization_code&redirect_uri=http://localhost/callback/&code={CODE}"
   ```

   The response JSON contains your `refresh_token`. This token is valid indefinitely unless you revoke access.

## Deployment

Install the Vercel CLI:

```bash
npm install -g vercel
```

Link and set up the project:

```bash
vercel
```

Add your environment variables in [Vercel Project Settings](https://vercel.com/docs/environment-variables), or via CLI:

```bash
vercel env add SPOTIFY_CLIENT_ID
vercel env add SPOTIFY_CLIENT_SECRET
vercel env add SPOTIFY_REFRESH_TOKEN
```

### Local development

Pull env vars and start the dev server:

```bash
vercel env pull .env.local
npm start
```

### Production

```bash
npm run deploy
```

## Query parameters

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| `theme` | `light`, `dark` | `light` | Card color theme |
| `demo` | `true` | — | Show sample data (no Spotify API call) |
