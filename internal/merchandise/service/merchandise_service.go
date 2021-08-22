package service

import (
	"encoding/json"
	"merchandise/api/request"
	"merchandise/api/response"
	"merchandise/internal/merchandise"
	"merchandise/models"
	"merchandise/pkg/errs"
)

type Merchandise struct {
	mRepo merchandise.Repository
}

func NewMerchandise(mRepo merchandise.Repository) merchandise.Service {
	return &Merchandise{
		mRepo: mRepo,
	}
}

func (m *Merchandise) AddMerchandise(mer *request.Merchandise) error {
	im := &models.Merchandise{}

	mBytes, err := json.Marshal(mer)
	if err != nil {
		return errs.NewAppError(500, errs.ServerUnknown, "marshal merchandise erro : %w", err)
	}

	if err = json.Unmarshal(mBytes, im); err != nil {
		return errs.NewAppError(500, errs.ServerUnknown, "unmarshal merchandise error :%w", err)
	}

	_, err = m.mRepo.AddMerchandise(im)
	if err != nil {
		return errs.NewAppError(500, errs.DBInsErr, "", err)
	}

	return nil

}

func (m *Merchandise) GetMerchandise(mId int64) (*response.Merchandise, error) {
	mer, err := m.mRepo.GetMerchandise(mId)
	if err != nil {
		return nil, errs.NewAppError(500, errs.DBGetErr, "", err)
	}

	res := &response.Merchandise{
		Id:          mer.Id,
		Name:        mer.Name,
		Cost:        mer.Cost,
		Price:       mer.Price,
		Statement:   mer.Statement,
		Launched:    mer.Launched,
		StartOfSale: mer.StartOfSale,
		EndOfSale:   mer.EndOfSale,
	}

	return res, nil

}

func (m *Merchandise) FindMerchandise(mCondi *request.MerchandiseCondition) ([]*response.Merchandise, error) {
	merCondi := &models.MerchandiseCondition{
		Name:        mCondi.Name,
		UPrice:      mCondi.UPrice,
		LPrice:      mCondi.LPrice,
		Launched:    mCondi.Launched,
		StartOfSale: mCondi.StartOfSale,
		EndOfSale:   mCondi.EndOfSale,
	}
	mers, err := m.mRepo.FindMerchandise(merCondi)
	if err != nil {
		return nil, errs.NewAppError(500, errs.DBGetErr, "", err)
	}

	res := make([]*response.Merchandise, 0)
	mersBytes, err := json.Marshal(mers)
	if err != nil {
		return nil, errs.NewAppError(500, errs.ServerUnknown, "finding merchandise marshal error : %w", err)
	}

	if err := json.Unmarshal(mersBytes, res); err != nil {
		return nil, errs.NewAppError(500, errs.ServerUnknown, "finding merchandise unmarshal error : %w", err)
	}

	return res, nil

}

func (m *Merchandise) UpdMerchandise(mId int64, mer *request.Merchandise) error {
	mupd := &models.MerchandiseUpdate{
		Name:        mer.Name,
		Cost:        mer.Cost,
		Price:       mer.Price,
		Statement:   mer.Statement,
		Launched:    mer.Launched,
		StartOfSale: mer.StartOfSale,
		EndOfSale:   mer.EndOfSale,
	}

	err := m.mRepo.UpdMerchandise(mId, mupd)
	if err != nil {
		return errs.NewAppError(500, errs.DBUpdErr, "", err)
	}

	return nil

}

func (m *Merchandise) DelMerchandise(mId int64) error {
	if err := m.mRepo.DelMerchandise(mId); err != nil {
		return errs.NewAppError(500, errs.DBDelErr, "", err)
	}

	return nil

}
