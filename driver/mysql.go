package driver

import (
	"fmt"
	"log"
	"os"
	"sync"

	_ "github.com/go-sql-driver/mysql"
	"github.com/go-xorm/xorm"
	"github.com/joho/godotenv"
)

// global scope for orm use
var (
	orm  *xorm.Engine
	once sync.Once
)

// use singleton pattern to use db descriptor for global
func NewOrm() (*xorm.Engine, error) {
	var err error

	once.Do(func() {
		err = newOrm()
	})

	if err != nil {
		return nil, err
	}

	orm.ShowSQL(true)
	orm.ShowExecTime(true)
	return orm, nil
}

func newOrm() error {
	var err error
	err = godotenv.Load()
	if err != nil {
		log.Fatalf("load .env file error : %s", err)
	}
	user := os.Getenv("MYSQL_USER")
	password := os.Getenv("MYSQL_PASSWORD")
	db := os.Getenv("MYSQL_DATABASE")
	dsn := fmt.Sprintf("%s:%s@tcp(localhost:3306)/%s?charset=utf8mb4&collation=utf8mb4_unicode_ci", user, password, db)
	// dsn := "root:root@tcp(localhost:3306)/merchandise?charset=utf8mb4"
	cache := xorm.NewLRUCacher(xorm.NewMemoryStore(), 1000)
	orm, err = xorm.NewEngine("mysql", dsn)
	orm.SetDefaultCacher(cache)

	if err != nil {
		return fmt.Errorf("driver new orm error : %s", err)
	}
	return nil

}
