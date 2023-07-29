package auth

import (
	"log"
	"net/http"
	"videocallapp/helpers"

	"github.com/gin-gonic/gin"
)

func GetUser() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		cookie, err := ctx.Cookie("auth")
		if err != nil {
			ctx.JSON(http.StatusForbidden, helpers.GenerateResponse("Cookie Not Present", false))
			return
		}

		log.Print(cookie)
		ctx.JSON(200, gin.H{"message": "Got the cookie", "success": true})
	}
}
