<template>
	<!-- Header -->
	<app-header/>

	<router-view v-slot="{ Component }">
		<transition name="fade" mode="out-in">
			<component :is="Component"></component>
		</transition>
	</router-view>

	<app-player></app-player>

	<!-- Auth Modal -->
   <app-auth/>
</template>

<script>
import AppPlayer from '@/components/Player.vue';
import AppHeader from './components/Header.vue';
import AppAuth from './components/Auth.vue';

export default {
	components: {
		AppHeader,
		AppAuth,
		AppPlayer,
	},
	created() {
		this.$store.dispatch('init_login');
	},
};
</script>

<style>
.fade-enter-from {
	opacity: 0;
}

.fade-enter-active {
	transition: all .5s linear;
}

.fade-leave-to {
	transition: all .5s linear;
	opacity: 0;
}
</style>
