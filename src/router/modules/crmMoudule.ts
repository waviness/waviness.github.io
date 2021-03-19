
import crmLayout from '@/views/layout/layout-crm.vue'
import home from '@/views/crm/home/index.vue'
import reportingPlan from '@/views/crm/reportingPlan/index.vue'
import customerBasic from '@/views/crm/customerBasic/index.vue'
import customerFollow from '@/views/crm/customerFollow/index.vue'
import schedule from '@/views/crm/schedule/index.vue'
import weekly from '@/views/crm/weekly/index.vue'
import customerUnit from '@/views/crm/customerUnit/index.vue'
import customerPersonnel from '@/views/crm/customerPersonnel/index.vue'
import customerNonSystem from '@/views/crm/customerNonSystem/index.vue'
import governmentAssociation from '@/views/crm/governmentAssociation/index.vue'
import redShield from '@/views/crm/redShield/index.vue'
const crmMoudule = function (meta = {}) {
  return {
    path: '/crm',
    name: 'crm',
    component: crmLayout,
    redirect: {
      name: 'crmHome'
    },
    meta: {
      requireAuth: true,
      ...meta
    }
  }
}
export default [
  {
    ...crmMoudule({}),
    children: [
      {
        path: 'crmHome',
        name: 'crmHome',
        component: home,
        meta: {
          requireAuth: true
        }
        // meta: {
        //   title: '逾期预警',
        //   requireAuth: true,
        //   keepAlive: true // 需要被缓存
        // }
      },
      {
        path: 'reportingPlan',
        name: 'reportingPlan',
        component: reportingPlan,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'customerBasic',
        name: 'customerBasic',
        component: customerBasic,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'customerFollow',
        name: 'customerFollow',
        component: customerFollow,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'schedule',
        name: 'schedule',
        component: schedule,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'weekly',
        name: 'weekly',
        component: weekly,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'customerUnit',
        name: 'customerUnit',
        component: customerUnit,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'customerPersonnel',
        name: 'customerPersonnel',
        component: customerPersonnel,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'customerNonSystem',
        name: 'customerNonSystem',
        component: customerNonSystem,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'governmentAssociation',
        name: 'governmentAssociation',
        component: governmentAssociation,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'redShield',
        name: 'redShield',
        component: redShield,
        meta: {
          requireAuth: true
        }
      }
    ]
  }
]
