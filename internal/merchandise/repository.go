package merchandise

import (
	"merchandise/models"
)

type Repository interface {
	AddMerchandise(*models.Merchandise) (*models.Merchandise, error)
	GetMerchandise(int64) (*models.Merchandise, error)
	FindMerchandise(*models.MerchandiseCondition) ([]*models.FindMerchandiseOutput, error)
	UpdMerchandise(int64, *models.MerchandiseUpdate) error
	DelMerchandise(int64) error
}
