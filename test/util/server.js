const spawn = require('child_process').spawn

switch (process.argv[2]) {
  case 'start':
    const server = spawn('npm', ['start'], {
      detached: true,
      windowsHide: true
    })

    server.stdout.on('data', function (data) {
      data = data.toString('utf8')
      console.log(data)
      if (data.indexOf('Listening on 0.0.0.0:1969') > -1) {
        process.exit(0)
      }
    })
    server.stderr.on('data', function (data) {
      console.error(data.toString('utf8'))
    })
}
