package main

import (
	"fmt"
	"log"
	"merchandise/driver"
	"merchandise/pkg/seed"
)

func main() {
	orm, err := driver.NewOrm()
	if err != nil {
		log.Fatalf("Get orm error  : %s", err)
	}

	catalogs := seed.SeedForCatalog()
	fmt.Println("---------seed for catalog begin --------")
	n, insertErr := orm.Insert(catalogs)
	if insertErr != nil {
		log.Fatalf("Generated catalog table seed error : %s", insertErr)
	}
	fmt.Printf(" Seed for catalog table %d counts is finished ", n)
}
