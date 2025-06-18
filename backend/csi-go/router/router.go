package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"

	AuthRoutes "csi_go/src/auth/routes"
	productRoutes "csi_go/src/product/routes"
	userRoutes "csi_go/src/user/routes"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api", logger.New())

	AuthRoutes.SetupAuthRoutes(api)
	userRoutes.SetupUserRoutes(api)
	productRoutes.SetupProductRoutes(api)
}
