package models

import (
	"log"
	"sync"
)

type Manager struct {
	rooms map[string][]*Client
	Mutex sync.RWMutex
}

var RoomManager Manager

func (c *Manager) Initialize() {
	c.Mutex.Lock()
	defer c.Mutex.Unlock()
	c.rooms = make(map[string][]*Client)
}

func (c *Manager) CreateRoom(roomid string) {
	c.Mutex.Lock()
	defer c.Mutex.Unlock()
	c.rooms[roomid] = []*Client{}
	// log.Print(c.rooms)
}

func (c *Manager) InsertIntoRoom(roomid string, user *Client) {
	c.Mutex.Lock()
	defer c.Mutex.Unlock()
	c.rooms[roomid] = append(c.rooms[roomid], user)
}

func (c *Manager) DeleteClient(roomid string, user *Client) {
	c.Mutex.Lock()
	defer c.Mutex.Unlock()
	if len(c.rooms[roomid]) != 0 {
		var indexToDelete int
		for i, v := range c.rooms[roomid] {
			if v.Email == user.Email {
				indexToDelete = i
			}
		}

		c.rooms[roomid] = append(c.rooms[roomid][:indexToDelete], c.rooms[roomid][indexToDelete+1:]...)
		log.Printf("%v removed", user.Email)
		if len(c.rooms[roomid]) == 0 {
			delete(c.rooms, roomid)
			log.Printf("%v deleted", roomid)
		}
	}

}
