package service

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"csi_go/database"
	"csi_go/helper"
	"csi_go/src/user/model"
)

func IndexService(c *fiber.Ctx) []model.User {
	username := c.Query("username")

	db := database.DB
	var users []model.User

	if username != "" {
		err := db.Where("username = ?", username).Find(&users).Error
		if err != nil {
			return nil
		}
	} else {
		db.Find(&users)
	}

	if len(users) < 1 {
		return nil
	}

	return users
}

type UserRequest struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func CreateService(c *fiber.Ctx) int {
	db := database.DB
	var user model.User

	var userRequest UserRequest

	err := c.BodyParser(&userRequest)
	if err != nil {
		return 400
	}

	user.ID = uuid.New()
	user.Name = userRequest.Name
	user.Username = userRequest.Username

	hash, err := helper.HashPassword(userRequest.Password)
	if err != nil {
		return 400
	}

	user.Password = hash

	err = db.Create(&user).Error

	if err != nil {
		return 400
	}

	return 201
}

func ShowService(c *fiber.Ctx) *model.User {
	db := database.DB
	var user model.User

	userUuid := c.Params("id")

	err := db.Where("id = ?", userUuid).First(&user).Error
	if err != nil {
		return nil
	}

	return &user
}

func UpdateService(c *fiber.Ctx) int {
	db := database.DB
	var user model.User

	id := c.Params("id")

	db.Find(&user, "id = ?", id)
	if user.ID == uuid.Nil {
		return 404
	}

	var updateRequest UserRequest
	err := c.BodyParser(&updateRequest)
	if err != nil {
		return 400
	}

	user.Name = updateRequest.Name
	user.Username = updateRequest.Username

	if updateRequest.Password != "" {
		hash, err := helper.HashPassword(updateRequest.Password)
		if err != nil {
			return 400
		}

		user.Password = hash
	}

	db.Save(&user)

	return 200
}

func DeleteService(c *fiber.Ctx) int {
	db := database.DB
	var user model.User

	id := c.Params("id")
	db.Find(&user, "id = ?", id)

	if user.ID == uuid.Nil {
		return 404
	}

	err := db.Delete(&user, "id = ?", id).Error

	if err != nil {
		return 500
	}

	return 200
}

func ShowUserByUsername(username string) *model.User {
	db := database.DB
	var user model.User

	err := db.Where("username = ?", username).Find(&user).Error
	if err != nil {
		return nil
	}

	return &user
}
