import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'

const App = () => {
    const router = useRouter()
    const Conn = useRef<WebSocket>(null)

    useEffect(() => {
        const { room } = router.query
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
                console.log(e)
            }
        }
    }, [])

    return (
        <div></div>
    )
}

export default App