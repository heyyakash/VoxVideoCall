const configuration: RTCConfiguration = {
    iceServers:[]
}

const openMediaDevices = async (constraints : MediaStreamConstraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints)
}

const peerConnection = new RTCPeerConnection(configuration)

export const playVideoFromCamera = async() => {
    try{
        const stream = await openMediaDevices({
            video:true,
            audio:true
        })
        const videoElement : HTMLVideoElement | null = document.querySelector("video#localVideo") 
        if(videoElement){
            videoElement.srcObject = stream
        }
        stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream)
        })

        peerConnection.createOffer().then((offer)=> peerConnection.setLocalDescription(offer)).then(()=>{})
        const offer = peerConnection.localDescription
        return offer
    }catch(error){
        console.log('Error accessing media devices', error)
    }
    
    
}