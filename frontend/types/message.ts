export interface message{
    event : string,
    message : string,
    email: string,
    roomid:string
    RTCOffer? : RTCSessionDescription | null | undefined
}