package service

import (
	"fmt"
	"merchandise/config"
	"os"
	"testing"

	"github.com/joho/godotenv"
)

func setup() {
	if err := godotenv.Load(config.GetAppBasePath() + "/.env"); err != nil {
		panic(err)
	}
}

// Test Main.
func TestMain(m *testing.M) {
	fmt.Println("====== merchandise service start ======")
	setup()
	code := m.Run()
	os.Exit(code)
	fmt.Println("====== merchandise service end ======")
}

// Test AddMerchandise.
func TestAddMerchandise(t *testing.T) {

}

// Test GetMerchandise.
func TestGetMerchandise(t *testing.T) {

}

// Test FindMerchandise.
func TestFindMerchandise(t *testing.T) {

}

// Test UpdMerchandise.
func TestUpdMerchandise(t *testing.T) {

}

// Test DelMerchandise.
func TestDelMerchandise(t *testing.T) {

}
