package dbops

import (
	"database/sql"
	"fmt"
)
import _ "github.com/go-sql-driver/mysql"

var (
	db *sql.DB
	err error
)

func init() {
	db, err = sql.Open("mysql", "vidots:weichuang@tcp(localhost:3306)/read_books")
	if err != nil {
		panic(err)
	}
	if err := db.Ping(); err != nil {
		panic(err)
	}
	fmt.Println("连接数据库成功")
}
