package seed

import (
	"merchandise/models"

	"github.com/brianvoe/gofakeit/v6"
)

func SeedForCatalog() []*models.MerchandiseCatalog {
	gofakeit.Seed(0)
	const count = 20
	catalogs := make([]*models.MerchandiseCatalog, count)
	// catalogName := []string{"ABCDEFGHIJKLMNOPQRSTUVWXYZ_-"}
	for i := 0; i < count; i++ {
		createdTime := gofakeit.Date()
		catalog := models.MerchandiseCatalog{
			Name:      gofakeit.Animal(),
			CreatedAt: createdTime,
			UpdatedAt: createdTime,
		}
		catalogs[i] = &catalog
	}
	return catalogs
}
