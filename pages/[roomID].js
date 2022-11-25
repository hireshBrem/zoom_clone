import Head from 'next/head'
import Script from 'next/script'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import {io} from 'socket.io-client'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faMicrophone, faMicrophoneSlash, faCamera, faVideoCamera} from '@fortawesome/free-solid-svg-icons'

let socket
let peer

const Room = ({}) => {  
  const router = useRouter()
  const { roomID } = router.query
  const[audio, setAudioDevices] = useState([])
  const[videos, setVideos] = useState([])

  const[btnDisable, setBtnDisable] = useState(false)
  let audioIcon
  const[userAudio, setAudio] = useState(false)
  const[userVideo, setVideo] = useState(true)
  const[myId, setMyId] = useState("")
  const[peerId, setPeerId] = useState("")
  const[mediaStream, setMediaStream] = useState([])

  useEffect(()=>{
    import('peerjs').then(({ default: Peer }) => {
      connectionInitializer(Peer)
    });
  }, [])

  const connectionInitializer = async (Peer) => {
    await fetch("/api/socket", {
      method:"GET"
    })

    socket = io()
    peer = new Peer()
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
      getUserMedia2({video: userVideo, audio:userAudio}).then((stream) => {
        call.answer(stream)

        document.getElementById("vid1").srcObject = stream
        call.on("stream", (remoteStream)=>{
          console.log("Stream event")
          // document.getElementById("vid1").srcObject = remoteStream
          document.getElementById("vid2").srcObject = remoteStream
          setBtnDisable(true)
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

  async function handleClick(){
    let getUserMedia1 = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
    
    // await getUserMedia1({video:true, audio:true}).then((stream) => {
    //   document.getElementById("vid1").srcObject = stream  
    // })

    await getUserMedia1({video:userVideo, audio:userAudio}).then((stream) => {
      if(peerId!=[]){
        console.log("calling")
        let call =  peer.call(peerId, stream)
        document.getElementById("vid1").srcObject = stream
        
        call.on("stream", (remoteStream) => {
          console.log("Streaming")

          document.getElementById("vid2").srcObject = remoteStream
          
        })
      }     
    })

  }
  
  function handleVideo() {
    
  }

  function handleAudio() {
    if(userAudio===true){
      setAudio(false)
    }else{
      setAudio(true)
    }
  }

  
  return (
  <>
  <Head>
    <title>{roomID}</title>
  </Head>
  <div className='flex flex-wrap justify-center max-w-4xl m-auto bg-gradient-to-tr font-poppins from-teal-300 to-lime-200 rounded-md'>
      <h1 className='text-[30px] block underline my-5 text-purple-400'>Welcome to the room!</h1>
      <div className='flex flex-wrap justify-center'>
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

        <video id="vid1" autoPlay className='border-4 border-purple-400 rounded-md block w-80 m-5'></video>
        <video id="vid2" autoPlay className='border-4 border-purple-400 rounded-md block w-80 m-5'></video>
      </div>
      <div className='flex flex-wrap justify-center mb-44'>
        <button disabled={btnDisable} className='p-2 m-4 bg-purple-400 rounded-md text-white' onClick={()=>handleClick()}>Join Call</button>
        <button onClick={()=>handleVideo()} className='p-2 m-4 bg-purple-400 rounded-md text-white'><FontAwesomeIcon className='w-5' icon={faVideoCamera}></FontAwesomeIcon></button>
        <button onClick={()=>handleAudio()} className='p-2 m-4 bg-purple-400 rounded-md text-white '><FontAwesomeIcon width={"30px"} className='' icon={userAudio===true?(faMicrophone):(faMicrophoneSlash)}></FontAwesomeIcon></button>
      </div>
  </div>
  <button className='mx-10' onClick={()=>log()}>Debug</button>
      
  </>
)}

export default Room