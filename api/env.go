package api

import (
	"log"
	"merchandise/driver"

	"github.com/go-xorm/xorm"
)

type Env struct {
	orm *xorm.Engine
}

var env = &Env{}

func GetEnv() *Env {
	return env
}

// initialize env when launched server

func InitOrm() *xorm.Engine {
	var err error
	env.orm, err = driver.NewOrm()
	if err != nil {
		log.Fatalf("Init orm error : %s", err)
	}

	return env.orm

}
