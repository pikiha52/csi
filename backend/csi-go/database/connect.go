package database

import (
	"fmt"
	"log"
	"strconv"

	"csi_go/config"
	productModel "csi_go/src/product/model"
	"csi_go/src/user/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error

	p := config.Config("DB_PORT")
	port, err := strconv.ParseUint(p, 10, 32)

	if err != nil {
		log.Println("Error parsing DB port")
	}

	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", config.Config("DB_HOST"), port, config.Config("DB_USER"), config.Config("DB_PASSWORD"), config.Config("DB_NAME"))

	DB, err = gorm.Open(postgres.Open(dsn))

	if err != nil {
		panic("Failed to open database!")
	}

	fmt.Println("Connection Opened to Database")

	DB.AutoMigrate(&model.User{}, &productModel.Products{}, &productModel.ProductImages{})
}
