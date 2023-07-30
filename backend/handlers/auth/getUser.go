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
		user, err := helpers.DecodeJWT(cookie)
		if err != nil {
			log.Fatal(err)
		}

		log.Print(user)

		ctx.JSON(200, gin.H{"message": user, "success": true})
		// jwt := ctx.Request.Header["auth-token"]
		// log.Print(jwt)
		// ctx.JSON(200, helpers.GenerateResponse("Checked", true))

	}
}
