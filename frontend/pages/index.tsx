import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'

const inter = Inter({ subsets: ['latin'] })

//  001220
//  FA7268
// C62368

export default function Home() {
  return (
    <>
      <Navbar />
      <main className=' bg-[url("/canvas2.jpg")] bg-cover bg-fixed bg-no-repeat'>
        <Hero />
        <Features />
      </main>
    </>
  )
}
