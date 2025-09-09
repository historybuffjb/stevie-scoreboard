const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function checkAndUpdateDb() {
  const db = await open({
    filename: './scoreboard.db',
    driver: sqlite3.Database
  });

  // Check current schema
  console.log('Current schema:');
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  for (const table of tables) {
    console.log(`\nTable: ${table.name}`);
    const schema = await db.all(`PRAGMA table_info(${table.name})`);
    console.log(schema);
  }

  // Check and create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY,
      name TEXT
    );
    
    CREATE TABLE IF NOT EXISTS score (
      id INTEGER PRIMARY KEY,
      player1 INTEGER DEFAULT 0,
      player2 INTEGER DEFAULT 0,
      player3 INTEGER DEFAULT 0,
      player4 INTEGER DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS race (
      id INTEGER PRIMARY KEY,
      value INTEGER DEFAULT 7,
      value2 INTEGER DEFAULT 7
    );
    
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Insert default data if tables are empty
  const playerCount = await db.get("SELECT COUNT(*) as count FROM players");
  if (playerCount.count === 0) {
    await db.run("INSERT INTO players (id, name) VALUES (1, 'Player 1')");
    await db.run("INSERT INTO players (id, name) VALUES (2, 'Player 2')");
    await db.run("INSERT INTO players (id, name) VALUES (3, 'Player 3')");
    await db.run("INSERT INTO players (id, name) VALUES (4, 'Player 4')");
  }

  const scoreCount = await db.get("SELECT COUNT(*) as count FROM score");
  if (scoreCount.count === 0) {
    await db.run("INSERT INTO score (id, player1, player2, player3, player4) VALUES (1, 0, 0, 0, 0)");
  } else {
    // Add missing columns if they don't exist
    try {
      await db.run("ALTER TABLE score ADD COLUMN player3 INTEGER DEFAULT 0");
    } catch (e) {
      console.log('player3 column already exists');
    }
    try {
      await db.run("ALTER TABLE score ADD COLUMN player4 INTEGER DEFAULT 0");
    } catch (e) {
      console.log('player4 column already exists');
    }
  }

  const raceCount = await db.get("SELECT COUNT(*) as count FROM race");
  if (raceCount.count === 0) {
    await db.run("INSERT INTO race (id, value, value2) VALUES (1, 7, 7)");
  } else {
    // Add missing column if it doesn't exist
    try {
      await db.run("ALTER TABLE race ADD COLUMN value2 INTEGER DEFAULT 7");
    } catch (e) {
      console.log('value2 column already exists');
    }
  }

  console.log('\nDatabase setup complete!');
  await db.close();
}

checkAndUpdateDb().catch(console.error);
