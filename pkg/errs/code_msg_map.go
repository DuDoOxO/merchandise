package errs

var msgMap = map[int]string{
	InvalidParams:    "Wrong or invalid parameters",
	Unauthorized:     "Resource need to be authorized",
	ForbiddenOper:    "No right to access",
	NotFoundResource: "Resource not found",
	ServerUnknown:    "Server has unexpeted error",
	DBInsErr:         "DB Insert operation error",
	DBGetErr:         "DB Get operation error",
	DBUpdErr:         "DB Update operation error",
	DBDelErr:         "DB Delete operation error",
}

var msgMapZHTW =map[int]string{
	InvalidParams:    "錯誤或無效的參數",
	Unauthorized:     "該項資源需要被驗證",
	ForbiddenOper:    "無權存取該資源",
	NotFoundResource: "該資源已不存在",
	ServerUnknown:    "後台未知錯誤",
	DBInsErr:         "資料庫插入錯誤",
	DBGetErr:         "資料庫存取錯誤",
	DBUpdErr:         "資料庫更新錯誤",
	DBDelErr:         "資料庫刪除錯誤",
}