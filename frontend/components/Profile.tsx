import { getUser } from '@/api/user'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FiLogOut } from 'react-icons/fi'
import Loading from './Loading'
import { userDetails } from '@/types/userDetails'

const Profile = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<userDetails | null>(null)
    const [roomId, setRoomId] = useState("")
    const createRoom = async () => {
        try {
            const data = await fetch("http://localhost:5000/room/create")
            const res = await data.json()
            if (res.success) {
                router.push(`/test/${res.message}`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        getUserDetails()

    }, [])


    const signOut = () => {
        localStorage.removeItem("vox_user")
        router.push('/login')
    }

    const getUserDetails = async () => {
        const data = await getUser()
        if (!data.success) {
            router.push('/login')
            return
        }
        console.log(data.message)
        setUser(data.message)
        setLoading(false)
    }

    const joinRoom = () => {
        if (roomId.length !== 0) {
            router.push(`test/${roomId}`)
        }
    }

    if(loading){
        return <Loading />
    }
    return (
        <section className='min-h-[100vh] relative bg-[url("/bg5.svg")] bg-cover'>
            <div className="absolute top-3 z-[100] right-3 p-2 flex gap-2">
                <div className='rounded-lg bg-white text-black flex items-center gap-3 p-3 padding text-sm font-semibold'>
                    <img className='w-7 h-7 rounded-full' src={user?.image} alt="photo" />
                    {user?.name}
                </div>
                <button onClick={() => signOut()} className='bg-red-500 trans rounded-lg font-bold cursor-pointer px-6 text-sm'>
                    <FiLogOut />
                </button>
            </div>
            <div className=' absolute inset-0 z-10 flex-center flex-col gap-[2rem]'>
                <div className='flex-center flex-col'>
                    <h1>Start a Video Call</h1>
                    <p className='w-[60%] text-center font-semibold text-gray-300'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam reiciendis adipisci sit quam deserunt. Adipisci?</p>
                </div>
                <div className='max-w-[900px] w-full flex-center gap-5'>


                    <div className=' w-full p-4'>
                        <button onClick={() => createRoom()} className='w-full p-4 text-lg font-bold mt-3 bg-[#FA7268] rounded-lg'>Create</button>
                    </div>
                    <h2>/</h2>
                    <div className=' w-full p-4'>
                        <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder='Room Id' className='input-primary' />
                        <button onClick={() => joinRoom()} className='w-full p-4 text-lg rounded-lg font-bold mt-3 bg-[#FA7268]  '>Join</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Profile