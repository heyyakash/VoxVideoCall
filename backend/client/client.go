package client

import "github.com/gorilla/websocket"

type Client struct {
	Host bool
	Name string
	Conn *websocket.Conn
}
