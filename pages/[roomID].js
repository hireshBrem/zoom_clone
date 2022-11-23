import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import {io} from 'socket.io-client'

let socket
let peer

const Room = ({}) => {

  const router = useRouter()
  const { roomID } = router.query
  const[audio, setAudioDevices] = useState([])
  const[videos, setVideos] = useState([])

  const[myId, setMyId] = useState("")
  const[peerId, setPeerId] = useState("")
  const[mediaStream, setMediaStream] = useState("")

  useEffect(()=>{
    connectionInitializer()
  }, [])

  const connectionInitializer = async () => {
    await fetch("/api/socket", {
      method:"GET"
    })

    socket = io()

    socket.on("connect", ()=>{
      socket.emit("join-room", roomID)
      console.log("Connected!")
    })
  
    socket.on("transfer_id", (remoteId) => {
      setPeerId(remoteId)
      console.log("Remote peer: ", remoteId)
    })
    socket.on("disconnect", ()=>{
      
    })

    peer = new Peer();

    peer.on('open', function(id) {
      setMyId(id)
      console.log('My peer ID is: ' + id);
      socket.emit("transfer_id", id, roomID)
    });
    
    peer.on("connection", (conn) => {
      console.log("Connected with another peer => ", conn)
    })
    
    peer.on('call', function(call) {
      let getUserMedia2 = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      console.log("peer receiving call...")
      getUserMedia2({video: true}).then((stream) => {
        call.answer(stream)
        call.on("stream", (remoteStream)=>{
          console.log("Stream event")
          document.getElementById("vid1").srcObject = remoteStream
          document.getElementById("vid2").srcObject = stream
        })

      }).catch(err => console.log(err))
    })

  }

  // Updates the select element with the provided set of cameras
  function updateCameraList(audioDevices) {
    setAudioDevices(audioDevices)
  }

  // Fetch an array of devices of a certain type
  async function getConnectedDevices(type) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === type)
  }

  // Get the initial set of cameras connected
  useEffect(()=>{
    const audioDevices = async () => (await getConnectedDevices('audioinput').then(r=>(r)));
    setAudioDevices(audioDevices)
    console.log(audio)   
  }, [])

  // Listen for changes to media devices and update the list accordingly
  useEffect(()=>{
    navigator.mediaDevices.addEventListener('devicechange', event => {
      const newCameraList = getConnectedDevices('audioinput');
      updateCameraList(newCameraList);
    });    
  }, [])

  async function handleClick(peer){
    var getUserMedia1 = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;

    getUserMedia1({video:true}).then((stream) => {
      if(peerId!=""){
        console.log("calling")
        let call =  peer.call(peerId, stream)

        document.getElementById("vid1").srcObject = stream
        
        call.on("stream", (remoteStream) => {
          console.log("Streaming")
          document.getElementById("vid1").srcObject = stream
          document.getElementById("vid2").srcObject = remoteStream
        })
      }     
    })

    // var getUserMedia1 = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;

    // await navigator.mediaDevices.getUserMedia({video:true}, stream=>console.log(stream))
    // await getUserMedia1({
    //   video: true,
    //   audio: true,
    //   video: {
    //     width: "600px"
    //   }
    // }).then((stream) => {document.getElementById("vid1").srcObject = stream})
    // .catch(err=>console.log(err))

  }

  
  return (
  <>
  <Head>
    <title>Room {roomID}</title>
  </Head>
  <div className='flex flex-wrap justify-center max-w-4xl m-auto bg-gradient-to-tr from-teal-300 to-lime-200 rounded-md text-cyan-500'>
      <h1 className='text-[30px] block'><u>Room:</u> <i>{roomID}</i></h1>
      <div className=''>
        {
          // videos.map((userVid, index)=>
          // {
          //   let media = userVid
          //   console.log(media)
          //   return(
          //     <video key={index} autoPlay className='rounded-md block'>
          //       <source srcObject={userVid}></source>
          //     </video>
          //   )
          // })
        }
        <video id="vid1" autoPlay className='rounded-md block'></video>
        <video id="vid2" autoPlay className='rounded-md block'></video>

      </div>
      <button className='mx-10' onClick={()=>log()}>Debug</button>
      <button onClick={()=>handleClick(peer)}>Click</button>
  </div>
  </>
)}

export async function getServerSideProps(context) {
  
  // const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
  // const pc = await new RTCPeerConnection(configuration)
  
  return {
    props: {
      peerConnection: null
    }, 
  }
}
export default Room