# Spotify Playing Now API Svg Generator (tracks and episodes) 🚀 🎵

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Falexmarqs%2Fspotify-now-playing-svg)

Generate a dynamic SVG image for what you are listening right now in your Spotify account, via a serverless API of course!. After deploying to Vercel (see instructions below) you will be able to embed the dynamic svg in your github readme file (or other markdown file):

`<img src="<YOUR_VERCEL_APP_URL>/api" width="460" height="60">`

My live example:

<img src="https://spotify-now-playing-svg.vercel.app/api" width="460" height="60">

Built using:

- Typescript
- Render JSX/TSX to an HTML string with support of Preact (you can use other alternatives!)
- SVG with foreign object
- Vercel serverless functions (AWS lambda behind the scenes)
- Vercel CDN
- Spotify API

## Architecture

![Diagram architecture](/docs/diagram.png)

## Set up

The required environment variables for this app are in the `.env.example` (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN). To set up these variables check the following steps:

Create a Spotify developer app (more info [here](https://developer.spotify.com/documentation/general/guides/app-settings/) and [here](https://developer.spotify.com/documentation/general/guides/authorization-guide/)):

- Create a **spotify application**;
- Get the **SPOTIFY_CLIENT_ID** and **SPOTIFY_CLIENT_SECRET**;
- Edit settings and add `http://localhost/callback/` as your **Redirect URI**;
- For request authorization (log in and authorize access) navigate to: `https://accounts.spotify.com/authorize?client_id={SPOTIFY_CLIENT_ID}&response_type=code&scope=user-read-currently-playing&redirect_uri=http://localhost/callback/`. You will be redirected back to your specified redirect uri. The response query string should contains an authorization **CODE** (e.g. `https://example.com/callback?code={CODE}`);
- Create a **BASE64** encoded string that contains the client ID and client secret key in the following format: `SPOTIFY_CLIENT_ID:SPOTIFY_CLIENT_SECRET`, example: `1r8g4x9a3t3o5g7b5z4:2t8g4x9a3t3o5g7b5p8`. You can use this [tool](https://www.base64encode.org/) to encode it online;
- Run the following curl command to : `curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic {BASE64}" -d "grant_type=authorization_code&redirect_uri=http://localhost/callback/&code={CODE}" https://accounts.spotify.com/api/token`. This will return a JSON response containing the **SPOTIFY_REFRESH_TOKEN**. This token is valid indefinitely unless you revoke access;

## Deployment instructions

**Assumptions:** You already have a Vercel account (if not, create one)

Install Vercel globally to be able to run the project and deploy it later.

```
npm install -g vercel
```

To set up a Vercel project for this app, run:

```
vercel
```

Go to your project settings and add the required environment variables (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN). More info: https://vercel.com/docs/environment-variables.

To test locally and replicate your Vercel deployment environment without requiring a deploy each time a change is made, execute:

```
vercel dev
```

To create a deployment for a production environemnt, execute:

```
vercel --prod
```

Note (optional):
During the development/test you can expose your serverless API to the world using [ngrok](https://ngrok.com/) through your local machine.
