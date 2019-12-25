import request from '@/utils/request'
//分类管理分页列表
export function getProductClassList(params){
  return request({
    url:'/admin/getProductClassList',
    method:'get',
    params
  })
}
//修改保险分类
export function updateProductClass(data){
  return request({
    url:'/admin/updateProductClass',
    method:'put',
    data
  })
}
//添加保险分类
export function saveProductClass(data){
  return request({
    url:'/admin/saveProductClass',
    method:'post',
    data
  })
}
