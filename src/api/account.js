import request from '@/utils/request'

//根据条件查询所有系统用户信息
export function findSystemUserPagination(params){
  return request({
    url:'/admin/system/user/findSystemUserPagination',
    method:'get',
    params
  })
}

//启用禁用账户
export function isEnable(params){
  return request({
    url:'/admin/system/user/isEnable',
    method:'post',
    params
  })
}

//重置密码
export function resetPassword(params) {
  return request({
    url:'/admin/system/user/resetPassword',
    method:'post',
    params
  })
}

//根据账户ID逻辑删除账户信息
export function logicDelete(params) {
  return request({
    url:'/admin/system/user/logicDelete',
    method:'delete',
    params
  })
}

// 新增管理员
export function insert(data) {
  return request({
    url:'/admin/system/user/insert',
    method:'post',
    data
  })
}

// 新增管理员
export function update(data) {
  return request({
    url:'/admin/system/user/update',
    method:'post',
    data
  })
}

// 查询所有角色
export function findSysRoleAll(params) {
  return request({
    url:'/admin/system/role/findSysRoleAll',
    method:'get',
    params
  })
}

//根据条件查询所有系统角色
export function findSystemRolePagination(params) {
  return request({
    url:'/admin/system/role/findSystemRolePagination',
    method:'get',
    params
  })
}

//删除角色
export function roleDelete(params) {
  return request({
    url:'/admin/system/role/delete',
    method:'delete',
    params
  })
}

//修改角色
export function roleUpdate(data) {
  return request({
    url:'/admin/system/role/update',
    method:'post',
    data
  })
}

//新增角色
export function roleInsert(data) {
  return request({
    url:'/admin/system/role/insert',
    method:'post',
    data
  })
}

//新增角色
export function roleCheck(params) {
  return request({
    url:'/admin/system/role/checkRole',
    method:'post',
    params
  })
}

//根据条件查询所有系统角色
export function getTreeMenuData(params) {
  return request({
    url:'/admin/system/resource/getTreeMenuData',
    method:'get',
    params
  })
}

//更新角色所对应的资源
export function updateResource(data) {
  return request({
    url:'/admin/system/roleResource/updateResource',
    method:'post',
    data
  })
}

//根据ID查询资源信息
export function findSysResourceById(params) {
  return request({
    url:'/admin/system/resource/findSysResourceById',
    method:'get',
    params
  })
}

// 新增资源菜单
export function resourceInsert(data) {
  return request({
    url:'/admin/system/resource/insert',
    method:'post',
    data
  })
}

//修改资源菜单
export function resourceUpdate(data) {
  return request({
    url:'/admin/system/resource/update',
    method:'post',
    data
  })
}

//删除资源菜单
export function resourceDelete(params) {
  return request({
    url:'/admin/system/resource/delete',
    method:'delete',
    params
  })
}

//修改密码
export function updatePassword(params) {
  return request({
    url:'/admin/system/user/updatePassword',
    method:'post',
    params
  })
}


