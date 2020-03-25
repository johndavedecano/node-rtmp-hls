const NodeMediaServer = require('node-media-server')
const isEmpty = require('lodash/isEmpty')
const config = require('./config')
const http = require('./http-client')
const createPlaylist = require('./create-playlist')
const deletePlaylist = require('./delete-playlist')

var nms = new NodeMediaServer(config)

var tokens = {}

const parseStreamName = streamPath => {
  return streamPath
    .replace('/hls_1080', '')
    .replace('/hls_720p', '')
    .replace('/hls_480p/', '')
    .replace('/hls_360p/', '')
    .replace('/stream/', '')
}

nms.on('prePublish', async (id, StreamPath, args) => {
  const streamName = parseStreamName(StreamPath)
  console.log(`${streamName} has started streaming`)
  if (args.streamKey && args.streamToken) {
    tokens[streamName] = {
      app: 'stream',
      streamKey: args.streamKey,
      streamToken: args.streamToken,
    }
  }

  if (tokens[streamName]) {
    let session = nms.getSession(id)
    if (!isEmpty(process.env.PUBLISH_START_NOTIFY_URL)) {
      await http
        .post(process.env.PUBLISH_START_NOTIFY_URL, tokens[streamName])
        .catch(err => {
          console.error(err.message)
          session.reject()
        })
    }
  }
})

nms.on('postPublish', async (_id, StreamPath, _args) => {
  if (StreamPath.indexOf('hls_') != -1) {
    const name = StreamPath.split('/').pop()
    createPlaylist(name)
  }
})

nms.on('donePublish', async (id, StreamPath, _args) => {
  const streamName = parseStreamName(StreamPath)
  console.log(`${streamName} has stopped streaming...`)
  if (tokens[streamName]) {
    let session = nms.getSession(id)
    if (!isEmpty(process.env.PUBLISH_STOP_NOTIFY_URL)) {
      await http
        .post(process.env.PUBLISH_STOP_NOTIFY_URL, tokens[streamName])
        .then(() => deletePlaylist(streamName))
        .catch(err => {
          console.error(err.message)
          session.reject()
        })
    }
  }
})

nms.run()
