import { createStore } from 'vuex';
import firebase from '@/includes/firebase';
import { Howl } from 'howler';
import helper from '@/includes/helper';

export default createStore({
	state: {
		authModalShow: false,
		userLoggedIn: false,
		currentSong: {},
		sound: {}, // howler instance
		seek: '00:00',
		duration: '00:00',
		playerProgress: '0%',
	},
	mutations: {
		toggleAuthModal: (state) => {
			// state param is instead of this.store.state
			state.authModalShow = !state.authModalShow;
		},
		toggleAuth(state) {
			state.userLoggedIn = !this.state.userLoggedIn;
		},
		newSong(state, payload) {
			state.currentSong = payload;
			state.sound = new Howl({
				src: [payload.url],
				html5: true,
			});
		},
		updatePosition(state) {
			state.seek = helper.formatTime(state.sound.seek());
			state.duration = helper.formatTime(state.sound.duration());
			state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
		},
	},
	getters: {
		// authModalShow: (state) => state.authModalShow,
		playing: (state) => {
			if (state.sound.playing) {
				// console.log('test');
				// console.log(state.sound.playing());
				return state.sound.playing();
			}

			return false;
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
			await firebase.auth.signOut();
			commit('toggleAuth');

			// if (payload.meta.requiresAuth) {
			// 	payload.router.push({ name: 'home' });
			// }
		},
		async newSong({ commit, state, dispatch }, payload) {
			if (state.sound instanceof Howl) {
				state.sound.unload();
			}

			commit('newSong', payload);
			state.sound.play();
			state.sound.on('play', () => {
				requestAnimationFrame(() => {
					dispatch('progress');
				});
			});
		},
		async toggleAudio({ state }) {
			if (!state.sound.playing) {
				return;
			}

			if (state.sound.playing()) {
				state.sound.pause();
			} else {
				state.sound.play();
			}
		},
		progress({ commit, state, dispatch }) {
			commit('updatePosition');
			if (state.sound.playing()) {
				requestAnimationFrame(() => {
					dispatch('progress');
				});
			}
		},
		updateSeek({ state, dispatch }, payload) {
			if (!state.sound.playing) {
				return;
			}

			const { x, width } = payload.currentTarget.getBoundingClientRect();
			const clickX = payload.clientX - x;
			const percentage = clickX / width;
			const seconds = state.sound.duration() * percentage;

			state.sound.seek(seconds);
			state.sound.once('seek', () => {
				dispatch('progress');
			});
		},
	},
});
