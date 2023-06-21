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
				const WINNING_SEQUENCE = 4;
				const COLUMNS = 7;
				const ROWS = 6;
				games.set('z', {
					grid: Array.from({ length: COLUMNS }, () => Array(ROWS).fill('')),
					drops: [],
					socketOne: null,
					socketTwo: null,
					socketOneTurn: false,
					get playerTurn() {
						return this.socketOneTurn ? 1 : 2;
					},
					get full() {
						return this.socketOne && this.socketTwo;
					},
					get socketTurn() {
						return this.socketOneTurn ? this.socketOne : this.socketTwo;
					},
					get socketWait() {
						return this.socketOneTurn ? this.socketTwo : this.socketOne;
					}
				});
				io.on('connection', (socket) => {
					const me = socket.id;
					socket.on('join', (uuid, cb) => {
						if (!games.has(uuid)) return cb(`Game ${uuid} doesn't exist`);
						const game = games.get(uuid);
						if (game.full) return cb(`Game ${uuid} is full`);
						socket.join(uuid);
						game.socketOne ? (game.socketTwo = me) : (game.socketOne = me);
						if (game.full) {
							socket.to(game.socketTurn).emit('turn');
							socket.to(game.socketWait).emit('wait');
						}
						cb(game.socketTurn == me ? 'turn' : 'wait', game.drops);
						socket.on('hover', (column) => {
							if (!game.socketTurn == me) return;
							socket.to(uuid).volatile.emit('hover', column);
						});
						socket.on('drop', (column) => {
							if (!game.socketTurn == me) return;
							if (typeof column !== 'number') return;
							socket.to(uuid).emit('drop', column);
							game.drops.push(column);
							game.grid[column][lowestFreeSlot(game.grid[column])] = game.playerTurn;
							//
							let stringg = '';
							game.grid.forEach((column) => {
								stringg += '\n';
								column.forEach((row) => {
									stringg += row || 0;
								});
							});
							console.log(stringg);
							//
							if (hasWon(game, column, game.playerTurn)) {
								io.to(uuid).emit('win');
							} else {
								console.log('1socketoneturn: ' + game.socketOneTurn);
								game.socketOneTurn = !game.socketOneturn;
								console.log('2socketoneturn: ' + game.socketOneTurn);
							}
						});
						socket.on('disconnect', () => {
							socket.to(uuid).emit('inactive');
							if (game.socketOne == me) game.socketOne = null;
							if (game.socketTwo == me) game.socketTwo = null;
						});
					});
				});
				function hasWon(game, lastDropCol, lastDropPlayer) {
					const lastDropRow = highestOccupiedSlot(game.grid[lastDropCol]);
					const win = [
						[[0, 1]],
						[
							[1, 0],
							[-1, 0]
						],
						[
							[1, -1],
							[-1, 1]
						],
						[
							[1, 1],
							[-1, -1]
						]
					].some(
						(line) =>
							line.reduce(
								(length, direction) =>
									length +
									checkSlot(lastDropPlayer, lastDropCol, lastDropRow, direction[0], direction[1]),
								0
							) >=
							WINNING_SEQUENCE - 1
					);
					if (win) return true;
					function checkSlot(player, column, row, colOff, rowOff) {
						if (game.grid[column + colOff]?.[row + rowOff] !== player) return 0;
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
