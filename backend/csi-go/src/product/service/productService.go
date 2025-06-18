package service

import (
	"csi_go/database"
	"csi_go/src/product/contract"
	"csi_go/src/product/model"
	"errors"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm/clause"
)

func Create(dto contract.ProductRequest) (error, *model.Products) {
	db := database.DB
	var product model.Products

	_ = db.Where("sku = ?", dto.Sku).Find(&product).Error

	if product.Sku == "" {
		product.ID = uuid.New()
		product.Title = dto.Title
		product.Sku = dto.Sku
		product.Description = dto.Description
		product.Price = dto.Price
		product.Qty = dto.Qty

		err := db.Create(&product).Error
		if err != nil {
			return errors.New("failed create product!"), nil
		}
	} else {
		return errors.New("sku is exist!"), nil
	}

	return nil, &product
}

func UploadImage(c *fiber.Ctx) (error, *model.Products) {
	db := database.DB
	var product model.Products

	productID := c.FormValue("product_id")
	if productID == "" {
		return errors.New("product id is required"), nil
	}

	_ = db.Where("id = ?", productID).Preload(clause.Associations).Find(&product).Error
	if product.Sku == "" {
		return errors.New("product not found!"), nil
	}

	form, err := c.MultipartForm()
	if err != nil {
		return errors.New("bad request"), nil
	}

	files := form.File["images"]
	if len(files) == 0 {
		return errors.New("no images uploaded"), nil
	}

	var imagePaths []string
	for _, file := range files {
		filename := fmt.Sprintf("uploads/%d_%s", time.Now().UnixNano(), file.Filename)

		if err := c.SaveFile(file, filename); err != nil {
			return errors.New("failed to save file"), nil
		}

		image := model.ProductImages{
			ID:        uuid.New(),
			ProductID: product.ID,
			Path:      filename,
		}

		if err := database.DB.Create(&image).Error; err != nil {
			return errors.New("failed to save image record"), nil
		}

		imagePaths = append(imagePaths, filename)
	}

	return nil, &product
}

func ProductList(c *fiber.Ctx) (error, fiber.Map) {
	var req contract.ProductListRequest
	if err := c.BodyParser(&req); err != nil {
		return errors.New("invalid request body"), nil
	}

	if req.Page < 1 {
		req.Page = 1
	}

	if req.PerPage < 1 {
		req.PerPage = 10
	}

	offset := (req.Page - 1) * req.PerPage

	var products []model.Products
	query := database.DB.Model(&model.Products{})

	if req.Search != "" {
		query = query.Where("title LIKE ?", "%"+req.Search+"%")
	}

	var total int64
	query.Count(&total)

	err := query.Limit(req.PerPage).Preload(clause.Associations).Offset(offset).Find(&products).Error
	if err != nil {
		return errors.New("failed to get products"), nil
	}

	return nil, fiber.Map{
		"data": products,
		"meta": fiber.Map{
			"total":    total,
			"page":     req.Page,
			"per_page": req.PerPage,
		},
	}
}
