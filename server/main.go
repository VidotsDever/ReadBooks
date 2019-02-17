package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"net/http"
)

func main()  {
	e := echo.New()
	//e.Use(middleware.Logger())
	e.Use(middleware.CORS())
	RegisterRouters(e)
	e.Logger.Fatal(http.ListenAndServe(":8080", e))
}
