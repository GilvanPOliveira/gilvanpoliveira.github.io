import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'

const routes: RouteRecordRaw[] = [
  { 
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Portfólio | Home' },
  },
  {
    path: '/projetos',
    name: 'projects',
    component: ProjectsView,
    meta: { title: 'Portfólio | Projetos' },
  },
  {
    path: '/projetos/:slug',
    name: 'project-detail',
    component: ProjectDetailView,
    meta: { title: 'Portfólio | Projeto' },
  },
  {
    path: '/sobre',
    name: 'about',
    component: AboutView,
    meta: { title: 'Portfólio | Sobre' },
  },
  {
    path: '/contato',
    name: 'contact',
    component: ContactView,
    meta: { title: 'Portfólio | Contato' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  document.title = String(to.meta.title ?? 'Portfólio')
})

export default router
