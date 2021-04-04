const { Server } = require('net')

const host = '0.0.0.0'

const END = 'END'

const ERR = 'ERR'

const connections = new Map()

const error = err => {
  console.error(err)
  process.exit(1)
}

const sendMessage = (message, origin) => {
  // Send the message to all except to origin
  for (const socket of connections.keys()) {
    if (socket !== origin) {
      socket.write(message)
    }
  }
}

const listen = port => {
  const server = new Server()
  server.on('connection', socket => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`

    console.log(`New connection from ${remoteSocket}`)
    socket.setEncoding('utf-8')

    socket.on('data', data => {
      let existingUsername = false
      for (const username of connections.values()) {
        if (username === data) {
          existingUsername = true
        }
      }
      console.log(data);
      if (existingUsername) {
        socket.write(`${ERR}: Existing username`)
      } else {
        if (!connections.has(socket)) {
          console.log(`Username ${data} set for connection ${remoteSocket}`)
          connections.set(socket, data)
        } else if (data === END) {
          connections.delete(socket)
          socket.end()
        } else {
          // Send to the rest of the clients the message
          const fullMessage = `[${connections.get(socket)}]: ${data}`
          console.log(`${remoteSocket} -> ${fullMessage}`)
          sendMessage(fullMessage, socket)
        }
      }

      socket.on('close', () =>
        console.log(`Connection with ${remoteSocket} closed`)
      )
    })
  })

  server.listen({ port, host }, () => {
    console.log('Listening on port 8000')
  })

  server.on('error', err => error(err.message))
}

const main = () => {
  if (process.argv.length !== 3) {
    console.error(`Usage: node ${__filename} port`)
  }

  let port = process.argv[2]
  if (isNaN(port)) {
    error(`Invalid port ${port}`)
  }

  port = Number(port)
  listen(port)
}

if (require.main === module) {
  main()
}
