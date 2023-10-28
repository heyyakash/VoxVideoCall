import Chat from '@/components/Chat'
import { playVideoFromCamera } from '@/helpers/webrtc'
import { message } from '@/types/message'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

const App = () => {
    const router = useRouter()
    const [Conn, setConn] = useState<WebSocket>()
    const [chats, setChats] = useState<message[]>([])

    useEffect(() => {

        const { room } = router.query
        const email = localStorage.getItem("vox_email") as string

        if (room !== undefined && room !== null) {
            const connection = new WebSocket('ws://localhost:5000/room/join')
            connection.onopen = async () => {
                console.log("Connection Established")
                connection.send(JSON.stringify({
                    Email: email,
                    RoomId: room,
                    Event: "join-room",
                    Message: email + " has joined the room"
                }))
                const offer = await playVideoFromCamera()
                if (offer) {
                    const payload: message = {
                        event: "send-offer",
                        email,
                        message: "send-offer",
                        roomid: room as string,
                        RTCOffer: offer
                    }
                    connection.send(JSON.stringify(payload))
                }

            }
            connection.onclose = () => {
                console.log("Connection closed")
            }
            connection.onmessage = (e) => {
                const messageData = JSON.parse(e.data)
                if (messageData.event === "send-offer"){
                    console.log("offer",messageData)
                }
                else {
                    setChats(chats => [...chats, JSON.parse(e.data).message])
                }

            }
            // console.log(connection)
            setConn(connection)
        }

        return () => {
            Conn?.close()
        }
    }, [])
    if (Conn)
        return (

            <section className='min-h-[100vh] relative bg-[url("/bg6.svg")] bg-opacity-10 bg-cover'>

                <div className=' absolute inset-0 z-10 flex items-center px-6 backdrop-blur-[500px] bg-black/40  gap-[2rem]'>
                    <div className='bg-white/20 h-[95%] rounded-lg flex-1 flex flex-center gap-2'>
                        <video id="localVideo" className='rounded-xl drop-shadow-xl border-2 ' autoPlay playsInline controls={false}></video>
                    </div>
                    <Chat connection={Conn} chats={chats} setChats={setChats} />
                </div>
            </section>
        )
}

export default App