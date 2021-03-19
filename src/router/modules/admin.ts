
import adminLayout from '@/views/layout/layout-admin.vue'
import home from '@/views/admin/home/index.vue'
import menuManagement from '@/views/admin/accredit/accreditMenu/index.vue'
import roleManagement from '@/views/admin/accredit/accreditRole/index.vue'
import departmentPerson from '@/views/admin/departmentPerson/index.vue'
import customdataDic from '@/views/admin/dataDictionary/customdataDic/index.vue'
import roledataDic from '@/views/admin/dataDictionary/roledataDic/index.vue'
import personPositionDic from '@/views/admin/dataDictionary/personPositionDic/index.vue'
import platTypeDic from '@/views/admin/dataDictionary/platTypeDic/index.vue'
const adminMoudule = function (meta = {}) {
  return {
    path: '/admin',
    name: 'admin',
    component: adminLayout,
    redirect: {
      name: 'adminHome'
    },
    meta: {
      requireAuth: true,
      ...meta
    }
  }
}
export default [
  {
    ...adminMoudule({}),
    children: [
      {
        path: 'adminHome',
        name: 'adminHome',
        component: home,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'menuManagement',
        name: 'menuManagement',
        component: menuManagement,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'roleManagement',
        name: 'roleManagement',
        component: roleManagement,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'departmentPerson',
        name: 'departmentPerson',
        component: departmentPerson,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'customdataDic',
        name: 'customdataDic',
        component: customdataDic,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'roledataDic',
        name: 'roledataDic',
        component: roledataDic,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'personPositionDic',
        name: 'personPositionDic',
        component: personPositionDic,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'platTypeDic',
        name: 'platTypeDic',
        component: platTypeDic,
        meta: {
          requireAuth: true
        }
      }
    ]
  }
]
