package merchandise

import (
	"merchandise/api/response"
	"merchandise/models"
)

type Repository interface {
	AddMerchandise(*models.Merchandise) (*models.Merchandise, error)
	GetMerchandise(int64) (*models.Merchandise, error)
	FindMerchandise(*models.MerchandiseCondition) ([]*response.MerchandisesList, error)
	UpdMerchandise(int64, *models.MerchandiseUpdate) error
	DelMerchandise(int64) error
}
