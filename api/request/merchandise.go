package request

import "time"

type MerchandiseCatalog struct {
	Name string `json:"name"`
}

type MerchandiseCatalogUpdate struct {
	Name   string `json:"name"`
	Hidden int64  `json:"hidden"`
	PrevId int64  `json:"prev_id"`
	IsRoot int64  `json:"is_root"`
}

type Merchandise struct {
	Name        string    `json:"name"`
	Cost        int64     `json:"cost"`
	Price       int64     `json:"price"`
	Statement   string    `json:"statement"`
	Launched    int64     `json:"launched"`
	StartOfSale time.Time `json:"start_of_sale"`
	EndOfSale   time.Time `json:"end_of_sale"`
}

type MerchandiseCondition struct {
	Name        string    `json:"name"`
	UPrice      int64     `json:"u_price"`
	LPrice      int64     `json:"l_price"`
	Launched    int64     `json:"launched"`
	StartOfSale time.Time `json:"start_of_sale"`
	EndOfSale   time.Time `json:"end_of_sale"`
}
