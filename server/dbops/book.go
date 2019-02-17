package dbops

import (
	"database/sql"
	"fmt"
	"log"
	"read_books/models"
)

func rowExists(query string, args ...interface{}) bool {
	var exists  bool
	query = fmt.Sprintf("SELECT EXISTS (%s)", query)
	err := db.QueryRow(query, args...).Scan(&exists)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("rowExists - %v", err)
		exists = false
	}
	return exists
}

func CheckBookExists(title string) bool {
	return rowExists("SELECT id FROM books WHERE title=$1", title)
}

func AddNewBook(author, title, summary string) (int, error) {
	stmtIn, err := db.Prepare("INSERT INTO books (title, author, summary) VALUES (?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer stmtIn.Close()
	_, err = stmtIn.Exec(title, author, summary)
	if err != nil {
		return 0, err
	}
	stmtMax, err := db.Prepare("SELECT MAX(id) FROM books")
	if err != nil {
		return 0, err
	}
	defer stmtMax.Close()
	var id int
	err = stmtMax.QueryRow().Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func GetBookByID(id int) (*models.Book, error) {
	stmt, err := db.Prepare("SELECT author, title, summary FROM books WHERE id=?")
	if err != nil {
		return nil, err
	}
	defer stmt.Close()
	var author, title, summary string
	err = stmt.QueryRow(id).Scan(&author, &title, &summary)
	if err != nil {
		return nil, err
	}
	return &models.Book{
		ID: id,
		Author: author,
		Title: title,
		Summary: summary,
	}, nil
}

func ListBooks() ([]*models.Book, error) {
	books := make([]*models.Book, 0)
	stmt, err := db.Prepare("SELECT id, author, title, summary FROM books")
	if err != nil {
		return books, err
	}
	defer stmt.Close()
	var id int
	var author, title, summary string
	rows, err := stmt.Query()
	for rows.Next() {
		err = rows.Scan(&id, &author, &title, &summary)
		if err != nil {
			fmt.Println("ListBooks - %v", err)
			continue
		}
		books = append(books, &models.Book{
			ID: id,
			Author: author,
			Title: title,
			Summary: summary,
		})
	}
	return books, nil
}

func ListExcertsByBookID(book_id int) ([]*models.Excert, error) {
	excerts := make([]*models.Excert, 0)
	stmt, err := db.Prepare("SELECT id, content FROM excerts WHERE book_id=?")
	if err != nil {
		return excerts, err
	}
	var id int
	var content string
	rows, err := stmt.Query(book_id)
	for rows.Next() {
		err = rows.Scan(&id, &content)
		if err != nil {
			fmt.Println("ListExcertByBookID - %v", err)
			continue
		}
		excerts = append(excerts, &models.Excert{
			ID: id,
			BookID: book_id,
			Content: content,
		})
	}
	return excerts, nil
}

func ListIdeasByBookID(book_id int) ([]*models.Idea, error) {
	ideas := make([]*models.Idea, 0)
	stmt, err := db.Prepare("SELECT id, content FROM ideas WHERE book_id=?")
	if err != nil {
		return ideas, err
	}
	var id int
	var content string
	rows, err := stmt.Query(book_id)
	for rows.Next() {
		err = rows.Scan(&id, &content)
		if err != nil {
			fmt.Println("ListIdeasByBookID - %v", err)
			continue
		}
		ideas = append(ideas, &models.Idea{
			ID: id,
			BookID: book_id,
			Content: content,
		})
	}
	return ideas, nil
}

func AddExcert(content string, book_id int) (int, error) {
	stmtIn, err := db.Prepare("INSERT INTO excerts (book_id, content) VALUES (?, ?)")
	if err != nil {
		return 0, err
	}
	defer stmtIn.Close()
	_, err = stmtIn.Exec(book_id, content)
	if err != nil {
		return 0, err
	}
	stmtMax, err := db.Prepare("SELECT MAX(id) FROM excerts")
	if err != nil {
		return 0, err
	}
	defer stmtMax.Close()
	var id int
	err = stmtMax.QueryRow().Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func AddIdea(content string, book_id int) (int, error) {
	stmtIn, err := db.Prepare("INSERT INTO ideas (book_id, content) VALUES (?, ?)")
	if err != nil {
		return 0, err
	}
	defer stmtIn.Close()
	_, err = stmtIn.Exec(book_id, content)
	if err != nil {
		return 0, err
	}
	stmtMax, err := db.Prepare("SELECT MAX(id) FROM ideas")
	if err != nil {
		return 0, err
	}
	defer stmtMax.Close()
	var id int
	err = stmtMax.QueryRow().Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func RemoveExcert(id int) error {
	stmt, err := db.Prepare("DELETE FROM excerts WHERE id=?")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(id)
	if err != nil {
		return err
	}
	return nil
}

func RemoveIdea(id int) error {
	stmt, err := db.Prepare("DELETE FROM ideas WHERE id=?")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(id)
	if err != nil {
		return err
	}
	return nil
}

func UpdateBook(title, author, summary string, id int) error {
	stmt, err := db.Prepare("UPDATE books SET author=?, title=?, summary=? WHERE id=?")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(author, title, summary, id)
	if err != nil {
		return err
	}
	return nil
}

func DeleteBook(id int) error {
	stmtDbooks, err := db.Prepare("DELETE FROM books WHERE id=?")
	if err != nil {
		return err
	}
	defer stmtDbooks.Close()
	_, err = stmtDbooks.Exec(id)
	if err != nil {
		return err
	}
	stmtDideas, err := db.Prepare("DELETE FROM ideas WHERE book_id=?" )
	if err != nil {
		return err
	}
	defer stmtDideas.Close()
	_, err = stmtDideas.Exec(id)
	if err != nil {
		return err
	}
	stmtDexcerts, err := db.Prepare("DELETE FROM ideas WHERE book_id=?" )
	if err != nil {
		return err
	}
	defer stmtDexcerts.Close()
	_, err = stmtDexcerts.Exec(id)
	if err != nil {
		return err
	}
	return nil
}




