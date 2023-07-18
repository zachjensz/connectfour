import { Server } from 'socket.io';
import { nanoid } from 'nanoid';

const WINNING_SEQUENCE = 4;
const COLUMNS = 7;
const ROWS = 6;
const CLIENT_URL =
	process.env.NODE_ENV == 'production'
		? 'https://connectfour.pages.dev'
		: 'http://localhost:5173';

const io = new Server(6464, {
	cors: {
		origin: CLIENT_URL,
		methods: ['GET', 'POST'],
	},
});
const games = new Map();
io.on('connection', (socket) => {
	const me = socket.id;
	socket.on('create', () => {
		const new_uuid = nanoid(5);
		games.set(new_uuid, {
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
			},
		});
		io.to(me).emit('created', new_uuid);
		console.log(`game ${new_uuid} created`);
		const game = games.get(new_uuid);
		manageGame(new_uuid);
	});
	socket.on('join', (uuid) => {
		console.log(`game ${uuid} joined`);
		if (!games.has(uuid)) {
			io.to(me).emit('unavailable');
			return;
		}
		const game = games.get(uuid);
		if (game.socketOne && game.socketTwo) {
			io.to(me).emit('full');
			return;
		}
		io.to(me).emit('joined', game.drops);
		manageGame(uuid);
	});
	function manageGame(uuid) {
		console.log(`Managing game ${uuid}`);
		const game = games.get(uuid);
		socket.join(uuid);
		game.socketOne ? (game.socketTwo = me) : (game.socketOne = me);
		if (game.socketOne && game.socketTwo) {
			io.to(game.socketTurn).emit('turn');
			io.to(game.socketWait).emit('wait');
		}
		socket.on('hover', (column) => {
			if (!game.socketTurn == me) return;
			socket.to(uuid).volatile.emit('hover', column);
		});
		socket.on('drop', (column) => {
			if (!game.socketTurn == me) return;
			if (typeof column !== 'number') return;
			socket.to(uuid).emit('drop', column);
			game.drops.push(column);
			game.grid[column][lowestFreeSlot(game.grid[column])] = game.socketOneTurn
				? 1
				: 2;
			const win = winPositions(game, column, game.socketOneTurn ? 1 : 2);
			if (win.length > 0) {
				io.to(uuid).emit('win', [
					[column, highestOccupiedSlot(game.grid[column])],
					...win.flat(),
				]);
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
	}
});
function winPositions(game, col, player) {
	const row = highestOccupiedSlot(game.grid[col]),
		down = [0, 1],
		right = [1, 0],
		left = [-1, 0],
		upRight = [1, -1],
		downLeft = [-1, 1],
		upLeft = [1, 1],
		downRight = [-1, -1];
	return [
		...segments([down]),
		...segments([right, left]),
		...segments([upRight, downLeft]),
		...segments([upLeft, downRight]),
	];
	function segments(directions) {
		const lengths = directions.map(([colDir, rowDir]) =>
			dirLength(col, row, colDir, rowDir),
		);
		const totalLength = lengths.reduce((total, length) => total + length, 0);
		if (totalLength < WINNING_SEQUENCE - 1) return [];
		return directions.map((dir, index) => dirPositions(dir, lengths[index]));
	}
	function dirPositions([colDir, rowDir], length) {
		const positions = [];
		for (let i = length; i > 0; i--) {
			positions.push([col + i * colDir, row + i * rowDir]);
		}
		return positions;
	}
	function dirLength(col, row, colDir, rowDir) {
		if (game.grid[col + colDir]?.[row + rowDir] !== player) return 0;
		return dirLength(col + colDir, row + rowDir, colDir, rowDir) + 1;
	}
}
function highestOccupiedSlot(rows) {
	return 1 + (lowestFreeSlot(rows) ?? -1);
}
function lowestFreeSlot(rows) {
	if (rows[0] > 0) return null;
	return rows.length - [...rows].reverse().findIndex((slot) => slot < 1) - 1;
}
