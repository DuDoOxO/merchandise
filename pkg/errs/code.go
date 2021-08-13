package errs

const (
	InvalidParams    = 400400
	Unauthorized     = 400401
	ForbiddenOper    = 400403
	NotFoundResource = 400404
	ServerUnknown    = 500000
	DBInsErr         = 500001
	DBGetErr         = 500002
	DBUpdErr         = 500003
	DBDelErr         = 500004
)
