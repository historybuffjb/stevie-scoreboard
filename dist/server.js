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
    var _a, _b, _c, _d;
    const db = yield (0, db_1.getDb)();
    const [score] = yield db.all('SELECT * FROM score LIMIT 1');
    const players = yield db.all('SELECT * FROM players ORDER BY id ASC');
    const [race] = yield db.all('SELECT * FROM race LIMIT 1');
    const configRows = yield db.all('SELECT * FROM config');
    const config = {};
    configRows.forEach((row) => { config[row.key] = row.value; });
    // Ensure all default values are present
    const defaults = {
        // Visibility defaults
        scorebar1_visible: '1',
        scorebar2_visible: '1',
        'mini-scorebar1_visible': '1',
        'mini-scorebar2_visible': '1',
        // Scale defaults
        scorebar1_scale: '1',
        scorebar2_scale: '1',
        'mini-scorebar1_scale': '0.4',
        'mini-scorebar2_scale': '0.4',
        // Position defaults
        scorebar1_x: '0',
        scorebar1_y: '0',
        scorebar2_x: '0',
        scorebar2_y: '0',
        'mini-scorebar1_x': '0',
        'mini-scorebar1_y': '0',
        'mini-scorebar2_x': '0',
        'mini-scorebar2_y': '0',
        // Size defaults
        scorebar1_width: '90',
        scorebar1_height: '5.28',
        scorebar2_width: '90',
        scorebar2_height: '5.28',
        'mini-scorebar1_width': '36',
        'mini-scorebar1_height': '2.1',
        'mini-scorebar2_width': '36',
        'mini-scorebar2_height': '2.1',
        // Font and style defaults
        score_font: 'Metal Mania',
        score_font_size: '6vh',
        race_font: 'Metal Mania',
        race_font_size: '3vh',
        player_font: 'Metal Mania',
        player_font_size: '4vh',
        scorebar_bg: '#23235b',
        scorebar_fg: '#e0e0e0',
        tournament_name: 'Stevie Chan Memorial 2026'
    };
    // Apply defaults for any missing values
    Object.keys(defaults).forEach(key => {
        if (config[key] === undefined) {
            config[key] = defaults[key];
        }
    });
    res.json({
        scoreboard: {
            player1: ((_a = players[0]) === null || _a === void 0 ? void 0 : _a.name) || 'Player 1',
            player2: ((_b = players[1]) === null || _b === void 0 ? void 0 : _b.name) || 'Player 2',
            score1: (score === null || score === void 0 ? void 0 : score.player1) || 0,
            score2: (score === null || score === void 0 ? void 0 : score.player2) || 0,
            race: (race === null || race === void 0 ? void 0 : race.value) || 7
        },
        scoreboard2: {
            player1: ((_c = players[2]) === null || _c === void 0 ? void 0 : _c.name) || 'Player 3',
            player2: ((_d = players[3]) === null || _d === void 0 ? void 0 : _d.name) || 'Player 4',
            score1: (score === null || score === void 0 ? void 0 : score.player3) || 0,
            score2: (score === null || score === void 0 ? void 0 : score.player4) || 0,
            race: (race === null || race === void 0 ? void 0 : race.value2) || 7
        },
        config: config
    });
}));
// Consolidated POST endpoint for updating scoreboard data
app.post('/api/scoreboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, db_1.getDb)();
    const { scoreboard, scoreboard2, config } = req.body;
    // Scoreboard 1
    if (scoreboard) {
        if (scoreboard.player1 !== undefined)
            yield db.run('UPDATE players SET name = ? WHERE id = 1', scoreboard.player1);
        if (scoreboard.player2 !== undefined)
            yield db.run('UPDATE players SET name = ? WHERE id = 2', scoreboard.player2);
        if (scoreboard.score1 !== undefined && scoreboard.score2 !== undefined)
            yield db.run('UPDATE score SET player1 = ?, player2 = ?', scoreboard.score1, scoreboard.score2);
        if (scoreboard.race !== undefined)
            yield db.run('UPDATE race SET value = ?', scoreboard.race);
    }
    // Scoreboard 2
    if (scoreboard2) {
        if (scoreboard2.player1 !== undefined)
            yield db.run('UPDATE players SET name = ? WHERE id = 3', scoreboard2.player1);
        if (scoreboard2.player2 !== undefined)
            yield db.run('UPDATE players SET name = ? WHERE id = 4', scoreboard2.player2);
        if (scoreboard2.score1 !== undefined && scoreboard2.score2 !== undefined)
            yield db.run('UPDATE score SET player3 = ?, player4 = ?', scoreboard2.score1, scoreboard2.score2);
        if (scoreboard2.race !== undefined)
            yield db.run('UPDATE race SET value2 = ?', scoreboard2.race);
    }
    // Other config
    if (config && typeof config === 'object') {
        for (const key in config) {
            yield db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', key, config[key]);
        }
    }
    res.sendStatus(200);
}));
// API endpoint to toggle scoreboard visibility
app.post('/api/scoreboard/visibility', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, db_1.getDb)();
    const { id, visible } = req.body;
    if (!id || typeof visible !== 'boolean') {
        return res.status(400).json({ error: 'Missing id or visible (boolean)' });
    }
    yield db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', `${id}_visible`, visible ? '1' : '0');
    res.sendStatus(200);
}));
// Individual show/hide endpoints for StreamDeck integration
app.post('/api/scoreboard/:scoreboardId/show', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { scoreboardId } = req.params;
        const validIds = ['scorebar1', 'scorebar2', 'mini-scorebar1', 'mini-scorebar2'];
        if (!validIds.includes(scoreboardId)) {
            return res.status(400).json({ error: 'Invalid scoreboard ID. Must be: scorebar1, scorebar2, mini-scorebar1, or mini-scorebar2' });
        }
        const db = yield (0, db_1.getDb)();
        yield db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', `${scoreboardId}_visible`, '1');
        res.json({
            success: true,
            scoreboard: scoreboardId,
            visible: true,
            message: `${scoreboardId} is now visible`
        });
    }
    catch (error) {
        console.error('Error in show scoreboard endpoint:', error);
        res.status(500).json({ error: 'Failed to show scoreboard', details: error instanceof Error ? error.message : String(error) });
    }
}));
app.post('/api/scoreboard/:scoreboardId/hide', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { scoreboardId } = req.params;
        const validIds = ['scorebar1', 'scorebar2', 'mini-scorebar1', 'mini-scorebar2'];
        if (!validIds.includes(scoreboardId)) {
            return res.status(400).json({ error: 'Invalid scoreboard ID. Must be: scorebar1, scorebar2, mini-scorebar1, or mini-scorebar2' });
        }
        const db = yield (0, db_1.getDb)();
        yield db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', `${scoreboardId}_visible`, '0');
        res.json({
            success: true,
            scoreboard: scoreboardId,
            visible: false,
            message: `${scoreboardId} is now hidden`
        });
    }
    catch (error) {
        console.error('Error in hide scoreboard endpoint:', error);
        res.status(500).json({ error: 'Failed to hide scoreboard', details: error instanceof Error ? error.message : String(error) });
    }
}));
// Toggle endpoint for convenience
app.post('/api/scoreboard/:scoreboardId/toggle', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { scoreboardId } = req.params;
        const validIds = ['scorebar1', 'scorebar2', 'mini-scorebar1', 'mini-scorebar2'];
        if (!validIds.includes(scoreboardId)) {
            return res.status(400).json({ error: 'Invalid scoreboard ID. Must be: scorebar1, scorebar2, mini-scorebar1, or mini-scorebar2' });
        }
        const db = yield (0, db_1.getDb)();
        const configRows = yield db.all('SELECT * FROM config WHERE key = ?', `${scoreboardId}_visible`);
        const currentVisibility = configRows.length > 0 ? configRows[0].value : '1'; // Default to visible
        const newVisibility = currentVisibility === '1' ? '0' : '1';
        yield db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', `${scoreboardId}_visible`, newVisibility);
        res.json({
            success: true,
            scoreboard: scoreboardId,
            visible: newVisibility === '1',
            previousState: currentVisibility === '1',
            message: `${scoreboardId} is now ${newVisibility === '1' ? 'visible' : 'hidden'}`
        });
    }
    catch (error) {
        console.error('Error in toggle scoreboard endpoint:', error);
        res.status(500).json({ error: 'Failed to toggle scoreboard', details: error instanceof Error ? error.message : String(error) });
    }
}));
// Endpoint to reset scoreboard positions and sizes to defaults
app.post('/api/scoreboard/reset-positions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, db_1.getDb)();
    // Default values (customize as needed)
    const defaults = {
        scorebar1_x: 0,
        scorebar1_y: 90,
        scorebar1_scale: 1,
        scorebar1_width: 90,
        scorebar1_height: 5.28,
        scorebar2_x: 0,
        scorebar2_y: 80,
        scorebar2_scale: 1,
        scorebar2_width: 90,
        scorebar2_height: 5.28,
        'mini-scorebar1_x': 0,
        'mini-scorebar1_y': 5,
        'mini-scorebar1_scale': 0.5,
        'mini-scorebar1_width': 36,
        'mini-scorebar1_height': 2.1,
        'mini-scorebar2_x': 0,
        'mini-scorebar2_y': 5,
        'mini-scorebar2_scale': 0.5,
        'mini-scorebar2_width': 36,
        'mini-scorebar2_height': 2.1
    };
    const defs = defaults;
    for (const key in defs) {
        yield db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', key, defs[key]);
    }
    res.sendStatus(200);
}));
// Score increment/decrement endpoints for StreamDeck integration
app.post('/api/scoreboard/:boardNumber/player/:playerNumber/increment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardNumber, playerNumber } = req.params;
        const amount = parseInt(req.body.amount) || 1;
        if (!['1', '2'].includes(boardNumber) || !['1', '2'].includes(playerNumber)) {
            return res.status(400).json({ error: 'Invalid board or player number' });
        }
        const db = yield (0, db_1.getDb)();
        let scoreColumn = '';
        if (boardNumber === '1') {
            scoreColumn = playerNumber === '1' ? 'player1' : 'player2';
        }
        else {
            scoreColumn = playerNumber === '1' ? 'player3' : 'player4';
        }
        // Get current score
        const [currentScore] = yield db.all('SELECT * FROM score LIMIT 1');
        const newScore = ((currentScore === null || currentScore === void 0 ? void 0 : currentScore[scoreColumn]) || 0) + amount;
        // Update score
        yield db.run(`UPDATE score SET ${scoreColumn} = ? WHERE rowid = 1`, Math.max(0, newScore));
        res.json({
            success: true,
            board: boardNumber,
            player: playerNumber,
            newScore: Math.max(0, newScore),
            change: amount
        });
    }
    catch (error) {
        console.error('Error in increment endpoint:', error);
        res.status(500).json({ error: 'Failed to update score', details: error instanceof Error ? error.message : String(error) });
    }
}));
app.post('/api/scoreboard/:boardNumber/player/:playerNumber/decrement', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardNumber, playerNumber } = req.params;
        const amount = parseInt(req.body.amount) || 1;
        if (!['1', '2'].includes(boardNumber) || !['1', '2'].includes(playerNumber)) {
            return res.status(400).json({ error: 'Invalid board or player number' });
        }
        const db = yield (0, db_1.getDb)();
        let scoreColumn = '';
        if (boardNumber === '1') {
            scoreColumn = playerNumber === '1' ? 'player1' : 'player2';
        }
        else {
            scoreColumn = playerNumber === '1' ? 'player3' : 'player4';
        }
        // Get current score
        const [currentScore] = yield db.all('SELECT * FROM score LIMIT 1');
        const newScore = Math.max(0, ((currentScore === null || currentScore === void 0 ? void 0 : currentScore[scoreColumn]) || 0) - amount);
        // Update score
        yield db.run(`UPDATE score SET ${scoreColumn} = ? WHERE rowid = 1`, newScore);
        res.json({
            success: true,
            board: boardNumber,
            player: playerNumber,
            newScore: newScore,
            change: -amount
        });
    }
    catch (error) {
        console.error('Error in decrement endpoint:', error);
        res.status(500).json({ error: 'Failed to update score', details: error instanceof Error ? error.message : String(error) });
    }
}));
// Quick score set endpoint
app.post('/api/scoreboard/:boardNumber/player/:playerNumber/set', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardNumber, playerNumber } = req.params;
        const score = parseInt(req.body.score);
        if (!['1', '2'].includes(boardNumber) || !['1', '2'].includes(playerNumber)) {
            return res.status(400).json({ error: 'Invalid board or player number' });
        }
        if (isNaN(score) || score < 0) {
            return res.status(400).json({ error: 'Invalid score value' });
        }
        const db = yield (0, db_1.getDb)();
        let scoreColumn = '';
        if (boardNumber === '1') {
            scoreColumn = playerNumber === '1' ? 'player1' : 'player2';
        }
        else {
            scoreColumn = playerNumber === '1' ? 'player3' : 'player4';
        }
        // Update score
        yield db.run(`UPDATE score SET ${scoreColumn} = ? WHERE rowid = 1`, score);
        res.json({
            success: true,
            board: boardNumber,
            player: playerNumber,
            newScore: score
        });
    }
    catch (error) {
        console.error('Error in set score endpoint:', error);
        res.status(500).json({ error: 'Failed to set score', details: error instanceof Error ? error.message : String(error) });
    }
}));
// Reset scores endpoint
app.post('/api/scoreboard/reset-scores', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, db_1.getDb)();
        yield db.run('UPDATE score SET player1 = 0, player2 = 0, player3 = 0, player4 = 0 WHERE rowid = 1');
        res.json({
            success: true,
            message: 'All scores reset to 0'
        });
    }
    catch (error) {
        console.error('Error in reset scores endpoint:', error);
        res.status(500).json({ error: 'Failed to reset scores', details: error instanceof Error ? error.message : String(error) });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
