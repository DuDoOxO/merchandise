package routes

import (
	_ "merchandise/docs"

	fiberSwagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
)

func Init() *fiber.App {
	app := fiber.New()

	// cors setting
	//app.Use(cors.New(cors.Config{
	//	AllowOrigins: "http://localhost:9999",
	//	AllowHeaders: "Origin,Content-Type,Accept",
	//}))

	// add swagger handler : /swagger/index.html
	app.Get("/swagger/*", fiberSwagger.Handler)
	app.Get("/swagger/*", fiberSwagger.New(fiberSwagger.Config{
		URL:         "http://localhost:9999/doc.json",
		DeepLinking: false,
	}))

	merchandiseCatalogV1(app)
	return app
}
