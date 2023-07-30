package auth

import (
	"context"
	"log"
	"net/http"
	"videocallapp/configs"
	"videocallapp/helpers"
	"videocallapp/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

type body struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func LoginUser() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var req body
		var existingUser models.User
		if err := ctx.BindJSON(&req); err != nil {
			ctx.JSON(400, helpers.GenerateResponse("Invalid Cred", false))
			return
		}

		if err := configs.Collection.FindOne(context.TODO(), bson.D{{"email", req.Email}}).Decode(&existingUser); err != nil {
			ctx.JSON(http.StatusUnauthorized, helpers.GenerateResponse("Invalid Credentials", false))
			return
		}

		// compare passwords
		checkPassword := helpers.CheckPassword(existingUser.Passowrd, req.Password)
		if !checkPassword {
			ctx.JSON(401, helpers.GenerateResponse("Wrong Password", false))
			return
		}

		//generate jwt token
		token, err := helpers.GenerateJWT(req.Email)
		if err != nil {
			log.Print("Error in generating jwt : ", err)
			ctx.JSON(500, helpers.GenerateResponse(err.Error(), false))
			return
		}

		//success response
		ctx.SetCookie("auth", token, 3600, "/", "localhost", false, true)
		ctx.JSON(200, helpers.GenerateResponse(token, true))

	}
}
