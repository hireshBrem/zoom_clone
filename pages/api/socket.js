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
      
      socket.on("join-room", (roomID) => {
        socket.join(roomID)
      })

      socket.on("transfer_id", (id, roomID) => {
        socket.to(roomID).emit("transfer_id", id)
      })

      socket.on("send_msg", (msg, roomID) =>{
        socket.to(roomID).emit("send_msg", msg)
      })

      // socket.on("start_call", (roomID) => {
      //   socket.broadcast.to(roomID).emit("recieve_call")
      // })

      // socket.on("rtc_send_offer", (offer, roomID) => {
      //   console.log("This is event offer => ", offer)
      //   socket.broadcast.to(roomID).emit("rtc_recieve_offer", offer)
      // })

      // socket.on("rtc_create_answer", (answer, roomID) => {
      //   socket.broadcast.to(roomID).emit("rtc_recieve_answer", answer, roomID)
      // })

      // socket.on("createOffer", (offer, roomID) => {
      //   socket.to(roomID).emit("receivedOffer", offer, roomID)
      //   console.log("Offer created => ", offer)
      // })
      
      // socket.on("dispatchAnswer", (answer, roomID)=>{
      //   socket.to(roomID).emit("receivedAnswer", answer)
      //   console.log("Answer created => ", answer)
      // })

      socket.on("disconnected", (roomID) => {
        socket(`Socket has left ${roomID}`)
        socket.leave(roomID)
      }) 
    })
  }
  res.end()
}

export default SocketHandler
