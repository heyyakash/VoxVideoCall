import React, { useEffect, useRef, useState } from 'react'

import { BsChatFill, BsFillCameraVideoFill, BsFillGrid3X3GapFill, BsFillGridFill, BsFillMicFill, BsFillShareFill, BsFillSquareFill } from 'react-icons/bs'
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
    const [toggleChat, setToggleChat] = useState(true)

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

            const connection = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string)
            connection.onopen = async () => {
                console.log("Connection Established")
                handleWebSocketConnectionOnOpen(connection, user.email, room as string, user?.image, user?.name)
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
            console.log("Received ICE")
            try {
                await peers[e.email].addIceCandidate(e.icecandidates)
            } catch (error) {
                console.log("Error adding Ice candindates", error)
            }
        }
    }

    //handle user leaving room 
    const handleUserLeft = async (e: message) => {

        setRemoteStream((remoteStream) => {
            const arr = remoteStream.filter(x => x.email !== e.email)
            return arr
        })
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
            if (!e.image || !e.name) return
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

            // setRemoteStream(arr)
            setRemoteStream((remoteStream) => {
                const arr = remoteStream.filter(x => x.email !== email)
                arr.push(stream)
                return arr
            })
            if (streamContainer) {
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
                <div className='h-[100vh] bg-gradient-to-t from-slate-900/60 to-slate-900 flex flex-col-reverse md:flex-row'>


                    {/* sidebar */}
                    <div className='w-full md:w-[70px] border-r border-white/20 fixed bottom-0 z-[1000] md:relative flex flex-center  '>
                        <div className='absolute md:top-0 left-0 hidden  w-full h-[70px] md:flex-center'>
                            <Logo version="lite" />
                        </div>
                        <div className='flex text-lg md:text-2xl text-prim flex-center w-full md:flex-col gap-4'>
                            <div className=' gap-4 md:gap-6 flex md:w-full md:flex-col flex-center '>

                                <div onClick={() => setToggleChat(!toggleChat)} className={`side-btn ${toggleChat ? "border-t-2 md:border-t-[0px] md:border-r-2  border-sec" : "border-none"}`}>
                                    <BsChatFill className='text-white' />
                                </div>

                                <div className='side-btn text-white border-sec  '>
                                    <BsFillMicFill />
                                </div>
                          
                                <div className='side-btn text-white border-sec'>
                                    <BsFillCameraVideoFill />
                                </div>

                                <div onClick={() => endCall()} className='p-4 cursor-pointer text-white bg-red-500 trans hover:bg-white/10 rounded-full'>
                                    <PiPhoneDisconnectFill />
                                </div>
                            </div>

                        </div>
                    </div>


                    {/* Chat */}
                    <div className={` absolute z-[1000] bg-slate-900 w-full lg:relative lg:bg-transparent xl:block h-full trans ${!toggleChat ? "w-0 hidden lg:w-0 " : "md:w-[450px]"}`}>
                        <Chat setToggleChat={setToggleChat} connection={conn.current} chats={chats} setChats={setChats} />
                    </div>


                    {/* Video  */}
                    <div className='flex-1 relative z-[100] bg-no-repeat bg-cover overflow-auto '>

                        {/* Header */}
                        <div className='w-full flex relative flex-col h-full backdrop-blur-[100px] '>

                            <div className='w-full px-6 h-[70px] border-b border-b-white/20 relative flex items-center'>

                                <h3 className='w-[100px] truncate lg:w-auto md:block text-xl font-bold'>{roomIdRef.current}</h3>
                                <button disabled={copied} onClick={() => copyRoomId(roomIdRef?.current as string, setCopied)} className='bg-sec trans mx-3 p-2 rounded-md font-semibold'>
                                    {copied ? "Copied" : <BsFillShareFill />}
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
                            {/* style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} */}
                            <div id="stream-container" className='grid h-full overflow-auto trans p-8 grid-rows-auto grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8  w-full'>
                                <div className={`w-full relative  overflow-hidden ${cols === 1 ? "h-[80vh]" : cols === 2 ? "h-[50vh]" : "h-[315px]"} trans  object-cover bg-black/50   rounded-sm`}>
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 flex items-end gap-3 via-transparent p-3 to-transparent w-full'>
                                        <img src={user?.image} className='rounded-full border-2 border-red-400 w-10 h-10 object-cover' alt="" />
                                        <p className='mb-[.5rem]'>{user?.name}</p>
                                    </div>
                                    <video id="localVideo" className='w-full  h-full object-cover' autoPlay playsInline controls={false} ></video>
                                </div>


                                {remoteStream.map((x, i) => {
                                    return (
                                        <VideoElement key={i} email={x.email} image={x.image} name={x.name} stream={x.stream} cols={cols} />
                                    )
                                })}

                            </div>
                        </div>



                    </div>



                </div>
            </>
        )
}

export default Room