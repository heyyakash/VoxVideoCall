package auth

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"videocallapp/configs"
	"videocallapp/helpers"
	"videocallapp/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

func LoginUsingGoogle() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		code := ctx.Query("code")
		pathToUrl := "/"
		if ctx.Query("state") != "" {
			pathToUrl = ctx.Query("state")
		}

		if code == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"status": "fall", "message": "Authorization Code not provided"})
			return
		}

		tokenRes, err := helpers.GetGoogleAuthToken(code)
		if err != nil {
			ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		}

		user, err := helpers.GetGoogleUser(tokenRes.Access_token, tokenRes.Id_token)

		if err != nil {
			ctx.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
		}

		var existingUser models.User

		if err := configs.Collection.FindOne(context.TODO(), bson.D{{"email", user.Email}}).Decode(&existingUser); err != nil {
			hashedPassword := helpers.Hash(uuid.New().String())
			newUser := models.User{
				Name:     user.Name,
				Email:    user.Email,
				Image:    user.Image,
				Passowrd: hashedPassword,
			}
			configs.Collection.InsertOne(context.TODO(), newUser)
		}

		token, err := helpers.GenerateJWT(user.Email)
		if err != nil {
			log.Print("Error in generating jwt : ", err)
			ctx.JSON(500, helpers.GenerateResponse(err.Error(), false))
			return
		}

		//success response
		ctx.SetCookie("auth", token, 3600, "/", "localhost", false, true)
		log.Println(pathToUrl)
		ctx.Redirect(http.StatusTemporaryRedirect, fmt.Sprint(helpers.LoadConnectionString("CLIENT_ORIGIN"), pathToUrl))

	}
}
