package controller

import (
	"github.com/gofiber/fiber/v2"

	"csi_go/src/user/service"
)

func Index(c *fiber.Ctx) error {
	data := service.IndexService(c)

	if len(data) < 1 {
		return c.Status(422).JSON(fiber.Map{"status": "not content", "message": "user is null", "data": nil})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "success", "data": data})
}

func Create(c *fiber.Ctx) error {
	data := service.CreateService(c)

	if data == 201 {
		return c.Status(201).JSON(fiber.Map{"status": "success", "message": "success created", "data": nil})
	} else {
		return c.Status(400).JSON(fiber.Map{"status": "failed", "message": "failed created", "data": nil})
	}
}

func Show(c *fiber.Ctx) error {
	data := service.ShowService(c)

	if data == nil {
		return c.Status(404).JSON(fiber.Map{"status": "failed", "message": "user not found", "data": nil})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "success", "data": data})
}

func Update(c *fiber.Ctx) error {
	data := service.UpdateService(c)

	if data == 200 {
		return c.JSON(fiber.Map{"status": "success", "message": "success", "data": nil})
	} else {
		return c.JSON(fiber.Map{"status": "error", "message": "error", "data": nil})
	}
}

func Delete(c *fiber.Ctx) error {
	data := service.DeleteService(c)

	if data == 200 {
		return c.JSON(fiber.Map{"status": "success", "message": "success", "data": nil})
	} else {
		return c.Status(404).JSON(fiber.Map{"status": "failed", "message": "failed", "data": nil})
	}

}
