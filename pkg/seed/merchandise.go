package seed

import (
	"math/rand"
	"merchandise/models"
	"time"

	"github.com/brianvoe/gofakeit/v6"
)

func SeedForMerchandise() []*models.Merchandise {
	gofakeit.Seed(0)
	const count = 100
	merchandises := make([]*models.Merchandise, count)

	now := time.Now().UnixNano()
	randSoruce := rand.NewSource(now)
	randGenerator := rand.New(randSoruce)
	for i := 0; i < count; i++ {
		cost := randGenerator.Intn(1000)
		price := cost + randGenerator.Intn(100)
		day := time.Duration(randGenerator.Intn(10))
		createdTime := gofakeit.Date()
		date := gofakeit.Date()
		merchandise := &models.Merchandise{
			Name:        gofakeit.Vegetable(),
			Cost:        int64(cost),
			Price:       int64(price),
			Statement:   gofakeit.HipsterSentence(50),
			StartOfSale: date,
			EndOfSale:   date.Add(day),
			CreatedAt:   createdTime,
			UpdatedAt:   createdTime,
		}
		merchandises[i] = merchandise
	}
	return merchandises
}
