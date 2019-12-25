import request from '@/utils/request'
//条件查询外放点位列表
export function getOutPointListByCondition(params){
  return request({
    url:'/admin/getOutPointListByCondition',
    method:'get',
    params
  })
}

//根据方案id获取外放点位
export function getOutPointByPlanIdAndType(params){
  return request({
    url:'/admin/getOutPointByPlanIdAndType',
    method:'get',
    params
  })
}

//添加/编辑 外放点位
export function setOutPoint(data){
  return request({
    url:'/admin/setOutPoint',
    method:'post',
    data
  })
}

//删除外放点位

export function deleteOutPointById(params){
  return request({
    url:'/admin/deleteOutPointById',
    method:'get',
    params
  })
}
