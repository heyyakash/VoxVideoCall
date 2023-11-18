import React, { FC, ReactNode } from 'react'
import { BsChat, BsFillChatFill } from 'react-icons/bs';
import { TbHandClick } from "react-icons/tb";
import { CiVideoOn } from "react-icons/ci";
import { MdOutlineCleaningServices } from "react-icons/md";
import { FaArrowPointer } from "react-icons/fa6";
import Image from 'next/image';



interface BoxProps {
  children: ReactNode
}


export const Box: FC<BoxProps> = ({ children }) => {
  return (
    <div className='w-full grid place-items-center h-[500px] lg:min-h-[100vh] relative'>
      {children}
    </div>
  )
}

export const Feature1 = () => {
  return (
    <>
      <div className='absolute w-full h-full top-0 left-0 z-0 bg-gradient-to-b from-transparent via-black/80 to-black'></div>
      <div className='absolute w-full h-full top-0 left-0 z-0 bg-[url("/gp5.png")] bg-contain bg-bottom animate-pulse'></div>
      <div className='w-full h-[100vh] relative flex-center flex-col'>
        <h1 className='bg-gradient-to-r -mt-[5rem] from-red-400  to-white bg-clip-text text-transparent'>Room creation in 1 click </h1>
        <p className='text-lg -mt-2'>Want to call friends? Just one click away!</p>
        <div className=' relative h-auto w-[350px] mt-5'>
          <button className='btn-primary w-[350px] relative'>Create room</button>
          <FaArrowPointer className='text-2xl absolute animate-bounce text-black z-10 -bottom-2 left-[60%] ' />
        </div>
      </div>
    </>
  )
}


export const Feature2 = () => {
  return (
    <>
    <div className='absolute w-full h-full top-0 left-0 z-0 bg-black'></div>
      <div className='w-full h-[100vh] relative flex-center  flex-col'>
        <h1 className='bg-gradient-to-r -mt-[5rem] from-purple-400  to-green-400 bg-clip-text text-center text-transparent'>Seamless Video calls with Inbuild Chat </h1>
        <p className='text-lg -mt-2'>Connect to Everyone!</p>
        <div className=' relative h-auto w-[350px] mt-5'>
        <div className=' relative h-auto w-[350px] mt-5'>
          <button className='btn-primary w-[350px] relative'>Join room</button>
          <FaArrowPointer className='text-2xl absolute animate-bounce text-black z-10 -bottom-2 left-[60%] ' />
        </div>
          <div className='flex w-[800px] bg-white gap-4 mt-10'>
            
          </div>
        </div>
      </div>
    </>
  )
}

const Features = () => {
  return (
    <section id = "feature" className='mb-[5rem]  w-full'>
      <div className='w-full md:p-0 mx-auto'>

        <Box>
          <Feature1 />
        </Box>
        <Box>
          <Feature2 />
        </Box>
      

      </div>
    </section>
  )
}



export default Features