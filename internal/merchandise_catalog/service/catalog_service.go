package service

import (
	"merchandise/api/request"
	"merchandise/api/response"
	"merchandise/internal/merchandise_catalog"
	"merchandise/models"
	"merchandise/pkg/errs"
)

type Catalog struct {
	mcRep merchandise_catalog.Repository
}

func NewCatalogSrv(mcRep merchandise_catalog.Repository) merchandise_catalog.Service {
	return &Catalog{
		mcRep: mcRep,
	}
}

func (c *Catalog) AddCatalog(reqCatalog *request.MerchandiseCatalog) error {
	var err error
	catalog := &models.MerchandiseCatalog{
		Name: reqCatalog.Name,
	}

	_, err = c.mcRep.AddCatalog(catalog)
	if err != nil {
		return errs.NewAppError(500, errs.DBInsErr, "", err)
	}

	return err
}

func (c *Catalog) GetCatalog(cId int64) (*response.MerchandiseCatalog, error) {
	var err error
	ca, err := c.mcRep.GetCatalog(cId)

	if err != nil {
		return nil, errs.NewAppError(500, errs.DBGetErr, "", err)
	}

	if ca == nil {
		return nil, errs.NewAppError(404, errs.NotFoundResource, "", nil)
	}

	res := &response.MerchandiseCatalog{
		Id:        ca.Id,
		Name:      ca.Name,
		Hidden:    ca.Hidden,
		CreatedAt: ca.CreatedAt,
		UpdatedAt: ca.UpdatedAt,
	}

	return res, nil

}

// Find : list all by page
func (c *Catalog) FindCatalog(page int64) ([]*response.MerchandiseCatalog, error) {
	var err error

	cas, err := c.mcRep.FindCatalog(page)
	if err != nil {
		return nil, errs.NewAppError(500, errs.DBGetErr, "", err)
	}

	if cas == nil {
		return nil, errs.NewAppError(400, errs.NotFoundResource, "", nil)
	}

	res := make([]*response.MerchandiseCatalog, 20)

	for i, mc := range cas {
		merc := &response.MerchandiseCatalog{
			Id:        mc.Id,
			Name:      mc.Name,
			Hidden:    mc.Hidden,
			CreatedAt: mc.CreatedAt,
			UpdatedAt: mc.UpdatedAt,
		}
		res[i] = merc
	}

	return res, nil

}

func (c *Catalog) UpdCatalog(cId int64, mu *request.MerchandiseCatalogUpdate) error {
	var err error
	uc := &models.MerchandiseCatalog{
		Name:   mu.Name,
		Hidden: mu.Hidden,
		PrevId: mu.PrevId,
		IsRoot: mu.IsRoot,
	}

	if err = c.mcRep.UpdCatalog(cId, uc); err != nil {
		return errs.NewAppError(500, errs.DBUpdErr, "", err)
	}

	return err

}

func (c *Catalog) DelCatalog(cId int64) error {
	var err error
	err = c.mcRep.DelCatalog(cId)
	if err != nil {
		return err
	}

	return err

}
