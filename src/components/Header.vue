<template>
	<header id="header" class="bg-gray-700">
		<nav class="container mx-auto flex justify-start items-center py-5 px-4">
			<!-- App Name -->
			<router-link class="text-white font-bold uppercase text-2xl mr-4" :to="{ name: 'home' }" exact-active-class="no-active">
				Music
			</router-link>

			<div class="flex flex-grow items-center">
				<!-- Primary Navigation -->
				<ul class="flex flex-row mt-1">
					<!-- Navigation Links -->
					<li v-if="!this.userLoggedIn">
						<a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">
							Login / Register
						</a>
					</li>
					<template v-else>
						<li>
							<router-link class="px-2 text-white" :to="{ name: 'about' }" >About</router-link>
						</li>
						<li>
							<router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
						</li>
						<li>
							<a class="px-2 text-white" href="#" @click.prevent="signOut">Logout</a>
						</li>
					</template>
				</ul>

				<ul class="flex flex-row mt-1 mt-1 ml-auto">
					<li>
						<a class="px-2 text-white" href="#" @click.prevent="changeLocale">
							{{ currentLocale }}
						</a>
					</li>
				</ul>
			</div>
		</nav>
	</header>
</template>

<script>
//	import { mapMutations, mapState, mapActions } from 'vuex';
import { mapMutations, mapState } from 'vuex';

export default {
	name: 'Header',
	computed: {
		...mapState(['userLoggedIn']), // this is a mapper
		currentLocale() {
			return this.$i18n.locale === 'ro' ? 'Romanian' : 'English';
		},
	},
	methods: {
		...mapMutations(['toggleAuthModal']),
		signOut() {
			// this.$store.dispatch('signOut', { router: this.$router, route: this.route }); -- this way you can avoid dep cycle and use router methods in the store
			this.$store.dispatch('signOut');

			// if (this.$route.name === 'manage') {
			// 	this.$router.push({ name: 'home' });
			// }

			if (this.$route.meta.requiresAuth) {
				this.$router.push({ name: 'home' });
			}
		},
		changeLocale() {
			this.$i18n.locale = this.$i18n.locale === 'ro' ? 'en' : 'ro';
		},
		// ...mapActions(['signOut']),
		// toggleAuthModal() {
		// 	//	this.$store.state.authModalShow = !this.$store.state.authModalShow;
		// 	// this.$store.commit('toggleAuthModal');
		// 	console.log(this.$store.state.authModalShow);
		// },
	},
};
</script>

<style scoped>

</style>
