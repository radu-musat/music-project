import { createRouter, createWebHistory } from 'vue-router';
// import Home from '@/views/Home.vue';
// import About from '@/views/About.vue';
// import Manage from '@/views/Manage.vue';
// import Song from '@/views/Song.vue';
import store from '@/store';

const Home = () => import('@/views/Home.vue');
const Manage = () => import(/* webpackChunkName:  "groupedChunk" */ '@/views/Manage.vue');
const Song = () => import(/* webpackChunkName:  "groupedChunk" */ '@/views/Song.vue');
const About = () => import('@/views/About.vue');

const routes = [
	{
		name: 'home',
		path: '/',
		component: Home,
	},
	{
		name: 'about',
		path: '/about',
		component: About,
	},
	{
		name: 'manage',
		// alias: '/manage',
		path: '/manage-music',
		meta: {
			requiresAuth: true,
		},
		component: Manage,
		beforeEnter: (to, from, next) => {
			console.log('Manage Route Guard');
			next();
		},
	},
	{ // redirect to the above
		path: '/manage',
		redirect: { name: 'manage' },
	},
	{
		name: 'song',
		path: '/song/:id',
		component: Song,
	},
	{
		path: '/:catchAll(.*)*',
		redirect: { name: 'home' },
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
	linkExactActiveClass: 'text-yellow-500',
});

// global guard
router.beforeEach((to, from, next) => {
	// console.log('global guard');

	if (!to.matched.some((record) => record.meta.requiresAuth)) {
		next();
		return;
	}

	if (store.state.userLoggedIn) {
		next();
	} else {
		next({ name: 'home' });
	}
});

export default router;
