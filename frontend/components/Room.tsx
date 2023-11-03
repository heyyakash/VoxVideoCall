import React, { useEffect, useRef, useState } from 'react'
import { MdHomeFilled } from 'react-icons/md'
import { IoMdSettings } from 'react-icons/io'
import { BsFillCameraVideoFill, BsFillGrid3X3GapFill, BsFillGridFill, BsFillMicFill, BsFillSquareFill } from 'react-icons/bs'
import { PiPhoneDisconnectFill } from 'react-icons/pi'
import { message } from '@/types/message'
import Chat from './Chat'
import { copyRoomId } from '@/helpers/clipboard'
import { useRouter } from 'next/router'
import { getStream } from '@/helpers/webrtc'
import { handleWebSocketConnectionOnOpen } from '@/helpers/websocket'
import Logo from './Logo'
import { userDetails } from '@/types/userDetails'
import VideoElement from './VideoElement'

interface props {
    user: userDetails
}

interface remoteStream {
    image: string
    email: string
    name: string
    stream: MediaStream
}

const Room: React.FC<props> = ({ user }) => {
    const [copied, setCopied] = useState(false)
    const [active, setActive] = useState(false)
    const arr = [1]
    const [cols, setCols] = useState(3)
    const [chats, setChats] = useState<message[]>([])
    const emailRef = useRef<string>()
    const roomIdRef = useRef<string>()
    const conn = useRef<WebSocket>()
    const router = useRouter()
    const stream = useRef<MediaStream>()
    const peers: { [key: string]: RTCPeerConnection } = {}
    const [remoteStream, setRemoteStream] = useState<remoteStream[]>([])

    //function to end call
    const endCall = () => {
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
        router.push('/profile')
    }

    useEffect(() => {
        const { test: room } = router.query
        const email = localStorage.getItem("vox_email") as string
        roomIdRef.current = room as string
        emailRef.current = user.email

        if (room !== undefined && room !== null) {

            const connection = new WebSocket('ws://localhost:5000/room/join')
            connection.onopen = async () => {
                console.log("Connection Established")
                handleWebSocketConnectionOnOpen(connection, email, room as string, user?.image, user?.name)
                stream.current = await getStream()
                const localVideo: HTMLVideoElement | null = document.querySelector("video#localVideo")
                if (localVideo && stream.current) {
                    localVideo.srcObject = stream.current
                }
            }

            connection.onmessage = async (e) => {
                const message: message = JSON.parse(e.data).message
                if (message.event === "send-message") {
                    setChats(chats => [...chats, JSON.parse(e.data).message])
                } else if (message.event === "join-room") {
                    handleNewUser(message)
                } else if (message.event === "send-offer") {
                    console.log(peers)
                    handleOffer(message)
                } else if (message.event === "ice-candidates") {
                    handleIncommingIce(message)
                } else if (message.event === "send-answer") {
                    console.log(peers)
                    handleAnswer(message)
                } else if (message.event === "left-room") {
                    handleUserLeft(message)
                }
            }

            conn.current = connection
            setActive(true)
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

    //handle Incomming ICE Candidates
    const handleIncommingIce = async (e: message) => {
        if (e.icecandidates && peers[e.email]) {
            try {
                await peers[e.email].addIceCandidate(e.icecandidates)
            } catch (error) {
                console.log("Error adding Ice candindates", error)
            }
        }
    }

    //handle user leaving room 
    const handleUserLeft = async (e: message) => {
        const arr = remoteStream.filter(x=>x.email!==e.email)
        setRemoteStream(arr)
        // const video = document.getElementById(`${e.email}`)
        // if (video) {
        //     video.remove()
        // }
    }

    //hander new user 
    const handleNewUser = async (e: message) => {
        console.log("New user joined")
        if (e.image && e.name) {
            peers[e.email] = createPeer(e.email, e.image, e.name)
            if (stream?.current) {
                console.log("Adding stream to offer")
                stream.current.getTracks().forEach((track) => {
                    peers[e.email].addTrack(track, stream.current as MediaStream)
                })
            }

        }

    }

    //handle Incomming Offer
    const handleOffer = async (e: message) => {
        if (e.rtcoffer) {
            console.log("Received new offer ! Creating Answer")
            if(!e.image || !e.name) return
            const peer = createPeer(e.email, e.image, e.name)
            try {
                await peer.setRemoteDescription(new RTCSessionDescription(e.rtcoffer))
            } catch (err) {
                console.log("Error handling offer", err)
            }

            stream.current = await getStream()
            if (stream.current) {
                console.log("Addingn stream to answer")
                stream.current.getTracks().forEach((track) => {
                    peer.addTrack(track, stream.current as MediaStream)
                })
            }

            peers[e.email] = peer


            const answer = await peer.createAnswer()
            await peer.setLocalDescription(answer)

            if (answer && roomIdRef.current && emailRef.current && conn.current && answer) {
                console.log("Sending Answer")
                const payload: message = {
                    roomid: roomIdRef.current,
                    email: emailRef.current,
                    message: "Sending Answer",
                    event: "send-answer",
                    to: e.email,
                    rtcanswer: peer.localDescription
                }
                conn.current.send(JSON.stringify(payload))
                console.log("Answer sent")
            }


        }
    }

    //function to handle RTC answers
    const handleAnswer = (e: message) => {
        if (e.rtcanswer) {
            console.log("Got an answer ")
            try {
                peers[e.email].setRemoteDescription(new RTCSessionDescription(e.rtcanswer))
            } catch (err) {
                console.log("Error in handling answer", err)
            }

        }

    }


    // function to create new RTC Peer connection
    const createPeer = (email: string, image: string, name: string) => {
        const newPeer = new RTCPeerConnection({
            iceServers: [{
                urls: "stun:stun.l.google.com:19302"
            }]
        })

        newPeer.onnegotiationneeded = async () => {
            console.log("Creating Offer")
            try {
                const offer = await newPeer.createOffer()
                await newPeer.setLocalDescription(offer)
                if (conn.current && emailRef.current && roomIdRef.current && offer && email) {
                    const payload: message = {
                        email: emailRef.current,
                        roomid: roomIdRef.current,
                        message: "Sending Offer",
                        event: "send-offer",
                        rtcoffer: newPeer.localDescription,
                        to: email,
                        name: user?.name,
                        image: user?.image
                    }
                    conn.current.send(JSON.stringify(payload))
                    console.log("Offer sent")
                }
            } catch (err) {
                console.log("Error creating offer", err)
            }
        }
        newPeer.onicecandidate = async (e) => {
            if (e.candidate && emailRef.current && roomIdRef.current && conn.current) {
                console.log("Sending ICE candidates")
                const payload: message = {
                    email: emailRef.current,
                    roomid: roomIdRef.current,
                    message: "Sending Ice Candidates",
                    event: "ice-candidates",
                    icecandidates: e.candidate,
                    to: email
                }
                conn.current.send(JSON.stringify(payload))
            }
        }
        newPeer.ontrack = async (e: RTCTrackEvent) => {
            const streamContainer: HTMLDivElement | null = document.querySelector('#stream-container');
            const stream: remoteStream = {
                name,
                image,
                email,
                stream: e.streams[0]
            }
            let arr = remoteStream.filter((x) => x.email !== email)
            setRemoteStream(arr)
            setRemoteStream((remoteStream) => [...remoteStream, stream])
            if (streamContainer) {
                console.log("Adding remote video", e.streams[0])
                const existingVideoELement: HTMLElement | null = document.getElementById(`${email}-video`)
                if (existingVideoELement && 'srcObject' in existingVideoELement) {
                    existingVideoELement.srcObject = e.streams[0]
                }

            }
        }

        return newPeer
    }

    if (active)
        return (
            <>
                <div className='h-[100vh] bg-prim/75 backdrop-blur-[100px] flex'>
                    <div className='w-[100px] relative flex flex-center bg-black/40 '>
                        <div className='absolute top-0 left-0 w-full h-[100px] flex flex-center'>
                            <Logo version="lite" />
                        </div>
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
                                <div onClick={() => endCall()} className='p-4 cursor-pointer text-white bg-red-500 trans hover:bg-white/10 rounded-full'>
                                    <PiPhoneDisconnectFill />
                                </div>
                                <div className='p-4 cursor-pointer trans hover:bg-white/10 rounded-full'>
                                    <BsFillCameraVideoFill />
                                </div>
                            </div>
                            <div className='w-full p-10 h-[100px] border-b border-b-black relative flex items-center'>

                                <h3 className='text-xl font-bold'>{roomIdRef.current}</h3>
                                <button disabled={copied} onClick={() => copyRoomId(roomIdRef?.current as string, setCopied)} className='bg-sec trans mx-3 px-2 py-[2px] rounded-md font-semibold'>
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
                            <div id="stream-container" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} className='grid h-full overflow-auto trans p-8 grid-rows-auto gap-8  w-full'>
                                <div className={`w-full relative overflow-hidden ${cols === 1 ? "h-[80vh]" : cols === 2 ? "h-[50vh]" : "h-[315px]"} trans object-cover bg-black/50 rounded-xl`}>
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 flex items-end gap-3 via-transparent p-3 to-transparent'>
                                        <img src={user?.image} className='rounded-full border-2 border-red-400 w-10 h-10 object-cover' alt="" />
                                        <p className='mb-[.5rem]'>{user?.name}</p>
                                    </div>
                                    <video id="localVideo" className='w-full h-full object-cover' autoPlay playsInline controls={false} ></video>
                                </div>

                                {remoteStream.map((x, i) => {
                                    return (
                                        <VideoElement key={i} email={x.email} image={x.image} name={x.name} stream={x.stream} cols={cols} />
                                    )
                                })}

                            </div>
                        </div>



                    </div>

                    {/* Chat */}
                    <div className='w-[450px] h-full'>
                        <Chat connection={conn.current} chats={chats} setChats={setChats} />
                    </div>
                    <div></div>
                </div>
            </>
        )
}

export default Room