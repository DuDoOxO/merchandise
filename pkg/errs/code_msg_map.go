package errs

var msgMap = map[int]string{
	InvalidParams:    "Wrong or invalid params",
	Unauthorized:     "Resource need to be authorized",
	ForbiddenOper:    "Has no right to operation",
	NotFoundResource: "Resource not found",
	ServerUnknown:    "Server has unexpeted error",
	DBInsErr:         "Server DB Insert operation error",
	DBGetErr:         "Server DB Get operation error",
	DBUpdErr:         "Server DB Update operation error",
	DBDelErr:         "Server DB Delete operation error",
}
