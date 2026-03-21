import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Register from '../views/Register.vue'
import Analyzes from '../views/Analyzes.vue'
import Panels from '../views/Panels.vue'
import Orders from '../views/Orders.vue'
import Patients from '../views/Patients.vue'
import Profile from '../views/Profile.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import OrderResults from '../views/OrderResults.vue'
import ResultsSearch from '../views/ResultsSearch.vue'
import About from '../views/About.vue'
import PrivacyPolicy from '../views/PrivacyPolicy.vue'
import Vacancies from '../views/Vacancies.vue'
import AboutProject from '../views/AboutProject.vue'


const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/analyzes', name: 'Analyzes', component: Analyzes },
  { path: '/panels', name: 'Panels', component: Panels },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/patients', name: 'Patients', component: Patients },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/orders/:id/results', name: 'OrderResults', component: OrderResults },
  { path: '/results-search', name: 'ResultsSearch', component: ResultsSearch },
  { path: '/about', name: 'About', component: About },
  { path: '/terms', name: 'PrivacyPolicy', component: PrivacyPolicy },
  { path: '/vacancies', name: 'Vacancies', component: Vacancies },
  { path: '/about-project', name: 'AboutProject', component: AboutProject }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
