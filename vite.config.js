import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';
// import { webSocketServer } from './server.js';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		{
			name: 'webSocketServer',
			configureServer(server) {
				const io = new Server(server.httpServer);
				const games = new Map();
				games.set('z', {
					drops: []
				});
				io.on('connection', (socket) => {
					const player = socket.id;
					socket.on('join', (uuid, cb) => {
						if (!games.has(uuid)) return cb('unavailable');
						const game = games.get(uuid);
						const isFull = () => game.turn && game.wait;
						if (isFull()) return cb('full');
						socket.join(uuid);
						game?.turn ? (game.wait = player) : (game.turn = player);
						const isMyTurn = () => game.turn === player && isFull();
						if (isFull()) {
							socket.to(game.turn).emit('turn');
							socket.to(game.wait).emit('wait');
						}
						cb(isMyTurn() ? 'turn' : 'wait', game.drops);

						socket.on('hover', (column) => {
							if (!isMyTurn()) return;
							socket.to(uuid).volatile.emit('hover', column);
						});

						socket.on('drop', (column) => {
							if (!isMyTurn()) return;
							if (typeof column !== 'number') return;
							socket.to(uuid).emit('drop', column);
							game.drops.push(column);
							if (hasWon(game.drops)) {
								io.to(uuid).emit('win');
							} else {
								game.turn = game.wait;
								game.wait = player;
							}
						});

						socket.on('disconnect', () => {
							socket.to(uuid).emit('inactive');
							if (game.turn === player) game.turn = null;
							if (game.wait === player) game.wait = null;
						});
					});
				});
				function hasWon(history) {
					const WINNING_SEQUENCE = 4;
					const COLUMNS = 7;
					const ROWS = 6;
					const grid = new Array();
					for (let i = 0; i < COLUMNS; i++) {
						grid.push([]);
						for (let j = 0; j < ROWS; j++) {
							grid[i].push(0);
						}
					}
					history.forEach((drop, index) => {
						grid[drop][lowestFreeSlot(grid[drop])] = index % 2 ? 2 : 1;
					});
					const lastDropCol = [...history].pop();
					const lastDropRow = highestOccupiedSlot(grid[lastDropCol]);
					const lastDropPlayer = grid[lastDropCol][highestOccupiedSlot(grid[lastDropCol])];
					const win =
						checkDirection(lastDropPlayer, lastDropCol, lastDropRow, 0, -1) +
						checkDirection(lastDropPlayer, lastDropCol, lastDropRow, 1, -1) +
						checkDirection(lastDropPlayer, lastDropCol, lastDropRow, 1, 0) +
						checkDirection(lastDropPlayer, lastDropCol, lastDropRow, 1, 1) +
						checkDirection(lastDropPlayer, lastDropCol, lastDropRow, 0, 1) +
						checkDirection(lastDropPlayer, lastDropCol, lastDropRow, -1, 1) +
						checkDirection(lastDropPlayer, lastDropCol, lastDropRow, -1, 0) +
						checkDirection(lastDropPlayer, lastDropCol, lastDropRow, -1, -1);
					if (win) return true;
					function checkDirection(player, column, row, colOff, rowOff) {
						return checkSlot(player, column, row, colOff, rowOff) + 1 >= WINNING_SEQUENCE;
					}
					function checkSlot(player, column, row, colOff, rowOff) {
						if (grid[column + colOff]?.[row + rowOff] !== player) return 0;
						return checkSlot(player, column + colOff, row + rowOff, colOff, rowOff) + 1;
					}
				}
				function highestOccupiedSlot(rows) {
					return 1 + (lowestFreeSlot(rows) ?? -1);
				}
				function lowestFreeSlot(rows) {
					if (rows[0] > 0) return null;
					return rows.length - [...rows].reverse().findIndex((slot) => slot < 1) - 1;
				}
			}
		}
	]
};

export default config;
