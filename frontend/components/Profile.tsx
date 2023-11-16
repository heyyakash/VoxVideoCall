import { LogOut, getUser } from '@/api/user'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FiLogOut } from 'react-icons/fi'
import Loading from './Loading'
import { userDetails } from '@/types/userDetails'
import { errorImageHandler } from '@/helpers/profileImageErrorHandler'

const Profile = () => {
    const router = useRouter()
    const [creating,setCreating] = useState(false)
    const [connecting,setConnecting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<userDetails | null>(null)
    const [roomId, setRoomId] = useState("")
    const createRoom = async () => {
        try {
            setCreating(true)
            const data = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"/room/create")
            const res = await data.json()
            if (res.success) {
                router.push(`/test/${res.message}`)
            }
        } catch (error) {
            console.log(error)
            setCreating(false)
        }
    }

    useEffect(() => {

        getUserDetails()
        // getAwailableDevices()
    }, [])


    const signOut = async () => {
        localStorage.removeItem("vox_user")
        await LogOut()
        router.push('/login')
    }



    const getUserDetails = async () => {
        const data = await getUser()
        if (!data.success) {
            router.push('/login')
            return
        }
        setUser(data.message)
        setLoading(false)
    }

    const joinRoom = () => {
        setConnecting(true)
        if (roomId.length !== 0) {
            router.push(`test/${roomId}`)
        }
    }

    if(loading){
        return <Loading />
    }
    return (
        <section className='min-h-[100vh] relative bg-gradient-to-t from-slate-900/60 to-slate-900  '>
            <div className="absolute top-1 md:top-3 z-[100] w-full md:w-[auto] md:right-3 p-4 md:p-2 flex gap-2">
                <div className='rounded-lg bg-white w-full text-black flex items-center gap-3 p-3 padding text-sm font-semibold'>
                    <img onError={(e)=>errorImageHandler(e)} className='w-7 h-7 rounded-full' src={user?.image} alt="photo" />
                    {user?.name}
                </div>
                <button onClick={() => signOut()} className='bg-red-500 trans rounded-lg font-bold cursor-pointer px-6 text-sm'>
                    <FiLogOut />
                </button>
            </div>
            <div className=' absolute inset-0 z-10 flex-center flex-col gap-[2rem]'>
                <div className='flex-center flex-col'>
                    <h1 className='text-3xl md:text-[3.5rem] md:font-[700] mb-4'>Start a Video Call</h1>
                    <p className='w-[60%] text-center font-semibold text-gray-300'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam reiciendis adipisci sit quam deserunt. Adipisci?</p>
                </div>
                <div className='max-w-[900px] w-full flex flex-col items-center justify-center md:flex-row md:flex-center gap-5'>


                    <div className=' w-full p-4'>
                        <button onClick={() => createRoom()} className='btn-primary' disabled = {creating}>{creating ?<img src = "/loading.gif" height={30} width={30}/>:"Create"}</button>
                    </div>
                    <h2>/</h2>
                    <div className=' w-full p-4'>
                        <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder='Room Id' className='input-primary' />
                        <button onClick={() => joinRoom()} className='btn-primary' disabled = {connecting}>{connecting ?<img src = "/loading.gif" height={30} width={30}/>:"Join"}</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Profile