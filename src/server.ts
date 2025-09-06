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
  res.json({
    player1: players[0]?.name || 'Player 1',
    player2: players[1]?.name || 'Player 2',
    score1: score?.player1 || 0,
    score2: score?.player2 || 0,
    race: race?.value || 7,
    config
  });
});

// Consolidated POST endpoint for updating scoreboard data
app.post('/api/scoreboard', async (req, res) => {
  const db = await getDb();
  const { player1, player2, score1, score2, race, config } = req.body;
  if (player1 !== undefined)
    await db.run('UPDATE players SET name = ? WHERE id = 1', player1);
  if (player2 !== undefined)
    await db.run('UPDATE players SET name = ? WHERE id = 2', player2);
  if (score1 !== undefined && score2 !== undefined)
    await db.run('UPDATE score SET player1 = ?, player2 = ?', score1, score2);
  if (race !== undefined)
    await db.run('UPDATE race SET value = ?', race);
  if (config && typeof config === 'object') {
    for (const key in config) {
      await db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', key, config[key]);
    }
  }
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
