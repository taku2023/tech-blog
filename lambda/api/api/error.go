package api

import (
	"fmt"
)

type HTTPError struct {
	Code int
	error
}

func (err *HTTPError) Error() string {
	return fmt.Sprintf("status: %d, message: %s", err.Code, err.Error())
}