package helpers

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadConnectionString(key string) string {
	err := godotenv.Load("./certs/.env")
	if err != nil {
		log.Fatalf("Error Loading the .env file")
	}

	return os.Getenv(key)
}
