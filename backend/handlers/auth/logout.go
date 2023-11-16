package auth

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func Logout() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		cookie := &http.Cookie{
			Name:     "auth",
			Value:    "",
			Path:     "/",
			Domain:   ctx.Request.Host,
			Expires:  time.Unix(1, 0),
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteNoneMode,
		}
		http.SetCookie(ctx.Writer, cookie)
		ctx.Redirect(http.StatusSeeOther, "/login")
	}
}
