package helpers

import "github.com/gin-gonic/gin"

func GenerateResponse(message string, success bool) any {
	return gin.H{
		"message": message,
		"success": success,
	}
}
