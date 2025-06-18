package controller

import (
	"github.com/gofiber/fiber/v2"

	"csi_go/src/auth/service"
)

func Signin(c *fiber.Ctx) error {
	data := service.SigninService(c)
	switch data.Code {
	case 200:
		return c.Status(data.Code).JSON(fiber.Map{"httpCode": data.Code, "status": data.Status, "message": data.Message, "data": data.Result})
	default:
		return c.Status(data.Code).JSON(fiber.Map{"httpCode": data.Code, "status": data.Status, "message": data.Message, "data": nil})
	}

}
