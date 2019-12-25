import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/product-administration/index-product',
    children: [{
      path: 'index-product',
      name: 'Index-product',
      component: () => import('@/views/product-administration/index'),
      meta: { title: '产品管理', icon: 'dashboard' }
    }]
  },
  {
    path: '/product-administration',
    component: Layout,
    redirect: '/product-administration/index-product',
    name: 'ProductAdministration',
    meta: { title: '产品管理', icon: 'example' },
    children: [{
        path: 'index-product',
        name: 'Index-product',
        redirect: '/product-administration/index-product/index-product',
        component: () => import('@/views/product-administration/index'),
        meta: { title: '产品管理', icon: 'example'},
        children:[{
          path: 'index-product',
          name: 'Index-product',
          component: () => import('@/views/product-administration/index-product/index'),
          meta: { title: '产品列表', icon: 'table' , activeMenu: '/product-administration/index-product/index-product'},
          hidden: true
        },{
          path: 'add-product/:id(\\d+)',
          name: 'Addproduct',
          component: () => import('@/views/product-administration/add-product/index'),
          meta: { title: '新增产品', icon: 'table' , activeMenu: '/product-administration/index-product/index-product'},
          hidden: true
        },{
          path: 'index-plan/:id(\\d+)',
          component: () => import('@/views/product-administration/plan/index-plan/index'),
          name: 'AddPlan',
          meta: { title: '计划',activeMenu: '/product-administration/index-product/index-product' },
          hidden: true
        },{
            path: 'add-plan',
            component: () => import('@/views/product-administration/plan/add-plan/index'),
            name: 'AddPlan',
            meta: { title: '新增计划', activeMenu: '/product-administration/index-product/index-product'},
            hidden: true
        },{
            path: 'rate',
            name: 'Rate',
            component: () => import('@/views/product-administration/plan/rate/index'),
            meta: { title: '费率' , activeMenu: '/product-administration/index-product/index-product'},
            hidden: true
        },{
            path: 'trial-panel/:id(\\d+)',
            name: 'TrialPanel',
            component: () => import('@/views/product-administration/plan/trial-panel/index'),
            meta: { title: '试算面板' , activeMenu: '/product-administration/index-product/index-product'},
            hidden: true
        },{
          path: 'policy',
          component: () => import('@/views/product-administration/plan/policy/parameters/index'),
          name: 'Policy',
          meta: { title: '保单参数配置' , activeMenu: '/product-administration/index-product/index-product'},
          hidden: true,
        },{
          path: 'policy-children/:id(\\d+)',
          component: () => import('@/views/product-administration/plan/policy/parameter-child/index'),
          name: 'PolicyChildren',
          meta: { title: '保单项参数配置' , activeMenu: '/product-administration/index-product/index-product '},
          hidden:true
        }]
      },{
        path: 'classify',
        name: 'Classify',
        redirect: '/product-administration/classify/classify-one',
        component: () => import('@/views/classification-administration/classification-view/index'),
        meta: { title: '分类管理',icon: 'table'},
        children:[{
          path: 'classify-one',
          name: 'ClassifyOne',
          component: () => import('@/views/classification-administration/classification-view/classification-one/index'),
          meta: { title: '分类管理',activeMenu:'/product-administration/classify/classify-one'},
          hidden:true
        },{
          path: 'classify-two',
          name: 'ClassifyTwo',
          component: () => import('@/views/classification-administration/classification-view/classification-two/index'),
          meta: { title: '二级分类',activeMenu:'/product-administration/classify/classify-one'},
          hidden: true
        }]
      },{
        path: 'insurance',
        component: () => import('@/views/insurance-administration/index'),
        redirect: '/product-administration/insurance/insurance',
        name: '',
        meta: { title: '保险公司管理', icon: 'example'},
        children:[{
          path: 'insurance',
          component: () => import('@/views/insurance-administration/insurance/index'),
          name: 'Insurance',
          meta: { title: '保险公司管理',activeMenu:'/product-administration/insurance/insurance'},
          hidden:true

        },{
          path: 'clause',
          name: 'Clause',
          component: () => import('@/views/insurance-administration/clause/index'),
          meta: { title: '保险公司条款', activeMenu: '/product-administration/insurance/insurance'},
          hidden: true
        }]
      }

    ]
  },
  {
    path: '/expense',
    component: Layout,
    redirect: '/expense/outpoint/outpoint',
    meta: { title: '费用管理', icon: 'user' },
    children: [{
      path: 'outpoint',
      name: 'Outpoint',
      redirect: '/expense/outpoint/outpoint',
      component: () => import('@/views/expense-management/out-point/second'),
      meta: { title: '外放点位配置', icon: 'user'},
      children:[{
        path: 'outpoint',
        name: 'Outpoint',
        component: () => import('@/views/expense-management/out-point/index'),
        meta: { title: '外放点位配置', icon: 'user',activeMenu: '/expense/outpoint/outpoint'},
      },{
        path: 'long/:id(\\d+)',
        name: 'Long',
        component: () => import('@/views/expense-management/out-point/long-point/index'),
        meta: { title: '点位配置（长险）',activeMenu: '/expense/outpoint/outpoint'},
        hidden:true
      },{
        path: 'short/:id(\\d+)',
        name: 'Short',
        component: () => import('@/views/expense-management/out-point/short-point/index'),
        meta: { title: '点位配置（短险）',activeMenu: '/expense/outpoint/outpoint'},
        hidden:true
      }]
    }]
  },
  {
    path: '/configuration',
    component: Layout,
    redirect: '/configuration/panel',
    meta: { title: '参数配置', icon: 'user' },
    children: [{
      path: 'panel',
      name: 'Panel',
      component: () => import('@/views/parameter-configuration/panel/index'),
      meta: { title: '试算面板参数', icon: 'user' }
    },{
      path: 'policy',
      name: 'Policy',
      redirect: '/configuration/policy/policy',
      component: () => import('@/views/parameter-configuration/policy/index'),
      meta: { title: '保单参数', icon: 'user' },
      children:[{
        path: 'policy',
        name: 'Policy',
        component: () => import('@/views/parameter-configuration/policy/policy-index/index'),
        meta: { title: '保单参数'}
      },{
        path: 'item/:id(\\d+)',
        name: 'Item',
        component: () => import('@/views/parameter-configuration/policy/item-management/index'),
        meta: { title: '子项管理',activeMenu:'/configuration/policy/policy'},
        hidden: true
      }]
    }]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/account',
    meta: { title: '账号设置', icon: 'user' },
    children: [{
      path: 'account',
      name: 'Account',
      component: () => import('@/views/account-management/account/index'),
      meta: { title: '账号管理', icon: 'user' }
    },{
      path: 'role',
      name: 'Role',
      component: () => import('@/views/account-management/role/index'),
      meta: { title: '角色管理', icon: 'user' }
    },{
      path: 'menu',
      name: 'Menu',
      component: () => import('@/views/account-management/menu/index'),
      meta: { title: '菜单管理', icon: 'user' }
    },{
      path: 'changePassword',
      component: () => import('@/views/login/changePassword/index'),
      hidden: true
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher // reset router
}

export default router
