FROM node:10-alpine

WORKDIR /app

RUN apk upgrade -U \
  && apk add ca-certificates ffmpeg libva-intel-driver \
  && rm -rf /var/cache/*

COPY . /app

COPY package.json package.json

COPY yarn.lock yarn.lock

RUN yarn install --silent

RUN yarn global add nodemon

RUN echo "FFMPEG installed at: $(which ffmpeg)"
RUN echo "NODEJS installed at: $(which node)"
RUN echo "FFMPEG version is: $(ffmpeg -version)"
RUN echo "NODEJS version is: $(node -v)"
RUN echo "YARN version is: $(yarn -v)"

RUN which ffmpeg

RUN export FFMPEG_PATH=$(which ffmpeg)

RUN export MEDIA_ROOT=/app/media

EXPOSE 8000

EXPOSE 1935
