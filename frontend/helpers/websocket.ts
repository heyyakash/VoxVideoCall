export const handleWebSocketConnectionOnOpen = (connection: WebSocket, email :string, room:string, image: string, name:string) => {
    connection.send(JSON.stringify({
        Email: email,
        RoomId: room,
        Event: "join-room",
        Message: email + " has joined the room",
        image,
        name
    }))
}