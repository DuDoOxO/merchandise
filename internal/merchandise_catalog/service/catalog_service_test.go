package service

import (
	"fmt"
	"merchandise/api/request"
	"merchandise/config"
	"merchandise/driver"
	"merchandise/internal/merchandise_catalog/repository"
	"merchandise/models"
	"os"
	"testing"

	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func setUp() {
	if err := godotenv.Load(config.GetAppBasePath() + "/.env"); err != nil {
		panic(fmt.Sprintf(" load .env error : %s", err))
	}
}

// Test Main.
func TestMain(m *testing.M) {
	fmt.Println("====== catalog service test start====== ")
	setUp()
	code := m.Run()
	fmt.Println("====== catalog service test end====== ")
	os.Exit(code)
}

// Test AddCatalog.
func TestAddCatalog(t *testing.T) {
	// arranege
	orm, _ := driver.NewOrm()
	cRep := repository.NewCatalog(orm)
	cSrv := NewCatalogSrv(cRep)
	catalog := &request.MerchandiseCatalog{
		Name: "cuisine",
	}

	// act
	err := cSrv.AddCatalog(catalog)

	// assert
	assert.Nil(t, err)

	// teardowm
	_, _ = orm.Exec(" Delete from merchandise_catalog where name= ?", catalog.Name)
}

// Test GetCatalog.
func TestGetCatalog(t *testing.T) {
	// arrange
	orm, _ := driver.NewOrm()
	cRep := repository.NewCatalog(orm)
	cSrv := NewCatalogSrv(cRep)
	cId := int64(3)

	// act
	ca, err := cSrv.GetCatalog(cId)

	// assert
	assert.Nil(t, err)
	assert.NotNil(t, ca)

	// teardown
}

// Test FindCatalog.
func TestFindCatalog(t *testing.T) {
	// arrange
	orm, _ := driver.NewOrm()
	cRep := repository.NewCatalog(orm)
	cSrv := NewCatalogSrv(cRep)
	page := int64(1)

	// act
	cas, err := cSrv.FindCatalog(page)

	// assert
	assert.Nil(t, err)
	assert.NotEmpty(t, cas)

	// teardown
}

// Test UpdCatalog.
func TestUpdCatalog(t *testing.T) {
	// arrange
	orm, _ := driver.NewOrm()
	cRep := repository.NewCatalog(orm)
	cSrv := NewCatalogSrv(cRep)
	cId := int64(4)
	old := &models.MerchandiseCatalog{}
	news := &models.MerchandiseCatalog{}
	updCatalog := &request.MerchandiseCatalogUpdate{
		Name:   "apple",
		Hidden: 1,
		PrevId: 8,
		IsRoot: 0,
	}

	// act
	_, _ = orm.ID(cId).Get(old)
	err := cSrv.UpdCatalog(cId, updCatalog)
	_, _ = orm.ID(cId).Get(news)
	// assert
	assert.Nil(t, err)
	t.Log("old:", old)
	assert.NotEqual(t, old.Name, news.Name)
	assert.NotEqual(t, old.Hidden, news.Hidden)

	//teardown
	_, _ = orm.ID(cId).Cols("name", "hidden", "prev_id", "is_root").Update(old)
	// _, _ = orm.Exec("Update merchandise_catalog set name=? and hidden=? and prev_id=? and is_root=?", old.Name, old.Hidden, old.PrevId, old.IsRoot)

}

// Test DelCatalog.
func TestDelCatalog(t *testing.T) {
	// arrange
	orm, _ := driver.NewOrm()
	cRep := repository.NewCatalog(orm)
	cSrv := NewCatalogSrv(cRep)
	cId := int64(4)
	del := &models.MerchandiseCatalog{}
	// act
	err := cSrv.DelCatalog(cId)
	_, _ = orm.ID(cId).Get(del)
	// assert
	assert.Nil(t, err)
	assert.Equal(t, int64(1), del.IsDisable)

	// teardown
	_, _ = orm.Exec("Update merchandise_catalog set is_disable = 0 where id = ?", cId)
}
