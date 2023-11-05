import { errorImageHandler } from '@/helpers/profileImageErrorHandler'
import React, { useEffect, useRef } from 'react'

interface props {
    email: string
    image: string
    name: string
    cols: number
    stream: MediaStream
}

const VideoElement:React.FC<props> = ({email, image, cols, name, stream }) => {
    const videoElem = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        if(videoElem.current){
            videoElem.current.srcObject = stream
        }
    },[])
    return (
        <div id={email} className={`w-full relative overflow-hidden ${cols === 1 ? "h-[80vh]" : cols === 2 ? "h-[50vh]" : "h-[315px]"} trans object-cover bg-black/50 rounded-xl`}>
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 flex items-end gap-3 via-transparent p-3 to-transparent'>
                <img src={image} onError={(e)=>errorImageHandler(e)} className='rounded-full border-2 border-red-400 w-10 h-10 object-cover' alt="" />
                <p className='mb-[.5rem]'>{name}</p>
            </div>
            <video ref = {videoElem} id={`${email}-video`} className='w-full h-full object-cover' autoPlay playsInline controls={false} ></video>
        </div> 
  )
}

export default VideoElement