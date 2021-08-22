package main

import (
	"fmt"
	"log"
	"merchandise/config"
	"merchandise/driver"
	"merchandise/pkg/seed"
	"sync"

	"github.com/joho/godotenv"
)

func setUp() {
	if err := godotenv.Load(config.GetAppBasePath() + "/.env"); err != nil {
		panic(fmt.Sprintf(" load .env error : %s", err))
	}
}

func main() {
	setUp()
	wg := new(sync.WaitGroup)
	wg.Add(2)
	orm, err := driver.NewOrm()
	if err != nil {
		log.Fatalf("Get orm error  : %s", err)
	}
	go func() {
		catalogs := seed.SeedForCatalog()
		fmt.Println("---------seed for catalog begin --------")
		n, insertErr := orm.Insert(catalogs)
		if insertErr != nil {
			log.Fatalf("Generated catalog table seed error : %s", insertErr)
		}
		fmt.Printf(" Seed for catalog table %d counts is finished\n ", n)
		wg.Done()
	}()

	go func() {
		merchandise := seed.SeedForMerchandise()
		fmt.Println("---------seed for merchandise begin --------")
		n, insertErr := orm.Insert(merchandise)
		if insertErr != nil {
			log.Fatalf("Generated merchandise table seed error : %s", insertErr)
		}
		fmt.Printf(" Seed for merchandise table %d counts is finished\n ", n)
		wg.Done()
	}()

	wg.Wait()
}
