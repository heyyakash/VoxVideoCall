import Chat from '@/components/Chat'
import { message } from '@/types/message'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

const App = () => {
    const router = useRouter()
    const [Conn, setConn ]= useState<WebSocket>()
    const [chats,setChats] = useState<message[]>([])

    useEffect(() => {
        
        const { room } = router.query
        console.log(room)
        const email = localStorage.getItem("vox_email") as string

        if (room !== undefined && room !== null) {
            const connection = new WebSocket('ws://localhost:5000/room/join')
            connection.onopen = () => {
                console.log("Connection Established")
                connection.send(JSON.stringify({
                    Email: email,
                    RoomId: room,
                    Event: "join-room",
                    Message: email + " has joined the room"
                }))
            }
            connection.onclose = () => {
                console.log("Connection closed")
            }
            connection.onmessage = (e) => {
                console.log(JSON.parse(e.data).message)
                setChats(chats => [...chats, JSON.parse(e.data).message])
            }
            // console.log(connection)
            setConn(connection)
        }

        return ()=>{
            Conn?.close()
        }
    }, [])
    if(Conn)
    return (

        <section className='min-h-[100vh] relative bg-[url("/bg6.svg")] bg-opacity-10 bg-cover'>

            <div className=' absolute inset-0 z-10 flex-center backdrop-blur-[500px] bg-black/40 flex-col gap-[2rem]'>
                <Chat connection = {Conn} chats = {chats} setChats = {setChats}/>
            </div>
        </section>
    )
}

export default App