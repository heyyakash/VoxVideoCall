import React from 'react'

const Hero = () => {
    return (
        <section className='w-full relative z-0 min-h-[100vh]'>
            <div className='w-full absolute h-full bg-gradient-to-b from-black/70 via-black/70 to-transparent'></div>
            <div className='text-center w-full h-full relative z-10 pt-[12rem] '>
                <h2 className='font-bold text-[3.2rem] leading-[3rem]'>Yet Another</h2>
                <h2 className='font-bold text-[3.2rem] bg-gradient-to-r from-sec via-purple-500 to-white bg-clip-text text-transparent'>Videocalling and Chat Application</h2>
                <div className='max-w-[1200px] mx-auto  relative bg-black/10 rounded-lg overflow-hidden drop-shadow-lg backdrop-blur-lg mt-[5rem]'>
                    <img src="/ss.png" alt="screenshot " className='opacity-90 w-full h-full' />
                    {/* <div className='w-full absolute z-10 h-full top-0 bg-gradient-to-t from-black/70  to-transparent'></div> */}
                </div>
                

            </div>

        </section>
    )
}

export default Hero