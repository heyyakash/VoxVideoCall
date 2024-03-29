package helpers

import (
	"github.com/golang-jwt/jwt/v5"
)

var sampleSecretKey = []byte(LoadConnectionString("JWT_SECRET"))

type userClaims struct {
	jwt.RegisteredClaims
	Email string
}

func GenerateJWT(email string) (string, error) {

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, userClaims{
		RegisteredClaims: jwt.RegisteredClaims{},
		Email:            email,
	})

	signedString, err := token.SignedString(sampleSecretKey)
	if err != nil {
		return "", err
	}
	// log.Print(signedString)
	return signedString, nil

}

func DecodeJWT(jwtToken string) (string, error) {
	var userClaim userClaims
	_, err := jwt.ParseWithClaims(jwtToken, &userClaim, func(t *jwt.Token) (interface{}, error) {
		return sampleSecretKey, nil
	})

	if err != nil {
		return "", err
	}
	// log.Print(token.Claims)
	return userClaim.Email, nil
}
