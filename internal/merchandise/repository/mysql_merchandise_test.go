package repository

import (
	"fmt"
	"merchandise/config"
	"merchandise/driver"
	"merchandise/models"
	"os"
	"testing"
	"time"

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
	fmt.Println("====== merchandise mysql test start ======")
	setUp()
	code := m.Run()
	fmt.Println("====== merchandise mysql test end ======")
	os.Exit(code)
}

// Test AddMerchandise.
func TestAddMerchandise(t *testing.T) {
	// arrange
	orm, _ := driver.NewOrm()
	mRepo := NewMerchandise(orm)

	m := &models.Merchandise{
		Name:        "apple",
		Cost:        20,
		Price:       100,
		Statement:   "delicious food",
		StartOfSale: time.Now(),
		EndOfSale:   time.Now().Add(3 * 24 * time.Hour), // start + 3 days
	}

	// act
	resMer, err := mRepo.AddMerchandise(m)

	// assert
	assert.Nil(t, err)
	assert.NotNil(t, resMer.Id, 0)

	// teardown
	_, _ = orm.Delete(m)

}

// Test GetMerchandise.
func TestGetMerchandise(t *testing.T) {
	// arrange
	orm, _ := driver.NewOrm()
	mRepo := NewMerchandise(orm)
	id := int64(3)

	// act
	merchandise, err := mRepo.GetMerchandise(id)

	// assert
	assert.Nil(t, err)
	assert.NotNil(t, merchandise)

	// teardown

}

// Test FindMerchandise.
func TestFindMerchandise(t *testing.T) {
	// arrange
	orm, _ := driver.NewOrm()
	mRepo := NewMerchandise(orm)
	mc := &models.MerchandiseCondition{
		Launched: 0,
		UPrice:   100,
		LPrice:   30,
	}

	// act
	ml, err := mRepo.FindMerchandise(mc)

	// assert
	t.Log(ml[0])
	assert.Nil(t, err)
	assert.NotEqual(t, 0, len(ml))
	assert.Equal(t, mc.Launched, ml[0].Launched)

	// teardown

}

// Test UpdMerchandise.
func TestUpdMerchandise(t *testing.T) {
	// arrange
	orm, _ := driver.NewOrm()
	mRepo := NewMerchandise(orm)
	id := int64(2)
	um := &models.MerchandiseUpdate{
		Name:  "orange",
		Cost:  100,
		Price: 200,
	}
	pm := &models.Merchandise{}

	// act
	updErr := mRepo.UpdMerchandise(id, um)
	has, getErr := orm.Get(pm)

	// assert
	assert.Nil(t, updErr)
	assert.Nil(t, getErr)
	assert.Equal(t, has, true)
	assert.Equal(t, um.Name, pm.Name)
	assert.Equal(t, um.Cost, pm.Cost)
	assert.Equal(t, um.Price, pm.Price)

	// teardown
}

// Test DelMerchandise.
func TestDelMerchandise(t *testing.T) {
	// arrange
	orm, _ := driver.NewOrm()
	mRepo := NewMerchandise(orm)
	id := int64(5)
	prim := &models.Merchandise{}

	// act
	err := mRepo.DelMerchandise(id)

	// act-check
	_, _ = orm.ID(id).Get(prim)

	// assert
	assert.Nil(t, err)
	assert.Equal(t, prim.IsDisable, 1)

	// teardown
	_, _ = orm.Cols("is_disable").Update(&models.Merchandise{
		Id:        id,
		IsDisable: 0,
	})

}
