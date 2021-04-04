const { Socket } = require('net')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const socket = new Socket()

const END = 'END'

const error = err => {
  console.error(err)
  process.exit(1)
}

const connect = (host, port) => {
  console.log(`Connecting to ${host}:${port}`)

  const socket = new Socket()
  socket.connect({ host: 'localhost', port: 8000 })
  socket.setEncoding('utf-8')

  socket.on('connect', () => {
    console.log('Connected')

    readline.question('Choose your username: ', (username) => {
        socket.write(username)
        console.log(`Type any message to send it, type ${END} to finish it`)
    })

    readline.on('line', line => {
      socket.write(line)
      if (line === END) {
        socket.end()
      }
    })

    socket.on('data', data => {
      console.log(data)
    })
  })

  socket.on('error', err => error(err.message))
}

const main = () => {
  if (process.argv.length !== 4) {
    console.error(`Usage: node ${__filename} host port`)
  }

  let [, , host, port] = process.argv
  if (isNaN(port)) {
    error(`Ìnvalid port ${port}`)
  } else {
    port = Number(port)
    connect(host, port)
  }
}

if (require.main === module) {
  main()
}
