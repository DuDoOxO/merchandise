package errs
type AppErr struct {
	StatusCode int    `json:"status_code" example:"400"`
	Code       int    `json:"code " example:"400401"`
	Message    string `json:"message" example:"Invalid parameter"`
	CustomErr  error
}

type AppErrorMsg struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
}

func NewAppError(statusCode, code int, msg string, cusErr error) (e *AppErr) {
	e = &AppErr{}
	// message can be default or self-defined
	if msg != "" {
		e.Message = msg
	} else {
		e.Message = msgMap[code]
	}

	e.Code = code
	e.StatusCode = statusCode
	e.CustomErr = cusErr
	return
}

func (e *AppErr) Error() string {
	return e.Message
}

func (e *AppErr) GetStatus() int {
	return e.StatusCode
}

func (e *AppErr) GetErrMsg() *AppErrorMsg {
	return &AppErrorMsg{
		Code: e.Code,
		Msg:  e.Message,
	}
}

// for wrap type error use
func (e *AppErr) Unwrap() error {
	return e.CustomErr
}


