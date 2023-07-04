import { Server } from 'socket.io';

// const config = {
// 	plugins: [
// 		sveltekit(),
// 		{
// 			name: 'webSocketServer',
			// configureServer(server) {
				const WINNING_SEQUENCE = 4;
				const COLUMNS = 7;
				const ROWS = 6;
				const io = new Server(server.httpServer);
				const games = new Map();
				games.set('z', {
					grid: Array.from({ length: COLUMNS }, () => Array(ROWS).fill('')),
					drops: [],
					socketOne: null,
					socketTwo: null,
					socketOneTurn: false,
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
						if (!games.has(uuid)) return cb('unavailable');
						const game = games.get(uuid);
						if (game.socketOne && game.socketTwo) return cb('full');
						socket.join(uuid);
						game.socketOne ? (game.socketTwo = me) : (game.socketOne = me);
						if (game.socketOne && game.socketTwo) {
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
							game.grid[column][lowestFreeSlot(game.grid[column])] = game.socketOneTurn ? 1 : 2;
							if (hasWon(game, column, game.socketOneTurn ? 1 : 2)) {
								io.to(uuid).emit('win');
							} else {
								const newTurn = !game.socketOneTurn;
								game.socketOneTurn = newTurn;
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
						[[0, 1]], // South
						[
							[1, 0], // East and West
							[-1, 0]
						],
						[
							[1, -1], // North East and South West
							[-1, 1]
						],
						[
							[1, 1], // North West and South East
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
			// }
		// }
	// ]
// };

// export default config;
