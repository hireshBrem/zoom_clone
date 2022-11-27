import { Server, SignalingChannel } from 'socket.io'
import RTCPeerConnection from 'socket.io'
import { renderToHTML } from 'next/dist/server/render'

const SocketHandler = async (req, res) => {

  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')

    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      
      socket.on("connected", () =>{
        console.log("connected!")
      })
      socket.on("join-room", (roomID) => {
        socket.join(roomID)
      })

      socket.on("transfer_id", (id, roomID) => {
        socket.to(roomID).emit("transfer_id", id)
      })

      socket.on("send_msg", (msg, roomID) =>{
        socket.to(roomID).emit("send_msg", msg)
      })

      socket.on("disconnected", (roomID) => {
        socket(`Socket has left ${roomID}`)
        socket.leave(roomID)
      }) 
    })
  }
  res.end()
}

export default SocketHandler
