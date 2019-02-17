package main

import (
	"github.com/labstack/echo"
	"read_books/handlers"
)

func RegisterRouters(e *echo.Echo) {
	handlers.RegisterBookHandlers(e)
}
