package models

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Event struct {
	Event   string `json:"event"`
	Email   string `json:"email"`
	RoomId  string `json::"roomid"`
	Message string `json:"message"`
}

type Client struct {
	Host    bool
	Email   string
	RoomId  string
	Conn    *websocket.Conn
	Channel chan Event
}

func (c *Client) ReadMessage() {
	defer func() {
		RoomManager.DeleteClient(c.RoomId, c)
		c.Conn.Close()
	}()
	for {
		var msg Event
		if err := c.Conn.ReadJSON(&msg); err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Print(c.Email, " Left")
			}
			break
		}
		if msg.Event == "join-room" {
			c.Email = msg.Email
			c.RoomId = msg.RoomId
			RoomManager.InsertIntoRoom(msg.RoomId, c)
			log.Println(c.Email, " joins : ", c.RoomId)
			for _, peers := range RoomManager.rooms[msg.RoomId] {
				peers.Channel <- msg
			}
		}
	}
}

func (c *Client) WriteMessage() {
	defer func() {
		RoomManager.DeleteClient(c.RoomId, c)
		c.Conn.Close()
		log.Print("Client Left")
	}()
	for {
		select {
		case evnt, ok := <-c.Channel:
			if !ok {
				if err := c.Conn.WriteMessage(websocket.CloseMessage, nil); err != nil {
					log.Println("Connection closed ", err)
				}
				return
			}
			log.Println(evnt.Message)
			c.Conn.WriteJSON(gin.H{"message": "hello"})
		}
	}
}
