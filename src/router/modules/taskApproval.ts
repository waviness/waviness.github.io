import crmLayout from '@/views/layout/layout-crm.vue'
import crmReminder from '@/views/taskApproval/crmReminder/index.vue'
import crmAgent from '@/views/taskApproval/crmAgent/index.vue'
const taskApproval = function (meta = {}) {
  return {
    path: '/taskApproval',
    name: 'taskApproval',
    component: crmLayout,
    redirect: {
      name: 'crmReminder'
    },
    meta: {
      requireAuth: true,
      ...meta
    }
  }
}
export default [
  {
    ...taskApproval({
      keepAlive: true
    }),
    children: [
      {
        path: 'crmReminder',
        name: 'crmReminder',
        component: crmReminder,
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'crmAgent',
        name: 'crmAgent',
        component: crmAgent,
        meta: {
          requireAuth: true
        }
      }
    ]
  }
]
