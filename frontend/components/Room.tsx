import React from 'react'
import backimg from '../public/test-bg.svg'


const Room = () => {
  return (
    <div style = {{backgroundImage:backimg}} className={`h-[100vh]`}>
    <div className='h-full bg-black/40 flex'>
        <div className='w-[100px] '></div>
        <div className='flex-1 '></div>
        <div className='w-[450px] '></div>
        <div></div>
    </div>
    </div>
  )
}

export default Room