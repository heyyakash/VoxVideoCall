import Chat from '@/components/Chat'
import { getStream, playVideoFromCamera } from '@/helpers/webrtc'
import { handleWebSocketConnectionOnOpen } from '@/helpers/websocket'
import { message } from '@/types/message'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

const App = () => {
    const router = useRouter()
    const conn = useRef<WebSocket>()
    const [chats, setChats] = useState<message[]>([])
    const stream = useRef<MediaStream>()
    const peerRef = useRef<RTCPeerConnection>()
    const [roomId, setRoomId] = useState<string | null>(null)
    const [user,setUser] = useState<string | null>(null)
    // const partnerVideo  = useRef<HTMLVideoElement>()

    useEffect(() => {
        const { room } = router.query
        const email = localStorage.getItem("vox_email") as string
        setUser(email)
        setRoomId(room as string)

        if (room !== undefined && room !== null) {
            const connection = new WebSocket('ws://localhost:5000/room/join')
            connection.onopen = async () => {
                console.log("Connection Established")
                handleWebSocketConnectionOnOpen(connection, email, room as string)
                
        
                stream.current = await getStream()
                const localVideo : HTMLVideoElement | null = document.querySelector("video#localVideo")
                if(localVideo && stream.current){
                    localVideo.srcObject = stream.current
                }
                callUsers()
                // if (stream?.current) {
                //     const offer = await playVideoFromCamera(stream.current)
                //     if (offer) {
                //         const payload: message = {
                //             event: "send-offer",
                //             email,
                //             message: "send-offer",
                //             roomid: room as string,
                //             RTCOffer: offer
                //         }
                //         connection.send(JSON.stringify(payload))
                //     }
                // }
            }
            connection.onclose = () => {
                console.log("Connection closed")
            }
            connection.onmessage = async (e) => {
                const messageData = JSON.parse(e.data)
                const message : message = messageData.message
                if(message.event === "send-message"){
                    setChats(chats => [...chats, JSON.parse(e.data).message])
                }
                else if (message.icecandidates) {
                    console.log("Ice candidates received ", messageData.message.icecandidates)
                    try{
                        await peerRef.current?.addIceCandidate(messageData.message.icecandidates)
                    }catch(err){
                        console.log("Error Adding Ice Candidates", err)
                    }
                }else if (message.rtcoffer){
                    console.log("Recevied an offer")
                    handleOffer(message.rtcoffer)
                }else if (message.rtcanswer){
                    console.log("Recevied answer")
                    peerRef.current?.setRemoteDescription(new RTCSessionDescription(message.rtcanswer))
                }

            }
            conn.current = connection
        }

        return () => {
            console.log("cleanup")
            try{
                if(stream.current){
                    console.log("releasing stream")
                    const tracks = stream.current.getTracks()
                    tracks.forEach(function(track){
                        track.stop()
                    })
                    tracks.forEach(function (track){
                        stream.current?.removeTrack(track)
                    })
                }
            }catch(err){
                console.log(err)
            }
            conn?.current?.close()

        }
    }, [])
    
    const handleOffer = async (offer:RTCSessionDescription ) => {
        console.log("Recevied offer")
        peerRef.current = createPeer()

        //setting remote description
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer))
        
        if(stream?.current){
            stream.current.getTracks().forEach((track) => {
                peerRef.current?.addTrack(track, stream.current as MediaStream)
            })
        }

        const answer = await peerRef.current.createAnswer()
        await peerRef.current.setLocalDescription(answer)

        if(answer && roomId && user && conn.current && answer){
            const payload :message = {
                roomid:roomId,
                email:user,
                message:"Sending Answer",
                event:"send-answer",
                rtcanswer:peerRef.current.localDescription
            }
            conn.current.send(JSON.stringify(payload))
        }
    }


    const callUsers = async () => {
        console.log("Calling other peers")
        peerRef.current =  createPeer() 
        
        //adding stream to RTC Connection
        if(stream?.current){
            stream.current.getTracks().forEach((track) => {
                peerRef.current?.addTrack(track, stream.current as MediaStream)
            })
        }

    }

    const createPeer =  () => {
        const newPeer = new RTCPeerConnection({
            iceServers:[{
                urls:"stun:stun.l.google.com:19302"
            }]
        })

        newPeer.onnegotiationneeded = handleNegotiationNeeded
        newPeer.onicecandidate = handleOnIceCandidate
        newPeer.ontrack = handleOnTrack

        return newPeer
    }

    const handleNegotiationNeeded = async () => {
        console.log("Creating Offer")
        try{
            const myOffer = await peerRef.current?.createOffer()
            await peerRef.current?.setLocalDescription(myOffer)
            if(conn.current && user && roomId && myOffer){
                const payload :message = {
                    email:user,
                    roomid: roomId,
                    message:"Sending Offer",
                    event :"send-offer",
                    rtcoffer:peerRef.current?.localDescription
                }
                conn.current.send(JSON.stringify(payload))
            }
        }catch(err){
            console.log("Error creating and sending offers ",err)
        }
    }
    
    const handleOnIceCandidate = async (e:RTCPeerConnectionIceEvent) => {
        console.log("Found Ice Candidates")
        if(e.candidate && user && roomId && conn.current){
            console.log(e.candidate)
            const payload :message = {
                email: user ,
                roomid:roomId ,
                message:"Got Ice Candidates",
                event:"ice-candidates",
                icecandidates:e.candidate
            }
            conn.current.send(JSON.stringify(payload))
        }
    }

    const handleOnTrack = async (e: RTCTrackEvent) => {
        console.log("Receving Tracks")
        const partnerVideo: HTMLVideoElement | null = document.querySelector('video#partnerVideo')
        if(partnerVideo){
            partnerVideo.srcObject = e.streams[0]
        }
    }
    
    
    
    
    if (conn.current)
        return (

            <section className='min-h-[100vh] relative bg-[url("/bg6.svg")] bg-opacity-10 bg-cover'>

                <div className=' absolute inset-0 z-10 flex items-center px-6 backdrop-blur-[500px] bg-black/40  gap-[2rem]'>
                    <div className='bg-white/20 h-[95%] rounded-lg flex-1 flex flex-center gap-2'>
                        <video id="localVideo" className='rounded-xl drop-shadow-xl border-2 ' autoPlay playsInline controls={false}></video>
                        <video id="parterVideo" className='rounded-xl drop-shadow-xl border-2 ' autoPlay playsInline controls={false}></video>
                    </div>
                    <Chat connection={conn.current} chats={chats} setChats={setChats} />
                </div>
            </section>
        )
}

export default App