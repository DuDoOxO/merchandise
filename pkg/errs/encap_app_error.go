package errs

import "fmt"

type ApplicationError struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
	CustomErr  error
}

type AppErrorMsg struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
}

func NewAppError(s int, cusErr error) *ApplicationError {
	return &ApplicationError{
		StatusCode: s,
		Message:    msgMap[s],
		CustomErr:  cusErr,
	}
}

func (a *ApplicationError) Error() string {
	return fmt.Sprintf("msg : %s , causeErr : %s", a.Message, a.CustomErr)
}

func (a *ApplicationError) GetErrMsg() *AppErrorMsg {
	return &AppErrorMsg{
		Code: a.StatusCode,
		Msg:  a.Message,
	}
}
