package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Products struct {
	gorm.Model
	ID          uuid.UUID `gorm:"type:uuid"`
	Title       string
	Sku         string
	Description string
	Qty         int64
	Price       int64
	Images      []ProductImages `gorm:"foreignKey:ProductID"`
}

type ProductImages struct {
	gorm.Model
	ID        uuid.UUID `gorm:"type:uuid"`
	ProductID uuid.UUID `gorm:"column:product_id" gorm:"type:uuid" json:"product_id"`
	Path      string
}
