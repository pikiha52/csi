package controller

import (
	"csi_go/src/product/contract"
	"csi_go/src/product/service"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func CreateProduct(c *fiber.Ctx) error {
	var productRequest contract.ProductRequest
	validate := validator.New()

	err := c.BodyParser(&productRequest)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"httpCode": 400,
			"message":  "bad request",
			"data":     nil,
			"error":    "",
		})
	}

	if errValidate := validate.Struct(productRequest); errValidate != nil {
		return c.Status(400).JSON(fiber.Map{
			"httpCode": 400,
			"message":  "bad request",
			"data":     nil,
			"error":    errValidate.Error(),
		})
	}

	err, product := service.Create(productRequest)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"httpCode": 400, "message": "failed", "data": nil, "error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"httpCode": 201, "message": "created", "data": product})
}

func ProductImages(c *fiber.Ctx) error {
	err, product := service.UploadImage(c)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"httpCode": 400, "message": "failed", "data": nil, "error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"httpCode": 201, "message": "created", "data": product})
}

func Products(c *fiber.Ctx) error {
	err, products := service.ProductList(c)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"httpCode": 400, "message": "failed", "data": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"httpCode": 201, "message": "created", "data": products})
}
