"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 3000;
// All data now comes from SQLite
app.use(express_1.default.json());
app.use('/scoreboard', express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/portal', express_1.default.static(path_1.default.join(__dirname, '../portal')));
// Consolidated GET endpoint for all scoreboard data
app.get('/api/scoreboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const db = yield (0, db_1.getDb)();
    const [score] = yield db.all('SELECT * FROM score LIMIT 1');
    const players = yield db.all('SELECT * FROM players ORDER BY id ASC');
    const [race] = yield db.all('SELECT * FROM race LIMIT 1');
    const configRows = yield db.all('SELECT * FROM config');
    const config = {};
    configRows.forEach((row) => { config[row.key] = row.value; });
    res.json({
        player1: ((_a = players[0]) === null || _a === void 0 ? void 0 : _a.name) || 'Player 1',
        player2: ((_b = players[1]) === null || _b === void 0 ? void 0 : _b.name) || 'Player 2',
        score1: (score === null || score === void 0 ? void 0 : score.player1) || 0,
        score2: (score === null || score === void 0 ? void 0 : score.player2) || 0,
        race: (race === null || race === void 0 ? void 0 : race.value) || 7,
        config
    });
}));
// Consolidated POST endpoint for updating scoreboard data
app.post('/api/scoreboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, db_1.getDb)();
    const { player1, player2, score1, score2, race, config } = req.body;
    if (player1 !== undefined)
        yield db.run('UPDATE players SET name = ? WHERE id = 1', player1);
    if (player2 !== undefined)
        yield db.run('UPDATE players SET name = ? WHERE id = 2', player2);
    if (score1 !== undefined && score2 !== undefined)
        yield db.run('UPDATE score SET player1 = ?, player2 = ?', score1, score2);
    if (race !== undefined)
        yield db.run('UPDATE race SET value = ?', race);
    if (config && typeof config === 'object') {
        for (const key in config) {
            yield db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', key, config[key]);
        }
    }
    res.sendStatus(200);
}));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
