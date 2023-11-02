import React from 'react'
import Logo from './Logo'

const Loading = () => {
  return (
    <div className='fixed w-full z-[1000] bg-[#001220] h-[100vh] grid place-items-center'>
        <div className=' animate-pulse scale-75'>
            <Logo />
        </div>
    </div>
  )
}

export default Loading