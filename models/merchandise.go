package models

import "time"

type MerchandiseCatalog struct {
	Id        int64     `json:"id" xorm:"pk autoincr not null"`
	Name      string    `json:"name" xorm:"not null" validate:"required"`
	Hidden    int64     `json:"hidden" xorm:"default 0"`
	PrevId    int64     `json:"prev_id" xorm:"default 0"`
	IsRoot    int64     `json:"is_root" xorm:"default 0"`
	IsDisable int64     `json:"is_disabl" xorm:"default 0"`
	CreatedAt time.Time `json:"created_at" xorm:"created"`
	UpdatedAt time.Time `json:"updated_at" xorm:"updated"`
}

type Merchandise struct {
	Id          int64     `json:"id" xorm:"pk autoincr not null"`
	Name        string    `json:"name" xorm:"not null" validate:"required"`
	Cost        int64     `json:"cost"`
	Price       int64     `json:"price" validate:"gtfield=Cost"`
	Statement   string    `json:"statement" xorm:"not null" validate:"required"`
	Launched    int64     `json:"launched" xorm:"default 0"`
	IsDisable   int64     `json:"is_disable" xorm:"default 0"`
	StartOfSale time.Time `json:"start_of_sale" xorm:"not null" validate:"required"`
	EndOfSale   time.Time `json:"end_of_sale" xorm:"not null" validate:"required,gtefield=StartOfSale"`
	CreatedAt   time.Time `json:"created_at" xorm:"created"`
	UpdatedAt   time.Time `json:"updated_at" xorm:"updated"`
}

type MerchandiseCondition struct {
	Name        string    `json:"name"`
	UPrice      int64     `json:"u_price"`
	LPrice      int64     `json:"l_price"`
	Launched    int64     `json:"launched"`
	StartOfSale time.Time `json:"start_of_sale"`
	EndOfSale   time.Time `json:"end_of_sale"`
}

type MerchandiseUpdate struct {
	Name        string    `json:"name" xorm:"not null" validate:"required"`
	Cost        int64     `json:"cost"`
	Price       int64     `json:"price" validate:"gtfield=Cost"`
	Statement   string    `json:"statement" xorm:"not null" validate:"required"`
	Launched    int64     `json:"launched" xorm:"default 0"`
	StartOfSale time.Time `json:"start_of_sale" xorm:"not null" validate:"required"`
	EndOfSale   time.Time `json:"end_of_sale" xorm:"not null" validate:"required,gtefield=StartOfSale"`
}

type CatalogLinkMerchandise struct {
	Id            int64     `json:"id" xorm:"pk autoincr not null"`
	LayerRoot     int64     `json:"layer_root" xorm:"default 0"`
	LayerA        int64     `json:"layer_a" xorm:"default 0"`
	LayerB        int64     `json:"layer_b" xorm:"default 0"`
	LayerC        int64     `json:"layer_c" xorm:"default 0"`
	LayerD        int64     `json:"layer_d" xorm:"default 0"`
	MerchandiseId int64     `json:"merchandise_id" xorm:"default 0"`
	Hidden        int64     `json:"hidden" xorm:"default 0"`
	CreatedAt     time.Time `json:"created_at" xorm:"created"`
	UpdatedAt     time.Time `json:"updated_at" xorm:"updated"`
}
