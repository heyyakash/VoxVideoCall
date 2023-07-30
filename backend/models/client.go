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
			for _, peers := range RoomManager.rooms[c.RoomId] {
				if peers.Email != c.Email {
					peers.Channel <- msg
				}

			}
			for key := range RoomManager.rooms {
				for _, value := range RoomManager.rooms[key] {
					log.Println(key, " : ", value.Email)
				}
			}

		}
		c.Conn.WriteJSON(gin.H{"message": "GOt Your message"})

	}
}

func (c *Client) WriteMessage() {
	defer func() {
		RoomManager.DeleteClient(c.RoomId, c)
		c.Conn.Close()
	}()
	for {
		select {
		case msg, ok := <-c.Channel:
			if !ok {
				if err := c.Conn.WriteMessage(websocket.CloseMessage, nil); err != nil {
					log.Println("Connection closed ", err)
				}
				return
			}
			c.Conn.WriteJSON(msg)
		}
	}
}
