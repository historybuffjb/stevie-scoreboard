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
  // Scoreboard 1
  const sb1 = data.scoreboard || {};
  animateChange('player1', sb1.score1 ?? 0);
  animateChange('player2', sb1.score2 ?? 0);
  animateChange('name1', sb1.player1 ?? 'Player 1');
  animateChange('name2', sb1.player2 ?? 'Player 2');
  animateChange('race1', sb1.race ?? 7);
  // Scoreboard 2
  const sb2 = data.scoreboard2 || {};
  animateChange('player3', sb2.score1 ?? 0);
  animateChange('player4', sb2.score2 ?? 0);
  animateChange('name3', sb2.player1 ?? 'Player 3');
  animateChange('name4', sb2.player2 ?? 'Player 4');
  animateChange('race2', sb2.race ?? 7);
  // Mini mirrors
  animateChange('mini-player1', sb1.score1 ?? 0);
  animateChange('mini-player2', sb1.score2 ?? 0);
  animateChange('mini-name1', sb1.player1 ?? 'Player 1');
  animateChange('mini-name2', sb1.player2 ?? 'Player 2');
  animateChange('mini-race1', sb1.race ?? 7);
  animateChange('mini-player3', sb2.score1 ?? 0);
  animateChange('mini-player4', sb2.score2 ?? 0);
  animateChange('mini-name3', sb2.player1 ?? 'Player 3');
  animateChange('mini-name4', sb2.player2 ?? 'Player 4');
  animateChange('mini-race2', sb2.race ?? 7);
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
    // Scorebar colors (for all scorebars)
    document.querySelectorAll('.scorebar').forEach(scorebar => {
      scorebar.style.background = data.config.scorebar_bg || '#23235b';
      scorebar.style.color = data.config.scorebar_fg || '#e0e0e0';
    });

    // Show/hide scorebars based on config
    ['scorebar1', 'scorebar2', 'mini-scorebar1', 'mini-scorebar2'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const visible = data.config[`${id}_visible`];
        el.style.display = (visible === '0') ? 'none' : '';
      }
    });

    // Apply scale and position for each scoreboard
    ['scorebar1', 'scorebar2', 'mini-scorebar1', 'mini-scorebar2'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const scale = parseFloat(data.config[`${id}_scale`] || '1');
        const x = parseFloat(data.config[`${id}_x`] || '0');
        const y = parseFloat(data.config[`${id}_y`] || '0');
        el.style.setProperty('--mini-scale', scale);
        
        // Handle positioning based on current CSS setup
        if (id.includes('mini-scoreboard')) {
          // Mini scoreboards are positioned from the right
          el.style.right = `${2 + x}vw`;
          el.style.left = 'auto';
        } else {
          // Full scoreboards are positioned from the left
          el.style.left = `${5 + x}vw`;
          el.style.right = 'auto';
        }
        
        // Set vertical position
        if (id === 'scorebar1') {
          el.style.bottom = `${5 + y}vh`;
          el.style.top = 'auto';
        } else if (id === 'scorebar2') {
          el.style.top = `${5 + y}vh`;
          el.style.bottom = 'auto';
        } else if (id === 'mini-scorebar1') {
          el.style.top = `${2 + y}vh`;
          el.style.bottom = 'auto';
        } else if (id === 'mini-scorebar2') {
          el.style.top = `${6 + y}vh`;
          el.style.bottom = 'auto';
        }
      }
    });
  }
}

setInterval(fetchScoreboard, 1000);
fetchScoreboard();
