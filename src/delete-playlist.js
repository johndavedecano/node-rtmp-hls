const fs = require('fs')

module.exports = name => {
  return new Promise(resolve => {
    fs.unlink(`${process.env.MEDIA_ROOT}/live/${name}.m3u8`, function(err) {
      if (err) {
        console.log(err.message)
      }
      resolve()
    })
  })
}
