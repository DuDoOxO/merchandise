package models

import "time"

type MerchandiseCatalog struct {
	Id        int64     `json:"id"`
	Name      string    `json:"name"`
	Hidden    int64     `json:"hidden"`
	IsDisable int64     `json:"is_disable"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Merchandise struct {
	Id          int64     `json:"id"`
	Name        string    `json:"name"`
	Cost        int64     `json:"cost"`
	Price       int64     `json:"price"`
	Statement   string    `json:"statement"`
	Launched    int64     `json:"launched"`
	IsDisable   int64     `json:"is_disable"`
	StartOfSale time.Time `json:"start_of_sale"`
	EndOfSale   time.Time `json:"end_of_sale"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CatalogLinkMerchandise struct {
	Id            int64     `json:"id"`
	LayerRoot     int64     `json:"layer_root"`
	LayerA        int64     `json:"layer_a"`
	LayerB        int64     `json:"layer_b"`
	LayerC        int64     `json:"layer_c"`
	LayerD        int64     `json:"layer_d"`
	MerchandiseId int64     `json:"merchandise_id"`
	Hidden        int64     `json:"hiddn"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
