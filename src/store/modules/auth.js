import firebase from '@/includes/firebase';

export default {
	state: {
		authModalShow: false,
		userLoggedIn: false,
	},
	getters: {
		// authModalShow: (state) => state.authModalShow,
	},
	mutations: {
		toggleAuthModal: (state) => {
			// state param is instead of this.store.state
			state.authModalShow = !state.authModalShow;
		},
		toggleAuth(state) {
			state.userLoggedIn = !this.state.userLoggedIn;
		},
	},
	actions: {
		// first param is ctx but is destructured - can think of if as this.store (ctx.commit is the same as this.store.commit)
		async register({ commit }, payload) {
			const userCred = await firebase.auth.createUserWithEmailAndPassword(payload.email, payload.password);

			// await firebase.usersCollection.add({
			// 	name: payload.name,
			// 	email: payload.email,
			// 	age: payload.age,
			// 	country: payload.country,
			// });
			//

			await firebase.usersCollection.doc(userCred.user.uid).set({
				name: payload.name,
				email: payload.email,
				age: payload.age,
				country: payload.country,
			});

			await userCred.user.updateProfile({
				displayName: payload.name,
			});

			commit('toggleAuth');
		},
		async login({ commit }, payload) {
			await firebase.auth.signInWithEmailAndPassword(payload.email, payload.password);
			commit('toggleAuth');
		},
		init_login({ commit }) {
			const user = firebase.auth.currentUser;

			if (user) {
				commit('toggleAuth');
			}
		},
		// async signOut({ commit }, payload) -- with router as payload
		async signOut({ commit }) {
			console.log('log out');
			await firebase.auth.signOut();
			commit('toggleAuth');

			// if (payload.meta.requiresAuth) {
			// 	payload.router.push({ name: 'home' });
			// }
		},
	},
};
