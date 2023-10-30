export interface message{
    event : string,
    message : string,
    email: string,
    roomid:string
    rtcoffer? : RTCSessionDescription | null | undefined
    icecandidates?: RTCIceCandidate
    rtcanswer?: RTCSessionDescription | null | undefined
}