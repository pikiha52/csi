package ProductRoutes

import (
	"csi_go/src/auth/middleware"
	"csi_go/src/product/controller"

	"github.com/gofiber/fiber/v2"
)

func SetupProductRoutes(router fiber.Router) {
	product := router.Group("products")

	product.Post("/", middleware.Protected(), controller.CreateProduct)
	product.Post("/images", middleware.Protected(), controller.ProductImages)
	product.Post("/list", controller.Products)
}
