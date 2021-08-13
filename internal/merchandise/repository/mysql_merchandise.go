package repository

import (
	"fmt"
	"merchandise/api/response"
	"merchandise/internal/merchandise"
	"merchandise/models"
	"time"

	"github.com/go-xorm/xorm"
)

type Merchandise struct {
	orm *xorm.Engine
}

func NewMerchandise(orm *xorm.Engine) merchandise.Repository {
	return &Merchandise{
		orm: orm,
	}
}

func (m *Merchandise) AddMerchandise(mer *models.Merchandise) (*models.Merchandise, error) {
	_, err := m.orm.Insert(mer)
	if err != nil {
		return nil, fmt.Errorf("Add Merchandise error : %s", err)
	}

	return mer, nil

}

func (m *Merchandise) GetMerchandise(index int64) (*models.Merchandise, error) {
	mer := &models.Merchandise{}
	has, err := m.orm.Where("is_disable = ?", 0).Get(mer)
	if err != nil {
		return nil, fmt.Errorf("Get Merchandise error :%s", err)
	}

	if !has {
		return nil, nil
	}

	return mer, nil

}

func (m *Merchandise) FindMerchandise(mer *models.MerchandiseCondition) ([]*response.MerchandisesList, error) {
	// name,price,launched,start_of_sale,end_of_sale
	res := make([]*response.MerchandisesList, 0)
	sql := `
	SELECT
		id,
		name,
		cost,
		price,
		statement,
		launched,
		start_of_sale,
		end_of_sale
	From merchandsie
	WHERE
		launched = ?
	AND
		price >= ?
	AND
		price <= ?
	`

	// name
	if mer.Name != "" {
		sql += "AND name = ?"
	}

	if !time.Time.IsZero(mer.StartOfSale) {
		sql += "AND start_of_sale <= ?"
	}

	if !time.Time.IsZero(mer.EndOfSale) {
		sql += "AND end_of_sale >= ?"
	}

	// ----Query----
	// name + start + end
	if mer.Name != "" && !time.Time.IsZero(mer.StartOfSale) && !time.Time.IsZero(mer.EndOfSale) {
		err := m.orm.SQL(sql, mer.Launched, mer.LPrice, mer.UPrice, mer.Name, mer.StartOfSale, mer.EndOfSale).Find(&res)
		if err != nil {
			return nil, fmt.Errorf("list all merchandise error : %s ", err)
		}
		return res, nil
	}

	// start + end
	if !time.Time.IsZero(mer.StartOfSale) && !time.Time.IsZero(mer.EndOfSale) {
		err := m.orm.SQL(sql, mer.Launched, mer.LPrice, mer.UPrice, mer.StartOfSale, mer.EndOfSale).Find(&res)
		if err != nil {
			return nil, fmt.Errorf("list time merchandise error : %s ", err)
		}
		return res, nil
	}

	// name
	if mer.Name != "" {
		err := m.orm.SQL(sql, mer.Launched, mer.LPrice, mer.UPrice, mer.Name).Find(&res)
		if err != nil {
			return nil, fmt.Errorf("list name merchandise error : %s ", err)
		}
		return res, nil
	}

	// only launched + uprice + lprice
	err := m.orm.SQL(sql, mer.Launched, mer.LPrice, mer.UPrice).Find(&res)
	if err != nil {
		return nil, fmt.Errorf("list default merchandise error : %s ", err)
	}

	return nil, nil

}

func (m *Merchandise) UpdMerchandise(id int64, mer *models.MerchandiseUpdate) error {
	_, err := m.orm.ID(id).Update(mer)
	if err != nil {
		return fmt.Errorf("Update Merchandise error : %s", err)
	}

	return nil

}

func (m *Merchandise) DelMerchandise(id int64) error {
	_, err := m.orm.ID(id).Cols("is_disable").Update(&models.Merchandise{
		IsDisable: 1,
	})

	if err != nil {
		return fmt.Errorf("Delete Merchandise error :%s", err)
	}

	return nil
}
