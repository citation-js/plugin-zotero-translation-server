const spawn = require('child_process').spawn

switch (process.argv[2]) {
  case 'start': {
    spawn('npm', ['start'], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    })

    process.exit(0)
  }
}
