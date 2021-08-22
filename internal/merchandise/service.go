package merchandise

import (
	"merchandise/api/request"
	"merchandise/api/response"
)

type Service interface {
	AddMerchandise(*request.Merchandise) error
	GetMerchandise(int64) (*response.Merchandise, error)
	FindMerchandise(*request.MerchandiseCondition) ([]*response.Merchandise, error)
	UpdMerchandise(int64, *request.Merchandise) error
	DelMerchandise(int64) error
}
