import request from '@/utils/request'
//获取投保项列表
export function getInsuranceItemList(params){
  return request({
    url:'/admin/getInsuranceItemList',
    method:'get',
    params
  })
}
//根据投保项名称获取投保项
export function getInsuranceItemByName(params){
  return request({
    url:'/admin/getInsuranceItemByName',
    method:'get',
    params
  })
}
//添加投保项
export function addInsuranceItem(data){
  return request({
    url:'/admin/addInsuranceItem',
    method:'post',
    data
  })
}
//修改投保项
export function updateInsuranceItem(data){
  return request({
    url:'/admin/updateInsuranceItem',
    method:'put',
    data
  })
}
//校验投保项是否存在
export function checkInsuranceItemName(params){
  return request({
    url:'/admin/checkInsuranceItemName',
    method:'post',
    params
  })
}
// 校验投保项key是否存在
export function checkParamKey(params){
  return request({
    url:'/admin/checkParamKey',
    method:'post',
    params
  })
}
//参数配置-保单参数-子项列表
export function getDictList(params){
  return request({
    url:'/admin/getDictList',
    method:'get',
    params
  })
}
//参数配置-保单参数-子项添加
export function addOrderOptionDict(data){
  return request({
    url:'/admin/addOrderOptionDict',
    method:'post',
    data
  })
}

// 参数配置-保单参数-子项修改
export function updateOrderOptionDict(data){
  return request({
    url:'/admin/updateOrderOptionDict',
    method:'put',
    data
  })
}


