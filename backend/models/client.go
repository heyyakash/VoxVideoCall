package models

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// type RTCOffer struct {
// 	Type string `json:"type"`
// 	Sdp  string `json:"sdp"`
// 	// You can add more fields as needed
// }

type Event struct {
	Event         string      `json:"event"`
	Email         string      `json:"email"`
	RoomId        string      `json::"roomid"`
	Message       string      `json:"message"`
	RTCOffer      interface{} `json:"rtcoffer"`
	IceCandidates interface{} `json:icecandidates`
	RTCAnswer     interface{} `json:rtcanswer`
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
		// log.Print(len())
		if msg.Event == "join-room" {
			c.Email = msg.Email
			c.RoomId = msg.RoomId
			RoomManager.InsertIntoRoom(msg.RoomId, c)
			for _, peers := range RoomManager.rooms[msg.RoomId] {
				peers.Channel <- msg
			}
		} else if msg.Event == "send-message" {
			for _, peers := range RoomManager.rooms[msg.RoomId] {
				peers.Channel <- msg
			}
		} else {
			for _, peers := range RoomManager.rooms[msg.RoomId] {
				if peers.Email != msg.Email {
					peers.Channel <- msg
				}
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
			c.Conn.WriteJSON(gin.H{"message": evnt})
		}
	}
}
