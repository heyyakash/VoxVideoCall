package helpers

import (
	"time"

	"github.com/golang-jwt/jwt"
)

var sampleSecretKey = []byte("SHEHEHEHE")

func GenerateJWT(email string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(60 * time.Minute)
	claims["authorized"] = true
	claims["email"] = email
	tokenString, err := token.SignedString(sampleSecretKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
