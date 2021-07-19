package repository

import (
	"fmt"
	"merchandise/internal/merchandise_catalog"
	"merchandise/models"

	"github.com/go-xorm/xorm"
)

type Catalog struct {
	orm *xorm.Engine
}

func NewCatalog(orm *xorm.Engine) merchandise_catalog.Repository {
	return &Catalog{
		orm: orm,
	}
}

func (c *Catalog) AddCatalog(catalog *models.MerchandiseCatalog) (*models.MerchandiseCatalog, error) {
	_, err := c.orm.Insert(catalog)
	if err != nil {
		return nil, fmt.Errorf(" Add catalog error : %s ", err)
	}

	return catalog, err
}

func (c *Catalog) GetCatalog(id int64) (*models.MerchandiseCatalog, error) {
	mc := &models.MerchandiseCatalog{
		Id:        id,
		IsDisable: 0,
	}
	get, err := c.orm.Get(mc)
	if err != nil {
		return nil, fmt.Errorf(" Get catalog error : %s", err)
	}

	if !get {
		return nil, nil
	}

	return mc, nil

}

func (c *Catalog) FindCatalog(page int64) ([]*models.MerchandiseCatalog, error) {
	mcs := make([]*models.MerchandiseCatalog, 0)
	offset := (page - 1) * 20
	sql := `
		SELECT
			id,
			name,
			hidden,
			created_at,
			updated_at
		FROM
			merchandise_catalog
		WHERE
			is_disable = 0
		LIMIT
			20
		OFFSET
			?
	`
	err := c.orm.SQL(sql, offset).Find(&mcs)
	if err != nil {
		return nil, fmt.Errorf(" List all catalogs error :%s", err)
	}

	return mcs, nil

}

func (c *Catalog) UpdCatalog(id int64, m *models.MerchandiseCatalog) error {
	_, err := c.orm.ID(id).Cols("hidden", "name").Update(m)
	if err != nil {
		return fmt.Errorf(" Update catalog error : %s", err)
	}
	
	return nil

}

func (c *Catalog) DelCatalog(id int64) error {
	_, err := c.orm.ID(id).Update(&models.MerchandiseCatalog{
		IsDisable: 1,
	})

	if err != nil {
		return fmt.Errorf(" Delete catalog error :%s ", err)
	}

	return nil
}
