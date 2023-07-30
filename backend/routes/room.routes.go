package routes

import (
	"videocallapp/handlers"

	"github.com/gin-gonic/gin"
)

func RoomRoutes(c *gin.Engine) {
	c.GET("/room/create", handlers.CreateRoom())
	c.GET("/room/join", handlers.JoinRoom())
}
