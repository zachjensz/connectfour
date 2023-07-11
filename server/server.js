import { Server } from "socket.io";
import { nanoid } from "nanoid";

const WINNING_SEQUENCE = 4;
const COLUMNS = 7;
const ROWS = 6;
const SERVER_URL =
	process.env.NODE_ENV == "production"
		? "https://connectfour.pages.dev"
		: "http://localhost:5173";

const io = new Server(6464, {
	cors: {
		origin: SERVER_URL,
		methods: ["GET", "POST"],
	},
});
const games = new Map();
io.on("connection", (socket) => {
	const me = socket.id;
	socket.on("create", () => {
		const new_uuid = nanoid(5);
		games.set(new_uuid, {
			grid: Array.from({ length: COLUMNS }, () => Array(ROWS).fill("")),
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
		io.to(me).emit("created", new_uuid);
		console.log(`game ${new_uuid} created`);
		const game = games.get(new_uuid);
		manageGame(new_uuid);
	});
	socket.on("join", (uuid) => {
		console.log(`game ${uuid} joined`);
		if (!games.has(uuid)) {
			io.to(me).emit("unavailable");
			return;
		}
		const game = games.get(uuid);
		if (game.socketOne && game.socketTwo) {
			io.to(me).emit("full");
			return;
		}
		io.to(me).emit("joined", game.drops);
		manageGame(uuid);
	});
	function manageGame(uuid) {
		console.log(`Managing game ${uuid}`);
		const game = games.get(uuid);
		socket.join(uuid);
		game.socketOne ? (game.socketTwo = me) : (game.socketOne = me);
		if (game.socketOne && game.socketTwo) {
			io.to(game.socketTurn).emit("turn");
			io.to(game.socketWait).emit("wait");
		}
		socket.on("hover", (column) => {
			if (!game.socketTurn == me) return;
			socket.to(uuid).volatile.emit("hover", column);
		});
		socket.on("drop", (column) => {
			if (!game.socketTurn == me) return;
			if (typeof column !== "number") return;
			socket.to(uuid).emit("drop", column);
			game.drops.push(column);
			game.grid[column][lowestFreeSlot(game.grid[column])] = game.socketOneTurn
				? 1
				: 2;
			if (hasWon(game, column, game.socketOneTurn ? 1 : 2)) {
				io.to(uuid).emit("win");
			} else {
				const newTurn = !game.socketOneTurn;
				game.socketOneTurn = newTurn;
			}
		});
		socket.on("disconnect", () => {
			socket.to(uuid).emit("inactive");
			if (game.socketOne == me) game.socketOne = null;
			if (game.socketTwo == me) game.socketTwo = null;
		});
	}
});
function hasWon(game, lastDropCol, lastDropPlayer) {
	const lastDropRow = highestOccupiedSlot(game.grid[lastDropCol]);
	const SOUTH = [0, 1];
	const EAST = [1, 0];
	const WEST = [-1, 0];
	const NORTH_EAST = [1, -1];
	const SOUTH_WEST = [-1, 1];
	const NORTH_WEST = [1, 1];
	const SOUTH_EAST = [-1, -1];
	const win = [
		[SOUTH],
		[[EAST], [WEST]],
		[[NORTH_EAST], [SOUTH_WEST]],
		[[NORTH_WEST], [SOUTH_EAST]],
	].some(
		(line) =>
			line.reduce(
				(length, direction) =>
					length +
					checkSlot(
						lastDropPlayer,
						lastDropCol,
						lastDropRow,
						direction[0],
						direction[1]
					),
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
