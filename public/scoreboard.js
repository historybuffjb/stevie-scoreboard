const lastValues = {};

function animateChange(id, newValue) {
  const el = document.getElementById(id);
  if (lastValues[id] === undefined) {
    // First load, just set value, no animation
    el.textContent = newValue;
    lastValues[id] = String(newValue);
    return;
  }
  if (lastValues[id] !== String(newValue)) {
    el.classList.remove('rollover');
    void el.offsetWidth; // trigger reflow
    el.classList.add('rollover');
    setTimeout(() => {
      el.textContent = newValue;
      el.classList.remove('rollover');
      lastValues[id] = String(newValue);
    }, 1200); // match animation duration
  }
}

async function fetchScoreboard() {
  const res = await fetch('/api/scoreboard');
  const data = await res.json();
  animateChange('player1', data.score1);
  animateChange('player2', data.score2);
  animateChange('name1', data.player1);
  animateChange('name2', data.player2);
  animateChange('race', data.race);
  // Tournament name (formerly memorial)
  const tournament = document.getElementById('tournament-title');
  if (tournament && data.config && data.config.tournament_name) {
    tournament.textContent = data.config.tournament_name;
  }
  // Apply config
  if (data.config) {
    // Score font and size
    const score1 = document.getElementById('player1');
    const score2 = document.getElementById('player2');
    if (score1) {
      score1.style.fontFamily = data.config.score_font || 'Metal Mania';
      score1.style.fontSize = data.config.score_font_size || '6vh';
    }
    if (score2) {
      score2.style.fontFamily = data.config.score_font || 'Metal Mania';
      score2.style.fontSize = data.config.score_font_size || '6vh';
    }
    // Race to font and size
    const race = document.getElementById('race');
    if (race) {
      race.style.fontFamily = data.config.race_font || 'Metal Mania';
      race.style.fontSize = data.config.race_font_size || '3vh';
    }
    // Player name font and size
    const name1 = document.getElementById('name1');
    const name2 = document.getElementById('name2');
    if (name1) {
      name1.style.fontFamily = data.config.player_font || 'Metal Mania';
      name1.style.fontSize = data.config.player_font_size || '4vh';
    }
    if (name2) {
      name2.style.fontFamily = data.config.player_font || 'Metal Mania';
      name2.style.fontSize = data.config.player_font_size || '4vh';
    }
    // Tournament title font and size
    const tournament = document.getElementById('tournament-title');
    if (tournament) {
      tournament.style.background = data.config.memorial_bg || '#23235b';
      tournament.style.color = data.config.memorial_fg || '#fff';
      tournament.style.fontFamily = data.config.memorial_font || 'Metal Mania';
      tournament.style.fontSize = data.config.memorial_font_size || '2vh';
    }
    // Scorebar colors
    const scorebar = document.querySelector('.scorebar');
    if (scorebar) {
      scorebar.style.background = data.config.scorebar_bg || '#23235b';
      scorebar.style.color = data.config.scorebar_fg || '#e0e0e0';
    }
  }
}

setInterval(fetchScoreboard, 1000);
fetchScoreboard();
