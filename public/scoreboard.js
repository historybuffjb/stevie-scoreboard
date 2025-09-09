const lastValues = {};

// Dynamic sizing functionality
function getViewportScale() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const baseWidth = 1920;
  const baseHeight = 1080;
  
  // Calculate scale based on both dimensions, using the smaller scale to ensure fit
  const scaleX = vw / baseWidth;
  const scaleY = vh / baseHeight;
  return Math.min(scaleX, scaleY);
}

function calculateResponsiveSize(baseSize, unit = 'vh') {
  const scale = getViewportScale();
  const numericValue = parseFloat(baseSize);
  
  if (unit === 'vh') {
    // Convert vh to px based on actual viewport and scale
    return `${(numericValue * window.innerHeight / 100) * scale}px`;
  } else if (unit === 'vw') {
    // Convert vw to px based on actual viewport and scale
    return `${(numericValue * window.innerWidth / 100) * scale}px`;
  } else if (unit === 'em' || unit === 'rem') {
    // Scale em/rem units
    return `${numericValue * scale}${unit}`;
  }
  return baseSize;
}

function applyResponsiveSizing() {
  const scale = getViewportScale();
  
  // Apply scaling to all scoreboards
  document.querySelectorAll('.scorebar').forEach(scorebar => {
    // Instead of scaling the entire element, we'll adjust positioning and sizes
    const rect = scorebar.getBoundingClientRect();
    if (rect.width > window.innerWidth || rect.height > window.innerHeight) {
      // If content overflows, apply additional scaling
      const overflowScale = Math.min(
        window.innerWidth / rect.width,
        window.innerHeight / rect.height
      ) * 0.95; // 95% to ensure some margin
      
      if (overflowScale < 1) {
        scorebar.style.transform = `scale(${overflowScale})`;
        scorebar.style.transformOrigin = 'center center';
      }
    }
  });
  
  // Ensure text fits within containers
  document.querySelectorAll('.score-section').forEach(section => {
    const span = section.querySelector('span');
    if (span) {
      // Check if text is overflowing
      if (span.scrollWidth > section.clientWidth) {
        // Reduce font size until it fits
        let fontSize = parseFloat(window.getComputedStyle(span).fontSize);
        while (span.scrollWidth > section.clientWidth && fontSize > 8) {
          fontSize *= 0.95;
          span.style.fontSize = `${fontSize}px`;
        }
      }
    }
  });
}

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
    // Score font and size with responsive scaling
    const score1 = document.getElementById('player1');
    const score2 = document.getElementById('player2');
    if (score1) {
      score1.style.fontFamily = data.config.score_font || 'Metal Mania';
      score1.style.fontSize = calculateResponsiveSize(data.config.score_font_size || '6vh');
    }
    if (score2) {
      score2.style.fontFamily = data.config.score_font || 'Metal Mania';
      score2.style.fontSize = calculateResponsiveSize(data.config.score_font_size || '6vh');
    }
    // Race to font and size with responsive scaling
    const race = document.getElementById('race');
    if (race) {
      race.style.fontFamily = data.config.race_font || 'Metal Mania';
      race.style.fontSize = calculateResponsiveSize(data.config.race_font_size || '3vh');
    }
    // Player name font and size with responsive scaling
    const name1 = document.getElementById('name1');
    const name2 = document.getElementById('name2');
    if (name1) {
      name1.style.fontFamily = data.config.player_font || 'Metal Mania';
      name1.style.fontSize = calculateResponsiveSize(data.config.player_font_size || '4vh');
    }
    if (name2) {
      name2.style.fontFamily = data.config.player_font || 'Metal Mania';
      name2.style.fontSize = calculateResponsiveSize(data.config.player_font_size || '4vh');
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

    // Apply scale and position for each scoreboard with responsive sizing
    const baseScale = getViewportScale();
    ['scorebar1', 'scorebar2', 'mini-scorebar1', 'mini-scorebar2'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const configScale = parseFloat(data.config[`${id}_scale`] || '1');
        const width = parseFloat(data.config[`${id}_width`] || (id.includes('mini') ? '36' : '90'));
        const height = parseFloat(data.config[`${id}_height`] || (id.includes('mini') ? '2.1' : '5.28'));
        const x = parseFloat(data.config[`${id}_x`] || '0');
        const y = parseFloat(data.config[`${id}_y`] || '0');
        
        console.log(`Applying to ${id}: width=${width}vw, height=${height}vh, scale=${configScale}, x=${x}, y=${y}`);
        
        // Apply width and height with !important to override CSS
        el.style.setProperty('width', `${width}vw`, 'important');
        el.style.setProperty('height', `${height}vh`, 'important');
        
        // Combine responsive scale with user-configured scale
        const finalScale = baseScale * configScale;
        el.style.setProperty('--mini-scale', configScale);
        
        // Handle positioning based on current CSS setup with responsive scaling
        if (id.includes('mini-scoreboard')) {
          // Mini scoreboards are positioned from the right
          el.style.setProperty('right', calculateResponsiveSize(`${2 + x}vw`, 'vw'), 'important');
          el.style.setProperty('left', 'auto', 'important');
        } else {
          // Full scoreboards are positioned from the left
          el.style.setProperty('left', calculateResponsiveSize(`${5 + x}vw`, 'vw'), 'important');
          el.style.setProperty('right', 'auto', 'important');
        }
        
        // Set vertical position with responsive scaling
        if (id === 'scorebar1') {
          el.style.setProperty('bottom', calculateResponsiveSize(`${5 + y}vh`, 'vh'), 'important');
          el.style.setProperty('top', 'auto', 'important');
        } else if (id === 'scorebar2') {
          el.style.setProperty('top', calculateResponsiveSize(`${5 + y}vh`, 'vh'), 'important');
          el.style.setProperty('bottom', 'auto', 'important');
        } else if (id === 'mini-scorebar1') {
          el.style.setProperty('top', calculateResponsiveSize(`${2 + y}vh`, 'vh'), 'important');
          el.style.setProperty('bottom', 'auto', 'important');
        } else if (id === 'mini-scorebar2') {
          el.style.setProperty('top', calculateResponsiveSize(`${6 + y}vh`, 'vh'), 'important');
          el.style.setProperty('bottom', 'auto', 'important');
        }
      }
    });
  }
  
  // Apply responsive sizing after all config is applied
  applyResponsiveSizing();
}

setInterval(fetchScoreboard, 1000);
fetchScoreboard();

// Add resize event listener for dynamic sizing
window.addEventListener('resize', () => {
  applyResponsiveSizing();
  // Re-fetch to reapply all sizing calculations
  fetchScoreboard();
});

// Apply initial responsive sizing
window.addEventListener('DOMContentLoaded', () => {
  applyResponsiveSizing();
});
