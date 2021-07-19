package merchandise_catalog

import "merchandise/models"

type Repository interface {
	AddCatalog(*models.MerchandiseCatalog) (*models.MerchandiseCatalog, error)
	GetCatalog(int64) (*models.MerchandiseCatalog, error)
	FindCatalog(int64) ([]*models.MerchandiseCatalog, error)
	UpdCatalog(int64, *models.MerchandiseCatalog) ( error)
	DelCatalog(int64) error
}
