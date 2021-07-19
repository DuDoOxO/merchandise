package main

import (
	"log"
	"merchandise/api"
	"merchandise/routes"
)

// @title Merchandise Example API
// @version 1.0
// @description This is a sample api for merchandise
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email fiber@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:9999
//// @BasePath /v1
func main() {
	var err error

	// init env - orm
	_ = api.InitOrm()

	// init env - route
	app := routes.Init()
	if err = app.Listen(":9999"); err != nil {
		log.Fatalf("launched error : %s ", err)
	}

}
