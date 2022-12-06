import http from 'http'
import Socket from 'socket.io'
// import Redis from 'ioredis';

export default function () {
  this.nuxt.hook('render:before', (renderer) => {
    
    const server = http.createServer(this.nuxt.renderer.app)
    const io = new Socket(server, {
      cors: {
	      origin: ['https://www.gotourgether.com/'],
	      methods: ["GET", "POST", "REMOVE"],
      }
    })

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => new Promise(resolve => server.listen(port || process.env.PORT || 3000, host || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'), resolve))
    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close))

    // Add socket.io events
    
    // var redis = new Redis();
    // redis.subscribe('get-chat-rooms');
    // redis.on('message', function(channel, message) {
    //   io.emit(channel, message);
    // });

    io.on('connection', (socket) => {
      socket.on("chat-messages", (data) => {
        io.emit("chat-messages", data);
      });

    })
  })
}
