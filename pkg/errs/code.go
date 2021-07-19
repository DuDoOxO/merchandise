package errs

const (
	InvalidParams    = 400
	Unauthorized     = 401
	ForbiddenOper    = 403
	NotFoundResource = 404
	ServerUnknown    = 500000
	DBInsErr         = 500001
	DBGetErr         = 500002
	DBUpdErr         = 500003
	DBDelErr         = 500004
)
