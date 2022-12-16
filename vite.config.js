import { sveltekit } from '@sveltejs/kit/vite';

import { Server } from 'socket.io';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		const io = new Server(server.httpServer);
		const games = new Map();
		games.set('zach', {
			drops: []
		});
		io.on('connection', (socket) => {
			const player = socket.id;
			socket.on('join', (uuid, cb) => {
				if (!games.has(uuid)) return cb('null');
				const game = games.get(uuid);
				const isFull = () => game.turn && game.wait;
				if (isFull()) return cb('full');
				socket.join(uuid);
				game?.turn ? (game.wait = player) : (game.turn = player);
				const isMyTurn = () => (game.turn === player && isFull());
				if (isFull()) {
					io.to(uuid).emit('start');
					io.to(game.turn).emit('turn');
				}
				cb('joined');

				socket.on('hover', (column) => {
					if (!isMyTurn()) return;
					socket.to(uuid).volatile.emit('hover', column);
				});

				socket.on('drop', (column) => {
					if (!isMyTurn()) return;
					socket.to(uuid).emit('drop', column);
					game.turn = game.wait;
					game.wait = player;
					game.drops.push(column);
				});

				socket.on('disconnect', () => {
					socket.to(uuid).emit('wait');
					if (game.turn === player) game.turn = null;
				});
			});
		});
	}
};

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), webSocketServer]
};

export default config;
