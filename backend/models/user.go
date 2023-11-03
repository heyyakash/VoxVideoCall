package models

type User struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Passowrd string `json:"password"`
	Image    string `json:"image"`
}
