package auth

import (
	"context"
	"net/http"
	"videocallapp/configs"
	"videocallapp/helpers"
	"videocallapp/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func CreateUser() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var user models.User
		var existingUser models.User
		if err := ctx.BindJSON(&user); err != nil {
			ctx.JSON(http.StatusConflict, gin.H{
				"message": "Invalid Credentials",
				"success": false,
			})
			return
		}
		filter := bson.D{{"email", user.Email}}
		err := configs.Collection.FindOne(context.TODO(), filter).Decode(&existingUser)
		if err == nil {
			ctx.JSON(http.StatusConflict, gin.H{
				"message": "Email already exists",
				"status":  false,
			})
			return
		}

		hashedPassword := helpers.Hash(user.Passowrd)
		user.Passowrd = hashedPassword
		configs.Collection.InsertOne(context.TODO(), user)

		jwt, err := helpers.GenerateJWT(user.Email)
		if err != nil {
			ctx.AbortWithStatusJSON(500, gin.H{
				"message": "Couldn't generate jwt",
				"success": false,
			})
			return
		}
		// log.Print(ctx.Request.Host)
		ctx.SetCookie("authorization", jwt, 3600, "/", ctx.Request.Host, false, true)
		ctx.JSON(200, gin.H{
			"message": jwt,
			"success": true,
		})
	}
}
