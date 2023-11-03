package auth

import (
	"context"
	"log"
	"net/http"
	"videocallapp/configs"
	"videocallapp/helpers"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

type details struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

func GetUser() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		cookie, err := ctx.Cookie("auth")
		if err != nil {
			ctx.JSON(http.StatusForbidden, helpers.GenerateResponse("Cookie Not Present", false))
			return
		}
		user, err := helpers.DecodeJWT(cookie)
		if err != nil {
			log.Fatal(err)
		}

		var detail details

		if err := configs.Collection.FindOne(context.TODO(), bson.D{{"email", user}}).Decode(&detail); err != nil {
			ctx.JSON(http.StatusUnauthorized, helpers.GenerateResponse("Invalid Credentials", false))
			return
		}

		// log.Print(user)

		ctx.JSON(200, gin.H{"message": detail, "success": true})

	}
}
