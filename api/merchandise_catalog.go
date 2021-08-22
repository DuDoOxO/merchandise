package api

import (
	"merchandise/api/request"
	"merchandise/internal/merchandise_catalog/repository"
	"merchandise/internal/merchandise_catalog/service"
	"merchandise/pkg/errs"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// @Summary Add merchandise catalog
// @Produce json
// @Accept json
// @Tags Merchandise Catalog
// @Param catalog body request.MerchandiseCatalog true "Catalog"
// @Success 200 {object} response.MerchandiseCatalog
// @Failure 400 {object} errs.AppErrorMsg "{"code":400,"msg":"Wrong parameter format or invalid"}"
// @Failure 403 {object} errs.AppErrorMsg "{"code":403,"msg":"Forbidden operation"}"
// @Failure 404 {object} errs.AppErrorMsg "{"code":404","msg":"No match catalog"}"
// @Failure 500 {object} errs.AppErrorMsg "{"code":500,"msg":"Database operation error"}"
// @Router /v1/merchandise-catalog [post]
func AddMerchandiseCatalog(ctx *fiber.Ctx) error {
	var err error
	req := &request.MerchandiseCatalog{}
	err = ctx.BodyParser(req)
	if err != nil {
		return errs.NewAppError(400, errs.InvalidParams, "", err)
	}

	cRep := repository.NewCatalog(env.orm)
	cSrv := service.NewCatalogSrv(cRep)
	err = cSrv.AddCatalog(req)
	if err != nil {
		return err
	}

	output := map[string]interface{}{}
	_ = ctx.JSON(output)
	return err
}

// @Summary Delete merchandise catalog
// @Produce json
// @Accept json
// @Tags Merchandise Catalog
// @Param id path string true "Catalog id"
// @Success 200
// @Failure 400 {object} errs.AppErrorMsg "{"code":400,"msg":"Wrong parameter format or invalid"}"
// @Failure 403 {object} errs.AppErrorMsg "{"code":403,"msg":"Forbidden operation"}"
// @Failure 404 {object} errs.AppErrorMsg "{"code":404","msg":"No match catalog"}"
// @Failure 500 {object} errs.AppErrorMsg "{"code":500,"msg":"Database operation error"}"
// @Router /v1/merchandise-catalog/{id} [delete]
func DelMerchandiseCatalog(ctx *fiber.Ctx) error {
	var err error
	idStr := ctx.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return errs.NewAppError(400, errs.InvalidParams, "", err)
	}

	cRep := repository.NewCatalog(env.orm)
	cSrv := service.NewCatalogSrv(cRep)
	if err = cSrv.DelCatalog(id); err != nil {
		return err
	}

	output := map[string]interface{}{}
	_ = ctx.JSON(output)
	return err

}

// @Summary Update merchandise catalog
// @Produce json
// @Accept json
// @Tags Merchandise Catalog
// @Param id path string true "Catalog id"
// @Param catalog body request.MerchandiseCatalogUpdate true "Catalog"
// @Success 200
// @Failure 400 {object} errs.AppErrorMsg "{"code":400,"msg":"Wrong parameter format or invalid"}"
// @Failure 403 {object} errs.AppErrorMsg "{"code":403,"msg":"Forbidden operation"}"
// @Failure 404 {object} errs.AppErrorMsg "{"code":404","msg":"No match catalog"}"
// @Failure 500 {object} errs.AppErrorMsg "{"code":500,"msg":"Database operation error"}"
// @Router /v1/merchandise-catalog/{id} [put]
func UpdMerchandiseCatalog(ctx *fiber.Ctx) error {
	var err error

	// parse catalog id
	idStr := ctx.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return errs.NewAppError(400, errs.InvalidParams, "", err)
	}

	// parse request body
	req := &request.MerchandiseCatalogUpdate{}
	err = ctx.BodyParser(req)
	if err != nil {
		return errs.NewAppError(400, errs.InvalidParams, "", err)
	}

	cRep := repository.NewCatalog(env.orm)
	cSrv := service.NewCatalogSrv(cRep)
	if err = cSrv.UpdCatalog(id, req); err != nil {
		return err
	}

	output := map[string]interface{}{}
	_ = ctx.JSON(output)
	return err
}

// @Summary List merchandise catalog
// @Produce json
// @Accept json
// @Tags Merchandise Catalog
// @Param page path string true "page number"
// @Success 200 {array} response.MerchandiseCatalog
// @Failure 400 {object} errs.AppErrorMsg "{"code":400,"msg":"Wrong parameter format or invalid"}"
// @Failure 403 {object} errs.AppErrorMsg "{"code":403,"msg":"Forbidden operation"}"
// @Failure 404 {object} errs.AppErrorMsg "{"code":404","msg":"No match catalog"}"
// @Failure 500 {object} errs.AppErrorMsg "{"code":500,"msg":"Database operation error"}"
// @Router /v1/merchandise-catalog-list/{page} [get]
func FindMerchandiseCatalog(ctx *fiber.Ctx) error {
	var err error

	// parse page number
	pageStr := ctx.Params("page")
	page, err := strconv.ParseInt(pageStr, 10, 64)
	if err != nil {
		return errs.NewAppError(400, errs.InvalidParams, "", err)
	}

	cRep := repository.NewCatalog(env.orm)
	cSrv := service.NewCatalogSrv(cRep)
	res, err := cSrv.FindCatalog(page)
	if err != nil {
		return err
	}

	_ = ctx.JSON(res)
	return err

}

// @Summary Get merchandise catalog
// @Produce json
// @Accept json
// @Tags Merchandise Catalog
// @Param id path string true "Catalog id"
// @Success 200 {object} response.MerchandiseCatalog
// @Failure 400 {object} errs.AppErrorMsg "{"code":400,"msg":"Wrong parameter format or invalid"}"
// @Failure 403 {object} errs.AppErrorMsg "{"code":403,"msg":"Forbidden operation"}"
// @Failure 404 {object} errs.AppErrorMsg "{"code":404","msg":"No match catalog"}"
// @Failure 500 {object} errs.AppErrorMsg "{"code":500,"msg":"Database operation error"}"
// @Router /v1/merchandise-catalog/{id} [get]
func GetMerchandiseCatalog(ctx *fiber.Ctx) error {
	var err error
	// parse catalog id
	idStr := ctx.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return errs.NewAppError(400, errs.InvalidParams, "", err)
	}

	cRep := repository.NewCatalog(env.orm)
	cSrv := service.NewCatalogSrv(cRep)
	mc, err := cSrv.GetCatalog(id)
	if err != nil {
		return err
	}

	_ = ctx.JSON(mc)
	return err
}
