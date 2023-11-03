package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Logout() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.SetCookie("auth", "", -1, "/", "localhost", false, true)
		ctx.Redirect(http.StatusSeeOther, "/login")
	}
}
