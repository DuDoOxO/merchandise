package request

type MerchandiseCatalog struct {
	Name string `json:"name"`
}

type MerchandiseCatalogUpdate struct {
	Name   string `json:"name"`
	Hidden int64  `json:"hidden"`
}
