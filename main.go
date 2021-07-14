package main

import (
	"log"
	"merchandise/routes"
)

// @title Fiber Example API
// @version 1.0
// @description This is a sample swagger for Fiber
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email fiber@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:8080
// @BasePath /v1
func main() {
	app := routes.Init()
	if err := app.Listen(":9999"); err != nil {
		log.Fatalf("launched error : %s ", err)
	}

}
