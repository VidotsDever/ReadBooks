package models

type Book struct {
	ID int `json:"id"`
	Author string `json:"author"`
	Title string `json:"title"`
	Summary string `json:"summary"`
}

type Excert struct {
	ID int `json:"id"`
	BookID int `json:"book_id"`
	Content string `json:"content"`
}

type Idea struct {
	ID int `json:"id"`
	BookID int `json:"book_id"`
	Content string `json:"content"`
}
