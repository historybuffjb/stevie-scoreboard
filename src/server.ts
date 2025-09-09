import express from 'express';
import { getDb } from './db';
import path from 'path';

const app = express();
const PORT = 3000;
// All data now comes from SQLite

app.use(express.json());
app.use('/scoreboard', express.static(path.join(__dirname, '../public')));
app.use('/portal', express.static(path.join(__dirname, '../portal')));

// Consolidated GET endpoint for all scoreboard data
app.get('/api/scoreboard', async (req, res) => {
  const db = await getDb();
  const [score] = await db.all('SELECT * FROM score LIMIT 1');
  const players = await db.all('SELECT * FROM players ORDER BY id ASC');
  const [race] = await db.all('SELECT * FROM race LIMIT 1');
  const configRows = await db.all('SELECT * FROM config');
  const config: Record<string, string> = {};
  configRows.forEach((row: any) => { config[row.key] = row.value; });
  
  // Ensure all default values are present
  const defaults: Record<string, string> = {
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
      player1: players[0]?.name || 'Player 1',
      player2: players[1]?.name || 'Player 2',
      score1: score?.player1 || 0,
      score2: score?.player2 || 0,
      race: race?.value || 7
    },
    scoreboard2: {
      player1: players[2]?.name || 'Player 3',
      player2: players[3]?.name || 'Player 4',
      score1: score?.player3 || 0,
      score2: score?.player4 || 0,
      race: race?.value2 || 7
    },
    config: config
  });
});

// Consolidated POST endpoint for updating scoreboard data
app.post('/api/scoreboard', async (req, res) => {
  const db = await getDb();
  const { scoreboard, scoreboard2, config } = req.body;
  // Scoreboard 1
  if (scoreboard) {
    if (scoreboard.player1 !== undefined)
      await db.run('UPDATE players SET name = ? WHERE id = 1', scoreboard.player1);
    if (scoreboard.player2 !== undefined)
      await db.run('UPDATE players SET name = ? WHERE id = 2', scoreboard.player2);
    if (scoreboard.score1 !== undefined && scoreboard.score2 !== undefined)
      await db.run('UPDATE score SET player1 = ?, player2 = ?', scoreboard.score1, scoreboard.score2);
    if (scoreboard.race !== undefined)
      await db.run('UPDATE race SET value = ?', scoreboard.race);
  }
  // Scoreboard 2
  if (scoreboard2) {
    if (scoreboard2.player1 !== undefined)
      await db.run('UPDATE players SET name = ? WHERE id = 3', scoreboard2.player1);
    if (scoreboard2.player2 !== undefined)
      await db.run('UPDATE players SET name = ? WHERE id = 4', scoreboard2.player2);
    if (scoreboard2.score1 !== undefined && scoreboard2.score2 !== undefined)
      await db.run('UPDATE score SET player3 = ?, player4 = ?', scoreboard2.score1, scoreboard2.score2);
    if (scoreboard2.race !== undefined)
      await db.run('UPDATE race SET value2 = ?', scoreboard2.race);
  }
  // Other config
  if (config && typeof config === 'object') {
    for (const key in config) {
      await db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', key, config[key]);
    }
  }
  res.sendStatus(200);
});

// API endpoint to toggle scoreboard visibility
app.post('/api/scoreboard/visibility', async (req, res) => {
  const db = await getDb();
  const { id, visible } = req.body;
  if (!id || typeof visible !== 'boolean') {
    return res.status(400).json({ error: 'Missing id or visible (boolean)' });
  }
  await db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', `${id}_visible`, visible ? '1' : '0');
  res.sendStatus(200);
});


// Endpoint to reset scoreboard positions and sizes to defaults
app.post('/api/scoreboard/reset-positions', async (req, res) => {
  const db = await getDb();
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
  const defs: any = defaults;
  for (const key in defs) {
    await db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', key, defs[key]);
  }
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
