package userRoutes

import (
	"github.com/gofiber/fiber/v2"

	"csi_go/src/auth/middleware"
	"csi_go/src/user/controller"
)

func SetupUserRoutes(router fiber.Router) {
	user := router.Group("user")

	user.Get("/", middleware.Protected(), controller.Index)
	user.Post("/", middleware.Protected(), controller.Create)
	user.Get("/:id", middleware.Protected(), controller.Show)
	user.Put("/:id", middleware.Protected(), controller.Update)
	user.Delete("/:id", middleware.Protected(), controller.Delete)
}
