package merchandise_catalog

import (
	"merchandise/api/request"
	"merchandise/api/response"
)

type Service interface {
	AddCatalog(*request.MerchandiseCatalog) error
	GetCatalog(int64) (*response.MerchandiseCatalog, error)
	// Find : list all by page
	FindCatalog(int64) ([]*response.MerchandiseCatalog, error)
	UpdCatalog(int64, *request.MerchandiseCatalogUpdate) error
	DelCatalog(int64) error
}
