import Head from 'next/head'
import {useState } from 'react';

export default function Home() {
  const[roomId, setRoomId] = useState("")

  function handleClick () {
    console.log(audio)
  }

  return (
    <>
      <Head>
        <title>Zoom Clone | By Hiresh</title>
      </Head>
      <div className='max-w-3xl m-auto font-poppins'>
        <button onClick={()=>handleClick()}>dwdwd</button>
        <h1 className="text-center my-16 text-[35px] text-cyan-600">Welcome to my Zoom clone!</h1>
        <label htmlFor="helper-text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Room ID</label>
        <input onChange={(e)=>setRoomId(e.target.value)} type="email" id="helper-text" aria-describedby="helper-text-explanation" className="bg-gray-50 my-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="room123" />
        <div className='flex justify-center'>
          <a href={`/${roomId}`}>
            <button type="button" className="text-cyan-700 text-[30px] bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg px-10 py-2.5 text-center mr-2 mb-2">Join Call</button>
          </a>
        </div>
      </div>
    </>
  )
}

// export async function getServerSideProps(context) {
  
//   const devices = await context.req
//   console.log(devices)
//   return { 
//     props: {
//     intialDevices: ["dwd"] 
//   } 
//   }
// }