import request from '@/utils/request'
//获取保险公司table数据
export function getInsuranceList(params){
  return request({
    url:'/admin/getInsuranceList',
    method:'get',
    params
  })
}

/*查询所有的保险公司--莫凡*/
export function insuranceList(params) {
  return request({
    url:'/admin/getInsuranceList',
    method:'get',
    params
  })
}

/*保险公司管理初始化*/
export function insuranceData(params){
  return request({
    url:'/admin/getInsuranceInit',
    method:'get',
    params
  })
}
//修改保险公司信息
export function updateInsurance(data){
  return request({
    url:'/admin/updateInsurance',
    method:'put',
    data,
    headers:{
      'Content-Type':'application/json;charset=UTF-8'
    }
  })
}
//新增保险公司信息
export function saveInsurance(data){
  return request({
    url:'/admin/saveInsurance',
    method:'post',
    data
  })
}

//获取保险公司条款
export function getProductTermsList(params){
  return request({
    url:'/admin/getProductTermsList',
    method:'get',
    params
  })
}
//修改保险公司条款
export function updateTerms(data){
  return request({
    url:'/admin/updateTerms',
    method:'put',
    data
  })
}
//添加保险公司条款
export function saveTerms(data){
  return request({
    url:'/admin/saveTerms',
    method:'post',
    data
  })
}
//删除保险公司条款
export function deleteTerms(params){
  return request({
    url:'/admin/deleteTerms',
    method:'delete',
    params
  })
}
