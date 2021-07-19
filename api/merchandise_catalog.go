package api

import (
	"merchandise/api/request"
	"merchandise/api/response"
	"merchandise/internal/merchandise_catalog/repository"
	"merchandise/models"
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
	req := &request.MerchandiseCatalog{}
	err := ctx.BodyParser(req)
	if err != nil {
		return errs.NewAppError(errs.InvalidParams, err)
	}

	cRep := repository.NewCatalog(env.orm)
	rs, err := cRep.AddCatalog(&models.MerchandiseCatalog{
		Name: req.Name,
	})
	if err != nil {
		return errs.NewAppError(errs.DBInsErr, err)
	}

	res := &response.MerchandiseCatalog{
		Id:        rs.Id,
		Name:      rs.Name,
		Hidden:    rs.Hidden,
		CreatedAt: rs.CreatedAt,
		UpdatedAt: rs.UpdatedAt,
	}

	_ = ctx.JSON(res)
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
		return errs.NewAppError(errs.InvalidParams, err)
	}

	cRep := repository.NewCatalog(env.orm)
	err = cRep.DelCatalog(id)
	if err != nil {
		return errs.NewAppError(errs.DBDelErr, err)
	}

	_ = ctx.JSON(nil)
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
		return errs.NewAppError(errs.InvalidParams, err)
	}

	// parse request body
	req := &request.MerchandiseCatalogUpdate{}
	err = ctx.BodyParser(req)
	if err != nil {
		return errs.NewAppError(errs.InvalidParams, err)
	}

	mc := &models.MerchandiseCatalog{
		Name:   req.Name,
		Hidden: req.Hidden,
	}

	cRep := repository.NewCatalog(env.orm)
	err = cRep.UpdCatalog(id, mc)
	if err != nil {
		return errs.NewAppError(errs.DBUpdErr, err)
	}

	_ = ctx.JSON(nil)
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
		return errs.NewAppError(errs.InvalidParams, err)
	}

	cRep := repository.NewCatalog(env.orm)
	pgs, err := cRep.FindCatalog(page)
	if err != nil {
		return errs.NewAppError(errs.DBGetErr, err)
	}

	_ = ctx.JSON(pgs)
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
		return errs.NewAppError(errs.InvalidParams, err)
	}

	cRep := repository.NewCatalog(env.orm)
	ca, err := cRep.GetCatalog(id)
	if err != nil {
		return errs.NewAppError(errs.DBGetErr, err)
	}

	if ca == nil {
		return errs.NewAppError(errs.NotFoundResource, err)
	}

	res := &response.MerchandiseCatalog{
		Id:        ca.Id,
		Name:      ca.Name,
		Hidden:    ca.Hidden,
		CreatedAt: ca.CreatedAt,
		UpdatedAt: ca.UpdatedAt,
	}
	_ = ctx.JSON(res)
	return err
}
