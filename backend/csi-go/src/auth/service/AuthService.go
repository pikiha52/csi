package service

import (
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"

	"csi_go/config"
	"csi_go/helper"
	"csi_go/src/auth/contract"
	"csi_go/src/user/service"
)

func SigninService(c *fiber.Ctx) contract.Response {
	var userInput contract.SigninInput
	validate := validator.New()

	err := c.BodyParser(&userInput)
	if err != nil {
		return contract.Response{
			Code:    400,
			Status:  false,
			Message: "Invalid user input!, please try again.",
			Result:  contract.Results{},
		}
	}

	if errValidate := validate.Struct(userInput); errValidate != nil {
		return contract.Response{
			Code:    400,
			Status:  false,
			Message: errValidate.Error(),
			Result:  contract.Results{},
		}
	}

	user := service.ShowUserByUsername(userInput.Username)

	if user.Username == "" {
		return contract.Response{
			Code:    404,
			Status:  false,
			Message: "User not found",
			Result:  contract.Results{},
		}
	}

	if !helper.CheckPasswordHash(userInput.Password, user.Password) {
		return contract.Response{
			Code:    fiber.StatusUnauthorized,
			Status:  false,
			Message: "Invalid password or username!",
			Result:  contract.Results{},
		}
	}

	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = user.Username
	claims["user_id"] = user.ID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	t, err := token.SignedString([]byte(config.Config("SECRET")))
	if err != nil {
		return contract.Response{
			Code:    500,
			Status:  false,
			Message: "Failed to signin!",
			Result:  contract.Results{},
		}
	}

	results := contract.Results{
		Username:    user.Username,
		AccessToken: t,
	}

	return contract.Response{
		Code:    200,
		Status:  true,
		Message: "Success signin",
		Result:  results,
	}
}
