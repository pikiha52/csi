package contract

type SigninInput struct {
	Username string `validate:"required" json:"username"`
	Password string `validate:"required" json:"password"`
}
