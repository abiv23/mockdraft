// src/data/teamColors.js

// Function to darken a hex color by reducing lightness
function darkenColor(hex, percent = 0.3) {
    // Remove # if present and convert to RGB
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
  
    // Convert RGB to HSL for easier manipulation
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
  
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h, s, l = (max + min) / 2;
  
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }
  
    // Darken by reducing lightness (30% reduction)
    l = Math.max(0, l - (l * percent));
    if (s === 0) l = Math.max(0, Math.min(1, l)); // Handle grayscale
  
    // Convert back to RGB
    let rNew, gNew, bNew;
    if (s === 0) {
      rNew = gNew = bNew = l * 255;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
  
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      rNew = hue2rgb(p, q, h + 1/3) * 255;
      gNew = hue2rgb(p, q, h) * 255;
      bNew = hue2rgb(p, q, h - 1/3) * 255;
    }
  
    // Convert back to hex
    const toHex = (c) => {
      const hex = Math.round(c).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
  
    return `#${toHex(rNew)}${toHex(gNew)}${toHex(bNew)}`;
  }
  
  const teamColors = {
    'Cardinals': darkenColor('#97233F'),    // Darkened Arizona Cardinals (darker red)
    'Falcons': darkenColor('#A71930'),      // Darkened Atlanta Falcons (darker red)
    'Ravens': darkenColor('#241773'),       // Darkened Baltimore Ravens (darker purple)
    'Bills': darkenColor('#00338D'),        // Darkened Buffalo Bills (darker blue)
    'Panthers': darkenColor('#0085CA'),     // Darkened Carolina Panthers (darker blue)
    'Bears': darkenColor('#0B162A'),        // Darkened Chicago Bears (darker navy)
    'Bengals': darkenColor('#FB4F14'),      // Darkened Cincinnati Bengals (darker orange)
    'Browns': darkenColor('#311D00'),       // Darkened Cleveland Browns (darker brown)
    'Cowboys': darkenColor('#0033A0'),      // Darkened Dallas Cowboys (darker blue)
    'Broncos': darkenColor('#FB4F14'),      // Darkened Denver Broncos (darker orange)
    'Lions': darkenColor('#0076B6'),        // Darkened Detroit Lions (darker blue)
    'Packers': darkenColor('#203731'),      // Darkened Green Bay Packers (darker green)
    'Texans': darkenColor('#03202F'),       // Darkened Houston Texans (darker navy)
    'Colts': darkenColor('#002C5F'),        // Darkened Indianapolis Colts (darker blue)
    'Jaguars': darkenColor('#006778'),      // Darkened Jacksonville Jaguars (darker teal)
    'Chiefs': darkenColor('#E31837'),       // Darkened Kansas City Chiefs (darker red)
    'Raiders': darkenColor('#000000', 0.2), // Darkened Las Vegas Raiders (slightly lighter black to avoid pure black)
    'Chargers': darkenColor('#002A5E'),     // Darkened Los Angeles Chargers (darker navy)
    'Rams': darkenColor('#0033A0'),         // Darkened Los Angeles Rams (darker blue)
    'Dolphins': darkenColor('#008E97'),     // Darkened Miami Dolphins (darker teal)
    'Vikings': darkenColor('#4F2683'),      // Darkened Minnesota Vikings (darker purple)
    'Patriots': darkenColor('#002244', 0.2), // Darkened New England Patriots (slightly lighter navy)
    'Saints': darkenColor('#D3BC8D', 0.4),  // Darkened New Orleans Saints (lighter gold to ensure contrast with text)
    'Giants': darkenColor('#0B2265'),       // Darkened New York Giants (darker blue)
    'Jets': darkenColor('#125740'),         // Darkened New York Jets (darker green)
    'Eagles': darkenColor('#004C54'),       // Darkened Philadelphia Eagles (darker midnight green)
    'Steelers': darkenColor('#FFB612', 0.4), // Darkened Pittsburgh Steelers (lighter yellow for contrast)
    '49ers': darkenColor('#AA0000'),        // Darkened San Francisco 49ers (darker red)
    'Seahawks': darkenColor('#002244', 0.2), // Darkened Seattle Seahawks (slightly lighter navy)
    'Buccaneers': darkenColor('#D50A0A'),   // Darkened Tampa Bay Buccaneers (darker red)
    'Titans': darkenColor('#0C2340'),       // Darkened Tennessee Titans (darker navy)
    'Commanders': darkenColor('#773141'),   // Darkened Washington Commanders (darker burgundy)
  };
  
  export default teamColors;