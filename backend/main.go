package main

import (
	"log"
	"videocallapp/configs"
	"videocallapp/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// http.HandleFunc("/create", handlers.CreateRoom)
	// http.HandleFunc("/join", handlers.CreateRoom)
	// log.Print("listening at port : 8080")
	// if err := http.ListenAndServe(":8080", nil); err != nil {
	// 	log.Fatal("Couldn't Start the server", err)
	// }

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Use(cors.Default())
	routes.UserRouter(r)
	configs.ConnectDB()
	if err := r.Run(":5000"); err != nil {
		log.Fatalf("Could not start the server ", err)
	}
}
