<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/kurrx/tv.kurr.dev/blob/main/docs/banner-dark.png?raw=true">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/kurrx/tv.kurr.dev/blob/main/docs/banner-light.png?raw=true">
  <img alt="Banner" src="https://github.com/kurrx/tv.kurr.dev/blob/main/docs/banner-light.png?raw=true">
</picture>

<h1 align="center">tv.kurr.dev</h1>

<p align="center">All-in-one movie web app with YouTube-like player experience</p>

## Overview

This project is a web application that allows you to watch Movies, TV Shows, Anime in one place. It
is designed to be a simple and easy-to-use platform that provides a YouTube-like player experience.
App works by displaying video files from third-party providers inside an intuitive and aesthetic
user interface. Content is fetched from third parties and scraping is fully done on the client. This
means that the hoster has no files or media on their server. All files are streamed directly from
the third parties.

You can find the live version of the application at [tv.kurr.dev](https://tv.kurr.dev).

### Features

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/kurrx/tv.kurr.dev/blob/main/docs/player-dark.png?raw=true">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/kurrx/tv.kurr.dev/blob/main/docs/player-light.png?raw=true">
  <img alt="Player Screenshot" src="https://github.com/kurrx/tv.kurr.dev/blob/main/docs/player-light.png?raw=true">
</picture>

- **YouTube-like player experience** - Keyboard shortcuts on desktop, gesture based controls on
  mobile, picture-in-picture, full-screen mode, theater mode, timeline seeking, volume controls,
  thumbnails preview, subtitles, localized audio tracks, etc.

- **Progress** - The app keeps track of your progress in the series and movies you watch. You can
  always continue watching from where you left off.

- **Continuous Play** - The app automatically plays the next episode / next film in cinematic
  universe in the series.

- **Explore** - Discover new titles by genre, year, rating, collections, cinematic universes, etc.

- **Share** - Send exact time of the video to your friends.

- **Profile** - Save titles to your favorite, watch, watched, rated lists.

### Tech Stack

Project is created with: [TypeScript](https://typescriptlang.org), [React](https://react.dev),
[RTK](https://redux-toolkit.js.org), [Firebase](https://firebase.google.com) (Auth, Firestore,
Realtime Database), [shadcn/ui](https://ui.shadcn.com),
[react-player](https://npmjs.com/package/react-player), [Dexie](https://dexie.org),
[CORS Proxy](https://github.com/kurrx/cors-proxy) and more.

The main goal behind these decisions is to create movie web app without any expenses.

#### Firebase

For my purposes Firebase provides a free tier that is enough for my needs. But you may ask _"Why
Firestore and Realtime Database?"_ Fair question.

**Realtime Database** pricing model is based on the amount of data stored and the amount of data
downloaded. It's a good choice for entities that are updated frequently and not too large. For that
reason I use it to store user's playback settings such as last watched title, where the user left
off, etc.

**Firestore** pricing model is based on the number of reads, writes, and deletes. It's a good choice
for entities that are not updated frequently. For that reason I use it to store the main data such
as users saved, watched, rated, favorite titles, etc.

#### Dexie

I also use Dexie to store data in a browser's IndexedDB. This allows me to cache responses on the
client side in order to reduce the load on the my proxy server and speed up the application load
time in general. I invalidate the cache every 24 hours. This is done to avoid the situation when the
data is outdated (in case when new episode is released, etc).

#### CORS Proxy

I use my own CORS Proxy server to bypass CORS restrictions of the browser. This is necessary because
I scrape data from a site that does not provide an API and does not have CORS headers set up. You
can find more information about the server in the [CORS Proxy](https://github.com/kurrx/cors-proxy)
repository.

## Getting Started

### Installation

```shell
# Clone git repository
git clone https://github.com/kurrx/tv.kurr.dev.git
cd tv.kurr.dev

# Install dependencies
npm install

# Create development .env from example, and edit it
cp .env.example .env.development.local

# Start development server
npm run start
```

### Configuration

First, you need to create a `.env.development.local` file in the root of the project. This file will
contain all the environment variables that are required for the application to work. You can use the
`.env.example` file as a template.

```
...

VITE_PROVIDER_URL=https://example.com
VITE_PROXY_URL=https://example.com

VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=AUTH_DOMAIN_HOST
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=STORAGE_BUCKET_HOST
VITE_FIREBASE_MESSAGING_SENDER_ID=SENDER_ID
VITE_FIREBASE_APP_ID=APP_ID
VITE_FIREBASE_DB_URL=DB_URL

...
```

- `VITE_FIREBASE_*` - To configure these settings you need to be familiar with Firebase and its
  services. You can find more information about Firebase in the
  [official documentation](https://firebase.google.com/docs). All variables can be found in the
  [Firebase Console](https://console.firebase.google.com/) in your project settings.

- `VITE_PROVIDER_URL` - URL of the site providing the data. This project is designed to work with
  one specific website that I will not disclose for safety reasons. You can use any other site that
  provides similar data (otherwise you need to change all typings and adjust it for yourself). Keep
  in mind that you also need to change the code that scrapes the data from the site in following
  files: `api/ajax.ts`, `api/parser.ts`.

- `VITE_PROXY_URL` - URL of the proxy server. This server is used to bypass CORS restrictions of
  browser. For that purposes you can use my project -
  [CORS Proxy](https://github.com/kurrx/cors-proxy).

## Copyright Infringement

I created this application categorically for the purpose of training and demonstrating my skills as
a professional in my field. I do not pursue the purpose of distribution or sale of copyrighted video
content. I don't host any files, it merely links to 3rd party services. Legal issues should be taken
up with the file hosts and providers. I'm not responsible for any media files shown by the video
providers.

Access to my application is highly restricted and is only available on **read-only mode**. No one
can access the copyrighted video content without my permission. Even when access to the site is
granted, it is for purely demonstrative purposes, and access will be revoked shortly after that. I
do not store any copyrighted data on my server and do not publicly provide any download/streaming
links to the content.

All material and data I take from public sources using Web Scraping. If you are a copyright holder
and want to remove content from the app you must do so on the site providing the data
([link for provider you can find here](https://tv.kurr.dev/policy)). I respect the intellectual
property of others. If you believe that your work has been copied in a way that constitutes
copyright infringement, please contact with me in a way that is convenient for you using the links
on [my website](https://kurr.dev).

## License

The MIT License

Copyright (C) 2024 Kurbanali Ruslan <ruslan@kurr.dev>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
