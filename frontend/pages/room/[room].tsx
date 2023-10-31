import Chat from '@/components/Chat'
import { getStream } from '@/helpers/webrtc'
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
    const roomIdRef = useRef<string>()
    const emailRef = useRef<string>()
    // const partnerVideo  = useRef<HTMLVideoElement>()

    useEffect(() => {
        const { room } = router.query
        const email = localStorage.getItem("vox_email") as string
        roomIdRef.current = room as string
        emailRef.current = email

        if (room !== undefined && room !== null) {
            const connection = new WebSocket('ws://localhost:5000/room/join')
            connection.onopen = async () => {
                console.log("Connection Established")
                handleWebSocketConnectionOnOpen(connection, email, room as string)


                stream.current = await getStream()
                const localVideo: HTMLVideoElement | null = document.querySelector("video#localVideo")
                if (localVideo && stream.current) {
                    localVideo.srcObject = stream.current
                    // partnerVideo.srcObject = stream.current
                }
                callUsers()
            }
            connection.onclose = () => {
                console.log("Connection closed")
            }
            connection.onmessage = async (e) => {
                const messageData = JSON.parse(e.data)
                const message: message = messageData.message

                if (message.event === "send-message") {
                    setChats(chats => [...chats, JSON.parse(e.data).message])
                }
                else if (message.event === "ice-candidates") {
                    console.log("Ice candidates received ")
                    try {
                        await peerRef.current?.addIceCandidate(message.icecandidates)
                    } catch (err) {
                        console.log("Error Adding Ice Candidates", err)
                    }
                } else if (message.rtcoffer) {
                    console.log("Recevied an offer")
                    handleOffer(message.rtcoffer)
                } else if (message.rtcanswer) {
                    console.log("Recevied answer")
                    peerRef.current?.setRemoteDescription(new RTCSessionDescription(message.rtcanswer))
                }

            }
            conn.current = connection
        }

        return () => {
            console.log("cleanup")
            try {
                if (stream.current) {
                    console.log("releasing stream")
                    const tracks = stream.current.getTracks()
                    tracks.forEach(function (track) {
                        track.stop()
                    })
                    tracks.forEach(function (track) {
                        stream.current?.removeTrack(track)
                    })
                }
            } catch (err) {
                console.log(err)
            }
            conn?.current?.close()

        }
    }, [])

    const handleOffer = async (offer: RTCSessionDescription) => {
        console.log("Recevied offer... creating Answer")
        peerRef.current = createPeer()


        //setting remote description
        await peerRef?.current?.setRemoteDescription(new RTCSessionDescription(offer))

        if (stream?.current) {
            console.log(stream.current)
            stream.current.getTracks().forEach((track) => {
                peerRef.current?.addTrack(track, stream.current as MediaStream)
            })
        }


        const answer = await peerRef?.current?.createAnswer()
        await peerRef?.current?.setLocalDescription(answer)

        if (answer && roomIdRef.current && emailRef.current && conn.current && answer) {
            console.log("Sending Answer")
            const payload: message = {
                roomid: roomIdRef.current,
                email: emailRef.current,
                message: "Sending Answer",
                event: "send-answer",
                rtcanswer: peerRef?.current?.localDescription
            }
            conn.current.send(JSON.stringify(payload))
        }
    }


    const callUsers = async () => {
        console.log("Calling other peers")
        peerRef.current = createPeer()

        //adding stream to RTC Connection
        if (stream?.current) {
            stream.current.getTracks().forEach((track) => {
                peerRef.current?.addTrack(track, stream.current as MediaStream)
            })
        }

    }

    const createPeer = () => {
        const newPeer = new RTCPeerConnection({
            iceServers: [{
                urls: "stun:stun.l.google.com:19302"
            }]
        })

        newPeer.onnegotiationneeded = handleNegotiationNeeded
        newPeer.onicecandidate = handleOnIceCandidate
        newPeer.ontrack = handleOnTrack

        return newPeer
    }

    const handleNegotiationNeeded = async () => {
        console.log("Creating Offer")
        try {
            const myOffer = await peerRef.current?.createOffer()
            await peerRef.current?.setLocalDescription(myOffer)
            if (conn.current && emailRef.current && roomIdRef.current && myOffer) {
                const payload: message = {
                    email: emailRef.current,
                    roomid: roomIdRef.current,
                    message: "Sending Offer",
                    event: "send-offer",
                    rtcoffer: peerRef.current?.localDescription
                }
                conn.current.send(JSON.stringify(payload))
                console.log("Offer sent")
            }
        } catch (err) {
            console.log("Error creating and sending offers ", err)
        }
    }

    const handleOnIceCandidate = async (e: RTCPeerConnectionIceEvent) => {
        // console.log("Found ICE candidates")
        if (e.candidate && emailRef.current && roomIdRef.current && conn.current) {
            console.log("Sending ICE candidates")
            const payload: message = {
                email: emailRef.current,
                roomid: roomIdRef.current,
                message: "Got Ice Candidates",
                event: "ice-candidates",
                icecandidates: e.candidate
            }
            conn.current.send(JSON.stringify(payload))
        }
    }

    const handleOnTrack = async (e: RTCTrackEvent) => {

        if (e.streams.length > 0) {
            const streamContainer: HTMLDivElement | null = document.querySelector('#stream-container');
            const existingVideoELement : HTMLElement | null = document.getElementById(`${e.streams[0].id}`) 
            if(existingVideoELement) existingVideoELement.remove()
            if (streamContainer && e.streams.length>0) {
                console.log("Adding remote video", e.streams[0])

                const videoElement = document.createElement('video');
                videoElement.id = e.streams[0].id;
                videoElement.className = 'rounded-xl drop-shadow-xl border-2';
                videoElement.autoplay = true;
                videoElement.playsInline = true;
                videoElement.controls = false;
                videoElement.srcObject = e.streams[0]
                streamContainer.appendChild(videoElement)



                // partnerVideo.srcObject = e.streams[0];
                // partnerVideo.onloadedmetadata = () => {
                //     partnerVideo.play();
                // };
            }
            // console.log(partnerVideo)
        }
    }




    // if (conn.current)
    return (

        <section className='min-h-[100vh] relative bg-[url("/bg6.svg")] bg-opacity-10 bg-cover'>

            <div className=' absolute inset-0 z-10 flex items-center px-6 backdrop-blur-[500px] bg-black/40  gap-[2rem]'>
                <div id = "stream-container" className='bg-white/20 h-[95%] rounded-lg flex-1 grid grid-cols-3 gap-2'>
                    <video id="localVideo" className='rounded-xl drop-shadow-xl border-2 ' autoPlay playsInline controls={false}></video>
                    {/* <video id="partnerVideo" className='rounded-xl drop-shadow-xl border-2 ' autoPlay playsInline controls={false}></video> */}
                </div>
                <Chat connection={conn.current} chats={chats} setChats={setChats} />
            </div>
        </section>
    )
}

export default App