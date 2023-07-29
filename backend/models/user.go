package models

type User struct {
	Email        string `json:"email"`
	Passowrd     string `json:"password"`
	ProfileImage string `json:"profile_image"`
}
