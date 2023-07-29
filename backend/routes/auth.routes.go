package routes

import (
	"videocallapp/handlers/auth"

	"github.com/gin-gonic/gin"
)

func UserRouter(c *gin.Engine) {
	c.POST("/user/create", auth.CreateUser())
	c.POST("/user/login", auth.LoginUser())
	c.GET("/user/details", auth.GetUser())
}
