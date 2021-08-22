package response

import "time"

type MerchandiseCatalog struct {
	Id        int64     `json:"id" example:"123"`
	Name      string    `json:"name" example:"drink"`
	Hidden    int64     `json:"hidden" example:"0"`
	CreatedAt time.Time `json:"created_at" example:"2020-10-20 18:18:10"`
	UpdatedAt time.Time `json:"updated_at" example:"2020-10-21 20:18:10"`
}

type Merchandise struct {
	Id          int64       `json:"id" xorm:"pk autoincr not null"`
	Name        string      `json:"name" xorm:"not null" validate:"required"`
	Cost        int64       `json:"cost"`
	Price       int64       `json:"price" validate:"gtfield=Cost"`
	Statement   string      `json:"statement" xorm:"not null" validate:"required"`
	Launched    int64       `json:"launched" xorm:"default 0"`
	StartOfSale time.Time   `json:"start_of_sale" xorm:"not null" validate:"required"`
	EndOfSale   time.Time   `json:"end_of_sale" xorm:"not null" validate:"required,gtefield=StartOfSale"`
}
