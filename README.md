
Certainly! Here's the documentation in markdown format:

# Vox - A 🚀 realtime Video Calling and Chat Application 📹💬

## Introduction
Vox is not just another video calling app; it's a real-time video calling and chat extravaganza! 🌟 Built using the magic of WebRTC and WebSockets, with a frontend that dances to the rhythm of NextJS and a backend that grooves to the beats of Golang. Users can simply sign in, create a room, and bam! Start a video call fiesta with friends and family. 🎉

## Tech Stack
### Frontend
- NextJS 🚀
- Tailwind CSS 💅

### Backend
- Golang 🐹

## Before Installation 🛠️
1. Install nodejs and npm from [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) 🌐
2. Install golang from [here](https://go.dev/doc/install) 📦
3. Install Docker from [here](https://docs.docker.com/engine/install/) 🐳

## Installing locally for development 🚧
1. First, Clone the repo to your local device 🧑‍💻
2. Create an account on Google Cloud Console, enable OAuth 2.0 [Instructions](https://support.google.com/cloud/answer/6158849?hl=en#zippy=%2Cuser-consent) 🌐
3. Navigate to the backend directory
4. Create a .env file and add the following details:
    ```env
    MONGO_URL=<YOUR_MONGO_DB_URL>
    GOOGLE_OATUH_CLIENT_ID=<YOUR_GOOGLE_OAUTH_CLIENT>
    GOOGLE_OAUTH_CLIENT_SECRET=<YOUR_OAUTH_CLIENT_SECRET>
    GOOGLE_OAUTH_REDIRECT_URL=<YOUR_OAUTH_CLIENT_URL>
    CLIENT_ORIGIN=http://localhost:3000
    ```
5. Open the terminal in the backend directory and run the following commands:
    ```bash
    $ docker build -t backend .
    ```
6. Once the docker image is built without any errors, you will see the image with the name 'backend' appear on your docker registry. Verify using:
    ```bash
    $ docker images
    ```
7. To run the docker image:
    ```bash
    $ docker run -d -p 5000:5000 --name backend backend
    ```
8. The backend server is up and running 🚀
9. Navigate to the Frontend directory and run the following commands:
    ```bash
    $ npm i
    ```
10. After the installation is done, run:
    ```bash
    $ npm run dev
    ```
11. Now the frontend is up and running.

## Usage 🎉
1. To start a video call, sign in first 🚀
2. Once logged in, you'll enter a page with options to create a room or join one 🕺
3. In the room, send the link to your friends so they can join the party 🎉
4. Enjoy the virtual hangout!

## How it works 🧠
1. Enter/create a room, and the magic begins with a websocket connection to the backend 🌐
2. Others can join by pasting the room link, triggering a ==join-room== event broadcast to all members. 📡
3. Existing members create a new RTC Client, send an offer to the new guest, who then creates their RTC client, answers, and sends responses back to offerers. (WebRTC magic in a nutshell!) 🎩✨
4. Learn more about WebRTC with this reference video [link](https://www.youtube.com/watch?v=JTIm3ChI-6w) 📺
5. The app uses a Mesh Structure to handle all users in a room (because why not!) 🤖
6. For more on WebRTC architectures, check out [this article](https://medium.com/@toshvelaga/webrtc-architectures-mesh-mcu-and-sfu-12c502274d7) 📚
7. Due to the mesh architecture, performance might groove a bit less with each new member entering the room, but it's all good with a handful of pals! 🕺🎶

