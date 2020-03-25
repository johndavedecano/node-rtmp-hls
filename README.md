# NodeJS RTMP HLS Server

Based on node-media-server. A live streaming server that allow adaptive bitrate for HLS.

## Making it work using docker-compose

```
docker-compse build
docker-compose up
docker-compose down
```

## Making it work without using docker-compose

You have to make sure that you have ffmpeg installed on your machine

```
cp .env.example .env
yarn install
yarn start:dev # development
yarn start # production
```

### Environment Variables

```
NODE_ENV=development

# Where to store the playlist files
MEDIA_ROOT=./media

# Where is ffmpeg executable located. Run which ffmpeg
FFMPEG_PATH=/usr/bin/ffmpeg

# URL to notify when a stream starts.
# Usually used for authentication.
PUBLISH_START_NOTIFY_URL=

# URL to notify when a stream stoppes
PUBLISH_STOP_NOTIFY_URL=
```

### Installing FFMPEG on Centos

```
wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
tar -xf ffmpeg-release-amd64-static.tar.xz
sudo mkdir -p /usr/local/bin/ffmpeg
sudo mv ./ffmpeg-4.2.2-amd64-static/* /usr/local/bin/ffmpeg
sudo ln -s /usr/local/bin/ffmpeg/ffmpeg /usr/bin/ffmpeg
sudo ln -s /usr/local/bin/ffmpeg/ffprobe /usr/bin/ffprobe
# Verify installation
which ffmpeg && ffmpeg -version
```

## From OBS

```
Settings -> Stream
Stream Type : Custom Streaming Server
URL : rtmp://localhost:1935/live
Stream key : STREAM_NAME
```

## Accessing the live stream

```
HLS - http://localhost:8000/live/STREAM_NAME/index.m3u8
FLV - http://localhost:8000/live/STREAM_NAME.flv
WSS - ws://localhost:8000/live/STREAM_NAME.flv
RTMP - ws://localhost:8000/live/STREAM_NAME
```

## Cluster Mode

Ask me how
