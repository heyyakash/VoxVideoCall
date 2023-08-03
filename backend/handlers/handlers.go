package handlers

import (
	"log"
	"net/http"
	"videocallapp/helpers"
	"videocallapp/models"

	"github.com/gin-gonic/gin"
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

func CreateRoom() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := uuid.New().String()
		models.RoomManager.CreateRoom(id)
		ctx.JSON(200, helpers.GenerateResponse(id, true))
	}
}

func JoinRoom() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ws, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
		if err != nil {
			log.Print("Error in upgrading to ws connection ", err.Error())
			ctx.JSON(500, helpers.GenerateResponse("Couldn't upgrade to websocket", false))
			return
		}

		user := models.Client{
			Host:    false,
			Conn:    ws,
			Channel: make(chan models.Event),
		}

		go user.ReadMessage()
		go user.WriteMessage()

		// defer ws.Close()
	}
}
