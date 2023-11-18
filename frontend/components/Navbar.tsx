import React from 'react'
import Logo from './Logo'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Navbar = () => {
    const router = useRouter()
    return (
        <nav className='fixed h-[80px] w-full z-[100] bg-black/30 backdrop-blur-lg '>
            <div className='flex items-center px-4 lg:px-0 h-full justify-between max-w-[1200px] w-full mx-auto '>
                <div className='flex items-center gap-4'>
                    <Logo version='lite' />
                    <p className='text-xl'>vox</p>
                </div>
                <div className=' gap-[2rem] border-2 border-sec/20 trans font-semibold p-2 px-4 rounded-[30px] md:flex-center hidden'>
                    <a href="#about" className='trans hover:text-sec '>About</a>
                    <a href="#feature" className='trans hover:text-sec '>Features</a>
                    <a href="https://github.com/heyyakash/videocallapp" target='_blank' className='trans hover:text-sec '>Github</a>
                </div>
                <Link
                    href="/login"
                    className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-bold text-white rounded-md shadow-2xl group"
                >
                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-br from-sec to-tert group-hover:opacity-100" />
                    {/* Top glass gradient */}
                    <span className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3" />
                    {/* Bottom gradient */}
                    <span className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5" />
                    {/* Left gradient */}
                    <span className="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5" />
                    {/* Right gradient */}
                    <span className="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5" />
                    <span className="absolute inset-0 w-full h-full border border-white rounded-md opacity-10" />
                    <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5" />
                    <span className="relative">Login</span>
                </Link>

            </div>
        </nav>
    )
}

export default Navbar