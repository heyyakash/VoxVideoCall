import React, { useState } from 'react'
import { MdHomeFilled } from 'react-icons/md'
import { IoMdSettings } from 'react-icons/io'
import { BsFillCameraVideoFill, BsFillGrid3X3GapFill, BsFillGridFill, BsFillMicFill, BsFillSquareFill } from 'react-icons/bs'
import { PiPhoneDisconnectFill } from 'react-icons/pi'
import { message } from '@/types/message'
import Chat from './Chat'


const Room = () => {
    const [copied, setCopied] = useState(false)
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const [cols, setCols] = useState(3)
    const [chats, setChats] = useState<message[]>([])
    const copyRoomId = (text: string) => {
        try {
            navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 3000)
        } catch (Err) {
            console.log(Err)
        }
    }
    return (
        <>
            <div className='h-[100vh] bg-prim/75 backdrop-blur-[100px] flex'>
                <div className='w-[100px] relative flex flex-center bg-black/40 '>
                    <div className='flex text-2xl text-prim w-full flex-col gap-4'>
                        <div className='flex-center w-full h-[50px] border-r-2 border-r-sec'>
                            <MdHomeFilled className='text-sec cursor-pointer' />
                        </div>
                        <div className='flex-center w-full h-[50px]  '>
                            <IoMdSettings className='cursor-pointer' />
                        </div>

                    </div>
                </div>

                {/* Video  */}
                <div className='flex-1 bg-[url("/test-bg.svg")] bg-no-repeat bg-cover'>

                    {/* Header */}
                    <div className='w-full flex relative flex-col h-full backdrop-blur-[100px]  bg-prim/90'>
                        <div className='absolute left-[50%] -translate-x-[50%] h-[60px] gap-4 px-5 py-10 bottom-[2rem] bg-black/80 rounded-xl flex flex-center'>
                            <div className='p-4 cursor-pointer trans hover:bg-white/10 rounded-full'>
                                <BsFillMicFill />
                            </div>
                            <div className='p-4 cursor-pointer text-white bg-red-500 trans hover:bg-white/10 rounded-full'>
                                <PiPhoneDisconnectFill />
                            </div>
                            <div className='p-4 cursor-pointer trans hover:bg-white/10 rounded-full'>
                                <BsFillCameraVideoFill />
                            </div>
                        </div>
                        <div className='w-full p-10 h-[100px] border-b border-b-black relative flex items-center'>

                            <h3 className='text-xl font-bold'>#243314-21323123-2132</h3>
                            <button disabled={copied} onClick={() => copyRoomId("123232-34243-3243-434")} className='bg-sec trans mx-3 px-2 py-[2px] rounded-md font-semibold'>
                                {copied ? "Copied" : "Copy"}
                            </button>
                            <div className='ml-auto  trans flex items-center gap-4 text-2xl'>
                                <div onClick={() => setCols(1)} className={`p-2  cursor-pointer ${cols === 1 ? "border-b-2 border-b-sec" : ""}`}>
                                    <BsFillSquareFill className={`${cols === 1 ? "text-sec" : "text-gray-500"}`} />
                                </div>
                                <div onClick={() => setCols(2)} className={`p-2  cursor-pointer ${cols === 2 ? "border-b-2 border-b-sec" : ""}`}>
                                    <BsFillGridFill className={`${cols === 2 ? "text-sec" : "text-gray-500"}`} />
                                </div>
                                <div onClick={() => setCols(3)} className={`p-2  cursor-pointer ${cols === 3 ? "border-b-2 border-b-sec" : ""}`}>
                                    <BsFillGrid3X3GapFill className={`${cols === 3 ? "text-sec" : "text-gray-500"}`} />
                                </div>
                            </div>
                        </div>
                        <div style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} className='grid h-full overflow-auto trans p-8 grid-rows-auto gap-8  w-full'>
                            {arr.map((x) => {
                                return (
                                    <div key={x} className={`w-full ${cols === 1 ? "h-[80vh]" : cols === 2 ? "h-[50vh]" : "h-[400px]"} trans bg-black/50 rounded-xl`}></div>
                                )
                            })}
                        </div>
                    </div>



                </div>

                {/* Chat */}
                <div className='w-[450px] h-full'>
                    <Chat chats={chats} setChats={setChats} />
                </div>
                <div></div>
            </div>
        </>
    )
}

export default Room