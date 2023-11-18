import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import { FaHeart } from 'react-icons/fa6'

const inter = Inter({ subsets: ['latin'] })

//  001220
//  FA7268
// C62368

export default function Home() {
  return (
    <>
      <Navbar />
      <main className=' bg-[url("/canvas2.jpg")]  bg-cover bg-fixed bg-no-repeat'>
        <Hero />
        <Features />
      </main>
      <footer className='my-2 font-semibold text-center w-full flex items-center gap-2 justify-center'>
        Crafted with <span className='text-pink-500'><FaHeart /></span> by Akash Sharma
      </footer>
    </>
  )
}
