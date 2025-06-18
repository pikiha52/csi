package contract

type Response struct {
	Code    int     `json:"code"`
	Status  bool    `json:"status"`
	Message string  `json:"message"`
	Result  Results `json:"results"`
}

type Results struct {
	Username    string `json:"username"`
	AccessToken string `json:"access_token"`
}
