import { sveltekit } from '@sveltejs/kit/vite';

import { Server } from 'socket.io'

const games = ["zach"]

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		const io = new Server(server.httpServer)

		io.on('connection', (socket) => {
			socket.on('join', (gameuuid, callback) => {
				if (games.includes(gameuuid)) {
					callback(true)
				} else {
				callback(false)
				}
			})
		})
	},
}


/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		webSocketServer,
	]
};

export default config;
