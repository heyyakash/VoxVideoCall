package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     wsCheckOrigin,
}

func wsCheckOrigin(r *http.Request) bool {
	return true
}

func CreateRoom(w http.ResponseWriter, r *http.Request) {
	id := uuid.New().String()
	type resp struct {
		id string `json:"id"`
	}
	var response resp
	response.id = id
	log.Print(response)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(&response.id)
}

func JoinRoom(w http.ResponseWriter, r *http.Request) {
	_, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		w.Write([]byte("Connection failed"))
		return
	}

}
