package routes

import (
	"merchandise/api"

	"github.com/gofiber/fiber/v2"
)

func merchandiseCatalogV1(app *fiber.App) {
	v1 := app.Group("/v1")
	{
		v1.Get("/merchandise-catalog/:id", func(ctx *fiber.Ctx) error {
			return api.GetMerchandiseCatalog(ctx)
		})

		v1.Get("/merchandise-catalog-list/:page", func(ctx *fiber.Ctx) error {
			return api.FindMerchandiseCatalog(ctx)
		})

		v1.Post("/merchandise-catalog/", func(ctx *fiber.Ctx) error {
			return api.AddMerchandiseCatalog(ctx)
		})

		v1.Put("/merchandise-catalog/:id", func(ctx *fiber.Ctx) error {
			return api.UpdMerchandiseCatalog(ctx)
		})

		v1.Delete("/merchandise-catalog/:id", func(ctx *fiber.Ctx) error {
			return api.DelMerchandiseCatalog(ctx)
		})
	}
}
