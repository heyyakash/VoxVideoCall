const openMediaDevices = async (constraints : MediaStreamConstraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints)
}


export const getStream = async() => {
    try{
        const stream = await openMediaDevices({
            video:true,
            audio:true
        })
        return stream
    }catch(err){
        console.log(err)
    }
}
