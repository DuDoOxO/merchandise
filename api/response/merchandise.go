package response

import "time"

type MerchandiseCatalog struct {
	Id        int64     `json:"id" example:"123"`
	Name      string    `json:"name" example:"drink"`
	Hidden    int64     `json:"hidden" example:"0"`
	CreatedAt time.Time `json:"created_at" example:"2020-10-20 18:18:10"`
	UpdatedAt time.Time `json:"updated_at" example:"2020-10-21 20:18:10"`
}
