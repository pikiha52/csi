package contract

type ProductRequest struct {
	Title       string `validate:"required" json:"title"`
	Sku         string `validate:"required" json:"sku"`
	Description string `validate:"required" json:"description"`
	Price       int64  `validate:"required" json:"price"`
	Qty         int64  `validate:"required" json:"qty"`
}
