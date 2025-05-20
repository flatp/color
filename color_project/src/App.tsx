import { useState, useEffect } from 'react';
import './App.css';

function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }

  return [h, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h / 360 + 1 / 3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, h / 360 - 1 / 3);
  }

  return [r, g, b].map(x =>
    Math.round(x * 255).toString(16).padStart(2, '0')
  ).join('');
}

function getTriad(hex: string): string[] {
  const [h, s, l] = hexToHSL(hex);
  return [
    `#${hslToHex((h + 120) % 360, s, l)}`,
    `#${hslToHex((h + 240) % 360, s, l)}`
  ];
}

function getDiad(hex: string): string[] {
  const [h, s, l] = hexToHSL(hex);
  return [`#${hslToHex((h + 180) % 360, s, l)}`];
}

function App() {
  useEffect(() => {
    document.title = "Color Harmony Viewer";
  }, []);
  const [color, setColor] = useState('#3366cc');
  const triads = getTriad(color);
  const diads = getDiad(color);

  const renderBox = (hex: string, label: string) => (
    <div className="color-wrapper">
      <div className="color-box" style={{ backgroundColor: hex }}></div>
      <div className="color-label">{label}<br />{hex}</div>
    </div>
  );

  return (
    <div className="container">
      <h1>🎨 Color Harmony Viewer</h1>

      <div className="color-picker">
        <label htmlFor="colorInput" className="select">Select Color: </label>
        <input
          type="color"
          id="colorInput"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <div className="current-color-code">{color}</div>
      </div>

      <div className="section">
        <h2>ダイアード</h2>
        <div className="color-grid single">
          {renderBox(diads[0], 'Dyad')}
        </div>
      </div>

      <div className="section">
        <h2>トライアド</h2>
        <div className="color-grid">
          {renderBox(triads[0], 'Triad 1')}
          {renderBox(triads[1], 'Triad 2')}
        </div>
      </div>
    </div>
  );
}

export default App;