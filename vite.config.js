import { sveltekit } from '@sveltejs/kit/vite';

import { Server } from 'socket.io'

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		const io = new Server(server.httpServer)

		io.on('connection', (socket) => {
			socket.emit('eventFromServer', 'Hellhaohgh')
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
