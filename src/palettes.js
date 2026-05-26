// Curated palettes for LOEN LULLABY.
// Each entry: hero color goes first in the swatch chip; that order is also
// what TweakColor displays.
const LL_PALETTES = {
  'sand-surf': {
    label: 'Sand & Surf',
    sand:        '#EFE6D3',
    sandDeep:    '#E3D7BD',
    cream:       '#F7F0DF',
    ink:         '#1E2528',
    inkSoft:     '#3A4144',
    accent:      '#C97A4B',
    accentDeep:  '#A55E33',
    water:       '#2F6B73',
    waterDeep:   '#1F4F56',
    rule:        'rgba(30,37,40,.14)',
  },
  'dusk': {
    label: 'Dusk',
    sand:        '#E8D9D2',
    sandDeep:    '#D6C2BA',
    cream:       '#F0E3DC',
    ink:         '#231B26',
    inkSoft:     '#403247',
    accent:      '#B5566B',
    accentDeep:  '#8E3A4C',
    water:       '#3A3258',
    waterDeep:   '#28224A',
    rule:        'rgba(35,27,38,.16)',
  },
  'citrus-sea': {
    label: 'Citrus & Sea',
    sand:        '#F2EAD2',
    sandDeep:    '#E5DBBC',
    cream:       '#FAF3DE',
    ink:         '#1A2A2E',
    inkSoft:     '#384A4F',
    accent:      '#D89A3E',
    accentDeep:  '#B27A22',
    water:       '#5A9B92',
    waterDeep:   '#3F7F76',
    rule:        'rgba(26,42,46,.14)',
  },
};

// Each palette card shows in the TweakColor as [hero, ink, accent, water]
function paletteToChip(p) {
  return [p.sand, p.ink, p.accent, p.water];
}

function applyPalette(p) {
  const r = document.documentElement.style;
  r.setProperty('--sand',       p.sand);
  r.setProperty('--sand-deep',  p.sandDeep);
  r.setProperty('--cream',      p.cream);
  r.setProperty('--ink',        p.ink);
  r.setProperty('--ink-soft',   p.inkSoft);
  r.setProperty('--accent',     p.accent);
  r.setProperty('--accent-deep',p.accentDeep);
  r.setProperty('--water',      p.water);
  r.setProperty('--water-deep', p.waterDeep);
  r.setProperty('--rule',       p.rule);
}

Object.assign(window, { LL_PALETTES, paletteToChip, applyPalette });
