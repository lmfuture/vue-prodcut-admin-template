import request from '@/utils/request'

/*获取所有保险公司*/
export function getCompany(params) {
  return request({
    url: '/admin/getCompany',
    method: 'get',
    params
  })
}

/*查询所有一类产品--莫凡*/
export function getFirstClass(params) {
  return request({
    url: '/admin/getFirstClass',
    method: 'get',
    params
  })
}

/*查询所有二类产品--莫凡*/
export function getSecondClass(params) {
  return request({
    url: '/admin/getSecondClass',
    method: 'get',
    params
  })
}

/*多条件查询产品列表*/

export function getProductByConditions(params) {
  return request({
    url: '/admin/getProductByConditions',
    method: 'get',
    params
  })
}


/*新增产品*/
export function addProduct(data) {
  return request({
    url: '/admin/addProduct',
    method: 'post',
    data
  })
}

/*查询产品信息*/
export function getProductById(params) {
  return request({
    url: '/admin/getProductById',
    method: 'get',
    params
  })
}

/*新增图片信息*/
export function addPhotoInfo(data) {
  return request({
    url: '/admin/addPhotoInfo',
    method: 'post',
    data
  })
}

/*新增投保须知*/
export function addInsuranceNotes(data) {
  return request({
    url: '/admin/addInsuranceNotes',
    method: 'post',
    data
  })
}

/*新增健康告知*/
export function addHealthNotice(data) {
  return request({
    url: '/admin/addHealthNotice',
    method: 'post',
    data
  })
}

/*新增用户拥有的权利*/
export function addPowerInfo(data) {
  return request({
    url: '/admin/addPowerInfo',
    method: 'post',
    data
  })
}

/*查询常见问题列表getCommonProblem*/
export function getCommonProblem(params) {
  return request({
    url: '/admin/getCommonProblem',
    method: 'get',
    params
  })
}

/*增加常见问题 addCommonProblem*/
export function addCommonProblem(data) {
  return request({
    url: '/admin/addCommonProblem',
    method: 'post',
    data
  })
}

/*修改常见问题 updateCommonProblem*/
export function updateCommonProblem(data) {
  return request({
    url: '/admin/addCommonProblem',
    method: 'post',
    data
  })
}

//删除常见问题
export function deleteCommonProblem(params) {
  return request({
    url: '/admin/deleteCommonProblem',
    method: 'delete',
    params
  })
}

/*修改常见问题状态 updateCommonProblemByStatus*/
export function updateCommonProblemByStatus(data) {
  return request({
    url: '/admin/addCommonProblem?id=' + data.id + '&status=' + data.status,
    method: 'post',
    data
  })
}

/*查询客户须知列表getCustomerInformation*/
export function getCustomerInformation(params) {
  return request({
    url: '/admin/getCustomerInformation',
    method: 'get',
    params
  })
}

/*删除客户须知列表deleteCustomerInformation*/
export function deleteCustomerInformation(params) {
  return request({
    url: '/admin/deleteCustomerInformation',
    method: 'delete',
    params
  })
}

/*新增或修改客户须知列表addCustomerInformation*/
export function addCustomerInformation(data) {
  return request({
    url: '/admin/addCustomerInformation',
    method: 'post',
    data
  })
}


/*查询保险公司所有条款getTermsByType*/
export function getTermsByType(params) {
  return request({
    url: '/admin/getTermsByType',
    method: 'get',
    params
  })
}

//----------------------------------------------
// 产品计划-保单参数-配置分组列表
export function getPlanDictGroupList(params) {
  return request({
    url: '/admin/getPlanDictGroupList',
    method: 'get',
    params
  })
}

// 产品计划-保单参数-配置分组删除--陈业
export function deletePlanDictGroup(params) {
  return request({
    url: '/admin/deletePlanDictGroup',
    method: 'delete',
    params
  })
}

//产品计划-保单参数-配置分组添加
export function addPlanDictGroup(data) {
  return request({
    url: '/admin/addPlanDictGroup',
    method: 'post',
    data
  })
}

//产品计划-保单参数-配置分组修改
export function updatePlanDictGroup(data) {
  return request({
    url: '/admin/updatePlanDictGroup',
    method: 'put',
    data
  })
}

//产品计划-保单参数-配置子项列表
export function getPlanDictOptionList(params) {
  return request({
    url: '/admin/getPlanDictOptionList',
    method: 'get',
    params
  })
}

//产品计划-保单参数-子项管理-参数下拉框
export function getOptionSelect(params) {
  return request({
    url: '/admin/getOptionSelect',
    method: 'get',
    params
  })
}

// 产品计划-保单参数-配置子项删除
export function deletePlanDictOption(params) {
  return request({
    url: '/admin/deletePlanDictOption',
    method: 'delete',
    params
  })
}

// 产品计划-保单参数-配置子项添加
export function addPlanDictOption(data) {
  return request({
    url: '/admin/addPlanDictOption',
    method: 'post',
    data
  })
}

// 产品计划-保单参数-配置子项修改
export function updatePlanDictOption(data) {
  return request({
    url: '/admin/updatePlanDictOption',
    method: 'put',
    data
  })
}

//根据条件查询产品计划列表
export function getProductPlanByConditions(params) {
  return request({
    url: '/admin/getProductPlanByConditions',
    method: 'get',
    params
  })
}

//新增产品计划
export function addProductPlan(data) {
  return request({
    url: '/admin/addProductPlan',
    method: 'post',
    data
  })
}

//修改产品计划状态
export function updateProductPlanStatus(params) {
  return request({
    url: '/admin/updateProductPlanStatus',
    method: 'put',
    params
  })
}

//根据产品计划ID获取信息
export function getProductPlanById(params) {
  return request({
    url: '/admin/getProductPlanById',
    method: 'get',
    params
  })
}

//根据产品计划ID获取信息
export function getProductOptionById(params) {
  return request({
    url: '/admin/getProductOptionById',
    method: 'get',
    params
  })
}

// 增加/修改试算面板
export function addProductOption(data) {
  return request({
    url: '/admin/addProductOption',
    method: 'post',
    data
  })
}

// 删除试算面板
export function deleteProductOptionById(params) {
  return request({
    url: '/admin/deleteProductOptionById',
    method: 'delete',
    params
  })
}

