package repositories

import (
	"csi_go/database"
)

func QueryAllData(models interface{}) interface{} {
	db := database.DB
	db.Find(&models)

	return models
}
