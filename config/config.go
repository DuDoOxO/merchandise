package config

import (
	"path"
	"path/filepath"
	"runtime"
)

// global
var (
	// skip 0 :self
	_, b, _, _ = runtime.Caller(0)
	basePath   = filepath.Dir(b)
)

func GetAppBasePath() string {
	d := path.Join(basePath)
	return filepath.Dir(d)
}
