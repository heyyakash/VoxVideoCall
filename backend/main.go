package main

import (
	"log"
	"time"
	"videocallapp/configs"
	"videocallapp/helpers"
	"videocallapp/models"
	"videocallapp/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	models.RoomManager.Initialize()
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{helpers.LoadConnectionString("CLIENT_ORIGIN")},
		AllowMethods:     []string{"PUT", "PATCH", "POST", "OPTIONS", "GET", "DELETE"},
		AllowHeaders:     []string{"Origin", "auth-token", "content-type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == helpers.LoadConnectionString("CLIENT_ORIGIN")
		},
		MaxAge: 12 * time.Hour,
	}))
	routes.UserRouter(r)
	routes.RoomRoutes(r)
	configs.ConnectDB()
	if err := r.RunTLS(":5000", helpers.LoadConnectionString("CERTIFICATE"), helpers.LoadConnectionString("KEY")); err != nil {
		log.Fatalf("Could not start the server ", err)
	}
	//testing ci 5
}
