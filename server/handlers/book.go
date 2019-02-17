package handlers

import (
	"fmt"
	"github.com/labstack/echo"
	"net/http"
	"read_books/dbops"
	"read_books/models"
	"strconv"
)

func RegisterBookHandlers(e *echo.Echo) {
	e.POST("/books", createBook)
	e.GET("/books", listBooks)
	e.PUT("/books", UpdateBook)
	e.DELETE("/books", DeleteBook)
	e.GET("/books/:book_id", GetBookInfo)
	e.GET("/books/:book_id/ideas", listIdeas)
	e.POST("/books/:book_id/ideas", AddIdea)
	e.GET("/books/:book_id/excerts", listExcerts)
	e.POST("/books/:book_id/excerts", AddExcert)
	e.GET("/excerts", RemoveExcert)
	e.GET("/ideas", RemoveIdea)
}

// 创建书籍
func createBook(c echo.Context) error {
	author := c.FormValue("author")
	title := c.FormValue("title")
	summary := c.FormValue("summary")
	//首先检查书籍是否存在(通过书名)
	if dbops.CheckBookExists(title) {
		return c.JSON(http.StatusForbidden, map[string]string{
			"msg": "该书籍已经存在",
		})
	}
	id, err := dbops.AddNewBook(author, title, summary)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"msg": "服务器内部错误",
		})
	}
	book := models.Book{
		ID: id,
		Author: author,
		Title: title,
		Summary: summary,
	}
	return c.JSON(http.StatusOK, book)
}



//列出所有的书籍
func listBooks(c echo.Context) error {
	books, err := dbops.ListBooks()
	if err != nil {
		fmt.Printf("listBooks - %v", err)
	}
	return c.JSON(http.StatusOK, books)
}

//更新书籍
func UpdateBook(c echo.Context) error {
	book_id_str := c.FormValue("book_id")
	title := c.FormValue("title")
	author := c.FormValue("author")
	summary := c.FormValue("summary")
	book_id, err := strconv.Atoi(book_id_str)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string {
			"message": "请求参数错误",
		})
	}
	err = dbops.UpdateBook(title, author, summary, book_id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"msg": "服务器内部错误",
		})
	}
	return c.JSON(http.StatusOK, map[string]string{
		"message": "更新成功",
	})
}

//删除书籍
func DeleteBook(c echo.Context) error {
	book_id_str := c.FormValue("book_id")
	book_id, err := strconv.Atoi(book_id_str)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string {
			"message": "请求参数错误",
		})
	}
	err = dbops.DeleteBook(book_id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"msg": "服务器内部错误",
		})
	}
	return c.JSON(http.StatusOK, map[string]string{
		"message": "删除成功",
	})
}

//通过id获取书籍
func GetBookInfo(c echo.Context) error {
	idStr := c.Param("book_id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string {
			"message": "请求参数错误",
		})
	}
	book, err := dbops.GetBookByID(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"msg": "服务器内部错误",
		})
	}
	return c.JSON(http.StatusOK, book)
}

// 列出所有的书籍片段
func listExcerts(c echo.Context) error {
	idStr := c.Param("book_id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string {
			"message": "请求参数错误",
		})
	}
	excerts, err := dbops.ListExcertsByBookID(id)
	if err != nil {
		fmt.Printf("listExcerts - %v", err)
	}
	return c.JSON(http.StatusOK, excerts)
}

//根据id删除书籍片段
func RemoveExcert(c echo.Context) error {
	idStr := c.QueryParam("excert_id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string {
			"message": "请求参数错误",
		})
	}
	err = dbops.RemoveExcert(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"msg": "服务器内部错误",
		})
	}
	return c.JSON(http.StatusOK, map[string]string{
		"message": "删除成功",
	})
}

//添加书籍片段
func AddExcert(c echo.Context) error {
	idStr := c.Param("book_id")
	book_id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string {
			"message": "请求参数错误",
		})
	}
	content := c.FormValue("content")
	id, err := dbops.AddExcert(content, book_id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"msg": "服务器内部错误",
		})
	}
	excert := models.Excert{
		ID: id,
		BookID: book_id,
		Content: content,
	}
	return c.JSON(http.StatusOK, excert)
}

// 列出所有的想法
func listIdeas(c echo.Context) error {
	idStr := c.Param("book_id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string {
			"message": "请求参数错误",
		})
	}
	ideas, err := dbops.ListIdeasByBookID(id)
	if err != nil {
		fmt.Printf("listIdeas - %v", err)
	}
	return c.JSON(http.StatusOK, ideas)
}

//根据id删除想法
func RemoveIdea(c echo.Context) error {
	idStr := c.QueryParam("idea_id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string {
			"message": "请求参数错误",
		})
	}
	err = dbops.RemoveIdea(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"msg": "服务器内部错误",
		})
	}
	return c.JSON(http.StatusOK, map[string]string{
		"message": "删除成功",
	})
}

//添加想法
func AddIdea(c echo.Context) error {
	idStr := c.Param("book_id")
	book_id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string {
			"message": "请求参数错误",
		})
	}
	content := c.FormValue("content")
	id, err := dbops.AddIdea(content, book_id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"msg": "服务器内部错误",
		})
	}
	idea := models.Idea{
		ID: id,
		BookID: book_id,
		Content: content,
	}
	return c.JSON(http.StatusOK, idea)
}
