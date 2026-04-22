import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { routeSeo, siteConfig } from '../data/site'
import { getScrollBehavior } from '../utils/motion'
import { applySeo } from '../utils/seo'

const HomeView = () => import('../views/HomeView.vue')
const ProjectsView = () => import('../views/ProjectsView.vue')
const ProjectDetailView = () => import('../views/ProjectDetailView.vue')
const AboutView = () => import('../views/AboutView.vue')
const ContactView = () => import('../views/ContactView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: routeSeo.home,
  },
  {
    path: '/projetos',
    name: 'projects',
    component: ProjectsView,
    meta: routeSeo.projects,
  },
  {
    path: '/projetos/:slug',
    name: 'project-detail',
    component: ProjectDetailView,
    meta: routeSeo.projectDetail,
  },
  {
    path: '/sobre',
    name: 'about',
    component: AboutView,
    meta: routeSeo.about,
  },
  {
    path: '/contato',
    name: 'contact',
    component: ContactView,
    meta: routeSeo.contact,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: routeSeo.notFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { top: 0, behavior: getScrollBehavior() }
  },
})

router.afterEach((to) => {
  applySeo({
    title: String(to.meta.title ?? siteConfig.defaultTitle),
    description: String(to.meta.description ?? siteConfig.defaultDescription),
    path: to.path,
  })
})

export default router
