package repository

import (
	"fmt"
	"merchandise/config"
	"merchandise/driver"
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
	// arrange
	orm, _ := driver.NewOrm()
	catalogRepo := NewCatalog(orm)
	name := "drink"
	c := &models.MerchandiseCatalog{
		Name: name,
	}

	// act
	mc, err := catalogRepo.AddCatalog(c)

	// assert
	assert.Nil(t, err)
	assert.Equal(t, mc.Name, name)

	// teardown
	_, _ = orm.Delete(c)

}

// Test GetCatalog.
func TestGetCatalog(t *testing.T) {
	// arrange
	orm, _ := driver.NewOrm()
	catalogRep := NewCatalog(orm)
	index := int64(3)

	// act
	catalog, err := catalogRep.GetCatalog(index)

	// assert
	assert.Nil(t, err)
	assert.Equal(t, catalog.Id, index)

}

// // Test FindCatalog.
func TestFindCatalog(t *testing.T) {
	// arrange
	orm, _ := driver.NewOrm()
	catalogRep := NewCatalog(orm)
	page := int64(1)
	// act
	catalogs, err := catalogRep.FindCatalog(page)

	// assert
	assert.Nil(t, err)
	assert.Equal(t, len(catalogs), 20)

}

// Test UpdCatalog.
func TestUpdCatalog(t *testing.T) {
	// 	// arrange
	orm, _ := driver.NewOrm()
	catalogRep := NewCatalog(orm)

	id := int64(2)
	name := "animal"
	hidden := int64(1)
	old := &models.MerchandiseCatalog{}
	m := &models.MerchandiseCatalog{
		Name:   name,
		Hidden: hidden,
	}

	// act-get
	_, _ = orm.ID(id).Get(old)
	err := catalogRep.UpdCatalog(id, m)

	// assert
	assert.Nil(t, err)
	assert.NotEqual(t, m.Name, old.Name)
	assert.NotEqual(t, m.Hidden, old.Hidden)

	// teardown
	_, _ = orm.ID(id).Cols("hidden", "name").Update(old)

}

// Test DelCatalog.
func TestDelCatalog(t *testing.T) {
	// arrange
	orm, _ := driver.NewOrm()
	catalogRep := NewCatalog(orm)

	id := int64(100)
	// act
	err := catalogRep.DelCatalog(id)

	// assert
	assert.Nil(t, err)

	// teardown
	_, _ = orm.ID(id).Cols("is_disable").Update(&models.MerchandiseCatalog{
		IsDisable: 0,
	})

}
