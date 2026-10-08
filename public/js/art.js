/**
 * Every illustration in the game is inline SVG generated here. Nothing is
 * fetched, so the art works offline and stays sharp on any screen.
 *
 * Each entry returns an SVG string. `uid` keeps gradient/filter ids unique when
 * several are placed on one page.
 */

let seq = 0;
const uid = () => `q${(seq += 1)}`;

/* --------------------------------- buddy ---------------------------------- */

/**
 * The mascot. `mood` changes the face: happy, cheer, think, sad, wow.
 */
export function buddy(mood = 'happy', size = 120) {
  const eyes = {
    happy: '<circle cx="44" cy="50" r="5" fill="#1f2937"/><circle cx="76" cy="50" r="5" fill="#1f2937"/>',
    cheer: '<path d="M39 53q5-8 10 0" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M71 53q5-8 10 0" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/>',
    think: '<circle cx="44" cy="50" r="5" fill="#1f2937"/><path d="M72 53q4-7 9-1" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/>',
    sad: '<path d="M39 54q5-6 10 0" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M71 54q5-6 10 0" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/>',
    wow: '<circle cx="44" cy="49" r="7" fill="#1f2937"/><circle cx="76" cy="49" r="7" fill="#1f2937"/><circle cx="46" cy="46" r="2.5" fill="#fff"/><circle cx="78" cy="46" r="2.5" fill="#fff"/>',
  }[mood] || '';

  const mouths = {
    happy: '<path d="M46 66q14 14 28 0" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/>',
    cheer: '<path d="M44 64h32a4 4 0 0 1 0 12H50a16 16 0 0 1-6-12z" fill="#ef4444"/>',
    think: '<path d="M52 70h16" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/>',
    sad: '<path d="M46 74q14-10 28 0" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/>',
    wow: '<ellipse cx="60" cy="72" rx="9" ry="11" fill="#ef4444"/>',
  }[mood] || '';

  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="Buddy the helper">
    <ellipse cx="60" cy="112" rx="26" ry="5" fill="#0f172a" opacity=".12"/>
    <path d="M40 84q-8 10-6 22M80 84q8 10 6 22" stroke="#0ea5e9" stroke-width="7" stroke-linecap="round" fill="none"/>
    <rect x="34" y="52" width="52" height="42" rx="16" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>
    <rect x="40" y="60" width="40" height="24" rx="10" fill="#f0f9ff"/>
    <rect x="12" y="34" width="96" height="46" rx="20" fill="#fef08a" stroke="#facc15" stroke-width="3"/>
    <path d="M30 34q6-16 16-8M62 26q6-16 16-8" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${eyes}
    ${mouths}
  </svg>`;
}

/* --------------------------------- worlds --------------------------------- */

/**
 * A cartoon background per subject. `top`/`bottom` are the sky colours.
 */
export function world(name) {
  const skies = {
    city: ['#bae6fd', '#e0f2fe'],
    lab: ['#ddd6fe', '#ede9fe'],
    site: ['#fed7aa', '#ffedd5'],
    server: ['#a7f3d0', '#d1fae5'],
    studio: ['#fbcfe8', '#fce7f3'],
  };
  const [top, bottom] = skies[name] || skies.city;

  const backdrops = {
    city: `
      <rect x="0" y="120" width="400" height="180" fill="#cbd5e1"/>
      <g fill="#94a3b8"><rect x="10" y="70" width="60" height="230" rx="6"/><rect x="86" y="100" width="50" height="200" rx="6"/></g>
      <g fill="#64748b"><rect x="300" y="60" width="70" height="240" rx="6"/><rect x="230" y="110" width="50" height="190" rx="6"/></g>
      <g stroke="#38bdf8" stroke-width="2" opacity=".8">
        <path d="M120 40 L185 95M185 95 L120 95M185 95 L250 40" fill="none" stroke-dasharray="5 5"/>
      </g>
      <g><path d="M185 150V40" stroke="#475569" stroke-width="5"/><path d="M160 45h50" stroke="#475569" stroke-width="4"/>
      <circle cx="185" cy="42" r="7" fill="#f43f5e"/><circle cx="163" cy="47" r="5" fill="#f43f5e" opacity=".7"/><circle cx="207" cy="47" r="5" fill="#f43f5e" opacity=".7"/></g>`,
    lab: `
      <rect x="0" y="150" width="400" height="150" fill="#c4b5fd"/>
      <g fill="#a78bfa"><rect x="20" y="110" width="70" height="190" rx="10"/><rect x="310" y="120" width="70" height="180" rx="10"/></g>
      <g><circle cx="60" cy="90" r="18" fill="#22d3ee"/><circle cx="60" cy="90" r="8" fill="#0e7490"/>
      <path d="M42 130h36v40H42z" fill="#7dd3fc"/><path d="M46 150h28" stroke="#0369a1" stroke-width="3"/></g>
      <g><rect x="300" y="150" width="90" height="70" rx="10" fill="#f8fafc" stroke="#7c3aed" stroke-width="3"/>
      <circle cx="322" cy="172" r="7" fill="#f43f5e"/><circle cx="345" cy="172" r="7" fill="#facc15"/><circle cx="368" cy="172" r="7" fill="#22c55e"/>
      <path d="M312 200h66" stroke="#7c3aed" stroke-width="3"/></g>`,
    site: `
      <rect x="0" y="170" width="400" height="130" fill="#fdba74"/>
      <path d="M40 300 L120 120 L200 300z" fill="#f97316"/><path d="M230 300 L310 140 L390 300z" fill="#fb923c"/>
      <g stroke="#7c2d12" stroke-width="5"><path d="M110 210h180" /><path d="M110 240h180"/></g>
      <g><rect x="250" y="70" width="70" height="120" rx="8" fill="#fef3c7" stroke="#7c2d12" stroke-width="3"/>
      <path d="M250 90h70M250 115h70M250 140h70" stroke="#7c2d12" stroke-width="3"/></g>
      <circle cx="70" cy="50" r="26" fill="#fde047"/>`,
    server: `
      <rect x="0" y="160" width="400" height="140" fill="#6ee7b7"/>
      <g><rect x="30" y="60" width="90" height="240" rx="10" fill="#1e293b"/>
      <g fill="#34d399"><rect x="42" y="75" width="66" height="10" rx="4"/><rect x="42" y="95" width="66" height="10" rx="4"/>
      <rect x="42" y="115" width="66" height="10" rx="4"/><rect x="42" y="135" width="66" height="10" rx="4"/></g></g>
      <g><rect x="150" y="60" width="90" height="240" rx="10" fill="#334155"/>
      <g fill="#facc15"><rect x="162" y="75" width="66" height="10" rx="4"/><rect x="162" y="95" width="66" height="10" rx="4"/>
      <rect x="162" y="115" width="66" height="10" rx="4"/></g></g>
      <g><rect x="270" y="90" width="90" height="210" rx="10" fill="#0f172a"/>
      <g fill="#38bdf8"><circle cx="295" cy="115" r="6"/><circle cx="320" cy="115" r="6"/>
      <rect x="282" y="140" width="66" height="9" rx="4"/><rect x="282" y="160" width="66" height="9" rx="4"/></g></g>`,
    studio: `
      <rect x="0" y="160" width="400" height="140" fill="#f9a8d4"/>
      <g><rect x="25" y="120" width="130" height="80" rx="8" fill="#fff" stroke="#db2777" stroke-width="3"/>
      <circle cx="60" cy="145" r="12" fill="#f472b6"/><path d="M85 140h55M85 155h40M40 175h95" stroke="#db2777" stroke-width="3"/></g>
      <g><rect x="180" y="90" width="70" height="70" rx="8" fill="#fde68a" stroke="#db2777" stroke-width="3"/>
      <path d="M195 110h40M195 125h30M195 140h35" stroke="#b45309" stroke-width="3"/></g>
      <g><rect x="270" y="130" width="100" height="70" rx="8" fill="#fff" stroke="#db2777" stroke-width="3"/>
      <path d="M285 180l25-28 18 18 12-10 15 20z" fill="#a78bfa"/></g>
      <circle cx="330" cy="50" r="22" fill="#fde047"/>`,
  };

  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" class="world-art" aria-hidden="true">
    <defs><linearGradient id="${uid()}sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/>
    </linearGradient></defs>
    <rect width="400" height="300" fill="url(#${uid()}sky)"/>
    <g fill="#fff" opacity=".75" class="drift">
      <ellipse cx="70" cy="60" rx="34" ry="16"/><ellipse cx="95" cy="52" rx="26" ry="20"/>
      <ellipse cx="300" cy="90" rx="40" ry="18"/><ellipse cx="330" cy="82" rx="28" ry="22"/>
    </g>
    ${backdrops[name] || backdrops.city}
  </svg>`;
}

/* ------------------------------- mini scenes ------------------------------ */

/**
 * One illustration per question. These are deliberately simple, high-contrast
 * cartoons: a shape or two that capture the idea being explained.
 */
const SCENES = {
  'los-nlos': () => `
    <rect x="20" y="110" width="160" height="70" rx="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="3"/>
    <path d="M100 118 L175 55" stroke="#22c55e" stroke-width="5" stroke-dasharray="8 6"/>
    <text x="52" y="165" fill="#166534" font-size="15" font-weight="700">LOS: clear</text>
    <rect x="220" y="110" width="160" height="70" rx="8" fill="#fee2e2" stroke="#ef4444" stroke-width="3"/>
    <rect x="290" y="70" width="34" height="110" rx="6" fill="#94a3b8"/>
    <path d="M240 118q30-40 60 8" stroke="#f59e0b" stroke-width="4" fill="none"/>
    <path d="M300 55q-30-30-60 0" stroke="#f59e0b" stroke-width="4" fill="none" stroke-dasharray="6 5"/>
    <text x="246" y="165" fill="#991b1b" font-size="15" font-weight="700">NLOS: blocked</text>`,

  pathloss: () => `
    <g><path d="M45 175V70" stroke="#475569" stroke-width="7"/><circle cx="45" cy="62" r="11" fill="#f43f5e"/></g>
    ${[[120, 30], [200, 17], [280, 10], [355, 6]].map(([x, r], i) => `
      <circle cx="${x}" cy="118" r="${r}" fill="#38bdf8" opacity="${0.85 - i * 0.15}"/>`).join('')}
    <rect x="330" y="86" width="52" height="64" rx="6" fill="#94a3b8"/>
    <path d="M120 200q90-16 180 0" stroke="#f59e0b" stroke-width="4" fill="none" stroke-dasharray="7 6"/>
    <text x="30" y="225" fill="#334155" font-size="15" font-weight="700">weaker as distance grows</text>`,

  multipath: () => `
    <rect x="18" y="80" width="46" height="100" rx="8" fill="#0ea5e9"/>
    <rect x="336" y="70" width="46" height="110" rx="8" fill="#8b5cf6"/>
    <rect x="180" y="60" width="42" height="120" rx="6" fill="#94a3b8"/>
    <path d="M64 96 L176 62" stroke="#f59e0b" stroke-width="4"/>
    <path d="M64 118 L178 116" stroke="#22c55e" stroke-width="4"/>
    <path d="M64 140 L176 172" stroke="#ef4444" stroke-width="4"/>
    <path d="M224 108 L334 92" stroke="#f59e0b" stroke-width="4"/>
    <path d="M224 132 L334 118" stroke="#22c55e" stroke-width="4"/>
    <path d="M224 160 L334 164" stroke="#ef4444" stroke-width="4"/>`,

  interference: () => `
    <g><rect x="22" y="95" width="60" height="70" rx="10" fill="#38bdf8"/><path d="M34 118h36M34 132h36" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>
    <g><rect x="318" y="95" width="60" height="70" rx="10" fill="#38bdf8"/><path d="M330 118h36M330 132h36" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>
    <path d="M84 130h232" stroke="#ef4444" stroke-width="6" stroke-dasharray="14 10"/>
    <path d="M150 96l50 68M250 96l-50 68" stroke="#f59e0b" stroke-width="5" opacity=".85"/>
    <text x="140" y="200" fill="#991b1b" font-size="16" font-weight="700">overlapping = mess</text>`,

  handover: () => `
    <g><path d="M70 190V60" stroke="#475569" stroke-width="8"/><path d="M48 66h44" stroke="#475569" stroke-width="6"/>
    <circle cx="70" cy="58" r="12" fill="#38bdf8"/></g>
    <g><path d="M320 190V95" stroke="#475569" stroke-width="8"/><path d="M298 101h44" stroke="#475569" stroke-width="6"/>
    <circle cx="320" cy="93" r="12" fill="#f43f5e"/></g>
    <rect x="186" y="128" width="34" height="46" rx="8" fill="#facc15" stroke="#a16207" stroke-width="3"/>
    <circle cx="203" cy="142" r="4" fill="#a16207"/><path d="M198 168h10" stroke="#a16207" stroke-width="3"/>
    <path d="M96 90q54 34 88 52" stroke="#22c55e" stroke-width="4" fill="none" stroke-dasharray="8 6"/>
    <path d="M296 118q-52 30-92 50" stroke="#22c55e" stroke-width="4" fill="none" stroke-dasharray="8 6"/>
    <path d="M182 150l-16 10M212 150l16 10" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>`,

  callsetup: () => `
    <g><rect x="18" y="150" width="46" height="70" rx="9" fill="#1e293b"/>
    <rect x="24" y="112" width="34" height="42" rx="6" fill="#38bdf8"/>
    <circle cx="41" cy="133" r="5" fill="#fff"/><path d="M26 124h30M26 133h16" stroke="#fff" stroke-width="3"/></g>
    <path d="M70 130h44" stroke="#f59e0b" stroke-width="4" stroke-dasharray="7 6"/>
    <g><rect x="120" y="80" width="160" height="100" rx="14" fill="#fde68a" stroke="#a16207" stroke-width="3"/>
    <text x="145" y="118" fill="#78350f" font-size="14" font-weight="700">network</text>
    <g fill="#b45309">${[0, 1, 2].map((i) => `<rect x="${138 + i * 42}" y="132" width="32" height="30" rx="6"/>`).join('')}</g></g>
    <path d="M280 130h40" stroke="#f59e0b" stroke-width="4" stroke-dasharray="7 6"/>
    <g><rect x="326" y="150" width="46" height="70" rx="9" fill="#1e293b"/>
    <rect x="332" y="112" width="34" height="42" rx="6" fill="#22c55e"/>
    <circle cx="349" cy="133" r="5" fill="#fff"/><path d="M334 124h30M334 133h16" stroke="#fff" stroke-width="3"/></g>`,

  roaming: () => `
    <path d="M60 200h180l-24-42H84z" fill="#fcd34d" stroke="#b45309" stroke-width="3"/>
    <path d="M96 158V96h108v62" fill="#fff" stroke="#b45309" stroke-width="3"/>
    <circle cx="150" cy="130" r="16" fill="#38bdf8" stroke="#0369a1" stroke-width="3"/>
    <path d="M150 100V76M150 76l40 12-40 12z" fill="#ef4444"/>
    <text x="250" y="120" fill="#166534" font-size="16" font-weight="700">your SIM</text>
    <path d="M296 150q30-40 60 0" stroke="#22c55e" stroke-width="5" fill="none" stroke-dasharray="9 7"/>
    <text x="284" y="196" fill="#166534" font-size="14" font-weight="700">works abroad</text>`,

  simcard: () => `
    <g transform="rotate(-8 200 140)">
      <path d="M110 80h150l40 40v100a12 12 0 0 1-12 12H110a12 12 0 0 1-12-12V92a12 12 0 0 1 12-12z" fill="#fcd34d" stroke="#b45309" stroke-width="4"/>
      <rect x="126" y="106" width="84" height="60" rx="6" fill="#fde68a" stroke="#b45309" stroke-width="3"/>
      ${[0, 1, 2, 3, 4].map((r) => [0, 1, 2].map((c) => `<rect x="${138 + c * 24}" y="${116 + r * 10}" width="14" height="5" rx="2" fill="#92400e"/>`).join('')).join('')}
      <rect x="228" y="106" width="48" height="48" rx="6" fill="#a16207"/>
      <path d="M228 190h48" stroke="#92400e" stroke-width="6" stroke-linecap="round"/>
    </g>
    <text x="112" y="262" fill="#78350f" font-size="16" font-weight="700">who you are</text>`,

  edgeai: () => `
    <g><rect x="24" y="140" width="76" height="60" rx="10" fill="#1e293b"/>
    <circle cx="62" cy="170" r="14" fill="#38bdf8"/></g>
    <path d="M104 170h56" stroke="#22c55e" stroke-width="5" stroke-dasharray="8 6"/>
    <g><rect x="164" y="120" width="86" height="100" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="4"/>
    <text x="180" y="160" fill="#7dd3fc" font-size="15" font-weight="700">EDGE</text>
    <g fill="#34d399"><circle cx="180" cy="182" r="5"/><circle cx="207" cy="182" r="5"/></g>
    <path d="M176 204h62" stroke="#7dd3fc" stroke-width="4"/></g>
    <path d="M254 170h44" stroke="#22c55e" stroke-width="5" stroke-dasharray="8 6"/>
    <g><path d="M312 110q26 0 26 26t-26 26-26-26 26-26z" fill="#a78bfa"/>
    <circle cx="303" cy="126" r="4" fill="#fff"/><circle cx="321" cy="126" r="4" fill="#fff"/></g>
    <text x="24" y="252" fill="#334155" font-size="14" font-weight="700">near you, not far away</text>`,

  '5g': () => `
    <g><path d="M120 200V64" stroke="#334155" stroke-width="9"/><path d="M92 70h56" stroke="#334155" stroke-width="7"/></g>
    ${[1, 2, 3].map((i) => `<path d="M${104 - i * 9} 46q${34 + i * 16} 18 ${34 + i * 16} 40" stroke="#38bdf8" stroke-width="5" fill="none" opacity="${0.9 - i * 0.22}"/>`).join('')}
    ${[1, 2].map((i) => `<path d="M${136 + i * 9} 46q-${34 + i * 16} 18 -${34 + i * 16} 40" stroke="#38bdf8" stroke-width="5" fill="none" opacity="${0.9 - i * 0.22}"/>`).join('')}
    <g><rect x="248" y="120" width="120" height="70" rx="12" fill="#f1f5f9" stroke="#334155" stroke-width="4"/>
    <rect x="262" y="136" width="60" height="12" rx="4" fill="#38bdf8"/>
    <rect x="262" y="158" width="88" height="10" rx="4" fill="#cbd5e1"/></g>
    <text x="40" y="238" fill="#0f172a" font-size="17" font-weight="800">5G</text>`,

  kmeans: () => `
    ${[[110, 70, '#ef4444'], [110, 165, '#ef4444'], [250, 80, '#3b82f6'], [250, 175, '#3b82f6'], [330, 125, '#22c55e']]
      .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="13" fill="${c}"/>`).join('')}
    <g fill="none" stroke-width="3" stroke-dasharray="6 5">
      <circle cx="112" cy="118" r="52" stroke="#ef4444"/>
      <circle cx="252" cy="128" r="52" stroke="#3b82f6"/>
    </g>
    <g><path d="M112 118m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0" fill="#b91c1c"/>
    <path d="M252 128m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0" fill="#1d4ed8"/></g>
    <text x="120" y="222" fill="#334155" font-size="14" font-weight="700">group by closeness</text>`,

  apriori: () => `
    <g><rect x="40" y="60" width="88" height="130" rx="10" fill="#fde68a" stroke="#b45309" stroke-width="3"/>
    <text x="58" y="86" fill="#78350f" font-size="13" font-weight="700">basket 1</text>
    <g fill="#f59e0b">${[0, 1, 2, 3].map((i) => `<circle cx="${70 + (i % 2) * 40}" cy="${108 + Math.floor(i / 2) * 34}" r="13"/>`).join('')}</g>
    <g><rect x="156" y="60" width="88" height="130" rx="10" fill="#fde68a" stroke="#b45309" stroke-width="3"/>
    <text x="174" y="86" fill="#78350f" font-size="13" font-weight="700">basket 2</text>
    <g fill="#f59e0b">${[0, 1, 3].map((i) => `<circle cx="${186 + (i % 2) * 40}" cy="${108 + Math.floor(i / 2) * 34}" r="13"/>`).join('')}</g></g>
    <g><rect x="272" y="60" width="88" height="130" rx="10" fill="#fde68a" stroke="#b45309" stroke-width="3"/>
    <text x="290" y="86" fill="#78350f" font-size="13" font-weight="700">basket 3</text>
    <g fill="#f59e0b">${[0, 1, 3].map((i) => `<circle cx="${302 + (i % 2) * 40}" cy="${108 + Math.floor(i / 2) * 34}" r="13"/>`).join('')}</g></g>
    <path d="M84 196q136 40 264 0" stroke="#8b5cf6" stroke-width="4" fill="none" stroke-dasharray="8 6"/>
    <text x="120" y="228" fill="#5b21b6" font-size="14" font-weight="700">items that appear together</text>`,

  pca: () => `
    <g><ellipse cx="140" cy="130" rx="105" ry="70" fill="#ddd6fe" stroke="#7c3aed" stroke-width="3"/>
    <g fill="#8b5cf6">${[[95, 105], [120, 150], [165, 95], [180, 145], [140, 130], [200, 120], [110, 125], [160, 165]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6"/>`).join('')}</g></g>
    <g><ellipse cx="312" cy="130" rx="55" ry="42" fill="#fecdd3" stroke="#e11d48" stroke-width="3"/>
    <g fill="#e11d48">${[[290, 118], [312, 145], [332, 112], [318, 160], [300, 140]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6"/>`).join('')}</g></g>
    <path d="M250 130h56" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
    <path d="M296 122l12 8-12 8" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="248" y="205" fill="#334155" font-size="14" font-weight="700">squash onto one axis</text>`,

  crossval: () => `
    ${[0, 1, 2, 3].map((i) => `
      <rect x="${24 + i * 92}" y="60" width="84" height="130" rx="10" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>
      <text x="${34 + i * 92}" y="84" fill="#075985" font-size="12" font-weight="700">fold ${i + 1}</text>
      ${[0, 1, 2, 3, 4].map((j) => `<rect x="${34 + i * 92}" y="${94 + j * 19}" width="64" height="13" rx="3"
        fill="${j === i ? '#f97316' : '#7dd3fc'}"/>`).join('')}
    `).join('')}
    <text x="100" y="220" fill="#c2410c" font-size="14" font-weight="700">each fold tests the others</text>`,

  confusion: () => `
    <g font-size="15" font-weight="700" fill="#0f172a">
      <text x="96" y="52">Pred +</text><text x="216" y="52">Pred -</text>
      <text x="22" y="104">Act +</text><text x="22" y="184">Act -</text>
    </g>
    ${[['#22c55e', 92, 66], ['#f97316', 212, 66], ['#ef4444', 92, 146], ['#38bdf8', 212, 146]].map(([c, x, y]) =>
      `<rect x="${x}" y="${y}" width="104" height="70" rx="10" fill="${c}"/>`).join('')}
    ${[['TP', 118, 110], ['FP', 238, 110], ['FN', 118, 190], ['TN', 238, 190]].map(([t, x, y]) =>
      `<text x="${x}" y="${y}" fill="#fff" font-size="22" font-weight="800">${t}</text>`).join('')}
    <text x="92" y="248" fill="#334155" font-size="14" font-weight="700">counts of every outcome</text>`,

  overfit: () => `
    <g><rect x="24" y="60" width="170" height="140" rx="10" fill="#fee2e2" stroke="#dc2626" stroke-width="3"/>
    <text x="40" y="86" fill="#991b1b" font-size="14" font-weight="700">overfit</text>
    <path d="M36 186q22-40 42-4t42-56 46 20" stroke="#dc2626" stroke-width="4" fill="none"/></g>
    <g><rect x="206" y="60" width="170" height="140" rx="10" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>
    <text x="222" y="86" fill="#1e3a8a" font-size="14" font-weight="700">underfit</text>
    <path d="M218 178 L258 120 L298 150 L338 100 L364 116" stroke="#2563eb" stroke-width="4" fill="none"/></g>
    <text x="60" y="238" fill="#334155" font-size="14" font-weight="700">too tight vs too loose</text>`,

  tuning: () => `
    <g stroke="#94a3b8" stroke-width="3">${[0, 1, 2].map((r) => `<path d="M60 ${100 + r * 40}h290"/>`).join('')}
    ${[0, 1, 2, 3, 4, 5].map((c) => `<path d="M${70 + c * 56} 92v104"/>`).join('')}</g>
    ${[[0, 0], [1, 2], [2, 1], [3, 3], [4, 0], [5, 2]].map(([c, r]) =>
      `<circle cx="${70 + c * 56}" cy="${100 + r * 40}" r="7" fill="#8b5cf6" opacity=".45"/>`).join('')}
    <circle cx="70" cy="60" r="11" fill="#f97316" stroke="#fff" stroke-width="3"/>
    <text x="92" y="66" fill="#c2410c" font-size="14" font-weight="700">best</text>
    <text x="60" y="238" fill="#334155" font-size="14" font-weight="700">search many settings</text>`,

  risk: () => `
    <path d="M200 44 L340 200 H60z" fill="#fde68a" stroke="#b45309" stroke-width="4" stroke-linejoin="round"/>
    <text x="188" y="160" fill="#78350f" font-size="72" font-weight="800">!</text>
    <text x="120" y="238" fill="#334155" font-size="15" font-weight="700">spot it before it hurts</text>`,

  scm: () => `
    <g><rect x="30" y="70" width="120" height="70" rx="10" fill="#ffedd5" stroke="#c2410c" stroke-width="3"/>
    <text x="52" y="112" fill="#9a3412" font-size="15" font-weight="700">version 1</text></g>
    <g><rect x="30" y="155" width="120" height="70" rx="10" fill="#ffedd5" stroke="#c2410c" stroke-width="3"/>
    <text x="52" y="197" fill="#9a3412" font-size="15" font-weight="700">version 2</text></g>
    <path d="M156 105h64M156 190h64" stroke="#c2410c" stroke-width="4"/>
    <g><rect x="226" y="90" width="150" height="110" rx="12" fill="#fed7aa" stroke="#c2410c" stroke-width="4"/>
    <text x="262" y="135" fill="#9a3412" font-size="17" font-weight="800">repository</text>
    <path d="M252 165h98" stroke="#c2410c" stroke-width="4" stroke-linecap="round"/></g>
    <text x="120" y="248" fill="#334155" font-size="14" font-weight="700">every change saved</text>`,

  testing: () => `
    ${['unit', 'integration', 'system', 'acceptance'].map((n, i) => `
      <g transform="translate(${22 + i * 92} 70)">
        <rect width="80" height="70" y="${i * 22}" rx="10" fill="#ffedd5" stroke="#c2410c" stroke-width="3"/>
        <path d="M26 ${34 + i * 22}v14" stroke="#c2410c" stroke-width="5" stroke-linecap="round"/>
        <circle cx="26" cy="${52 + i * 22}" r="6" fill="#c2410c"/>
        <circle cx="26" cy="${24 + i * 22}" r="6" fill="#c2410c"/>
        <path d="M26 ${18 + i * 22}v0" stroke="#c2410c" stroke-width="5"/>
      </g>`).join('')}
    <text x="66" y="248" fill="#334155" font-size="14" font-weight="700">bigger pieces, one at a time</text>`,

  sqa: () => `
    <g><path d="M200 46l40 14v42c0 34-22 58-40 66-18-8-40-32-40-66V60z" fill="#dcfce7" stroke="#15803d" stroke-width="4"/>
    <path d="M178 122l16 18 32-36" stroke="#15803d" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
    <text x="110" y="230" fill="#166534" font-size="15" font-weight="700">quality is planned, not hoped</text>`,

  maintenance: () => `
    <g><rect x="60" y="150" width="130" height="70" rx="10" fill="#ffedd5" stroke="#c2410c" stroke-width="3"/>
    <path d="M120 150V90" stroke="#c2410c" stroke-width="8"/>
    <path d="M92 100h56" stroke="#c2410c" stroke-width="8" stroke-linecap="round"/></g>
    <g transform="rotate(28 232 176)">
      <rect x="196" y="146" width="140" height="26" rx="8" fill="#fdba74" stroke="#c2410c" stroke-width="3"/>
      <rect x="316" y="140" width="34" height="38" rx="6" fill="#c2410c"/></g>
    <text x="80" y="248" fill="#9a3412" font-size="15" font-weight="700">fix, adapt, prevent, improve</text>`,

  reengineering: () => `
    <g><rect x="30" y="90" width="110" height="100" rx="10" fill="#e2e8f0" stroke="#475569" stroke-width="3"/>
    <text x="52" y="130" fill="#334155" font-size="13" font-weight="700">old</text>
    <path d="M52 152h66M52 168h50" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/></g>
    <path d="M148 140h56" stroke="#22c55e" stroke-width="5" stroke-dasharray="9 7"/>
    <g><rect x="212" y="90" width="110" height="100" rx="10" fill="#dcfce7" stroke="#15803d" stroke-width="3"/>
    <text x="228" y="130" fill="#166534" font-size="13" font-weight="700">new</text>
    <path d="M228 152h72M228 168h60" stroke="#22c55e" stroke-width="5" stroke-linecap="round"/></g>
    <text x="86" y="228" fill="#166534" font-size="15" font-weight="700">same job, better inside</text>`,

  agile: () => `
    <path d="M330 70 L378 200 H282z" fill="#fed7aa" stroke="#c2410c" stroke-width="4" stroke-linejoin="round"/>
    <text x="316" y="160" fill="#7c2d12" font-size="30" font-weight="800">A</text>
    <g transform="translate(40 60)">
      <circle cx="60" cy="60" r="34" fill="#fff" stroke="#c2410c" stroke-width="4"/>
      <path d="M42 74a22 22 0 0 1 36 0z" fill="#f97316"/>
      <circle cx="60" cy="52" r="10" fill="#c2410c"/>
    </g>
    <path d="M150 120q40-50 84-16" stroke="#22c55e" stroke-width="5" fill="none" stroke-dasharray="9 7"/>
    <text x="120" y="228" fill="#9a3412" font-size="15" font-weight="700">small steps, working software</text>`,

  scrum: () => `
    <g><rect x="150" y="52" width="200" height="52" rx="12" fill="#ffedd5" stroke="#c2410c" stroke-width="4"/>
    <text x="184" y="85" fill="#9a3412" font-size="16" font-weight="800">product backlog</text></g>
    <g><rect x="150" y="122" width="200" height="52" rx="12" fill="#fef3c7" stroke="#c2410c" stroke-width="4"/>
    <text x="186" y="155" fill="#9a3412" font-size="16" font-weight="800">sprint backlog</text></g>
    <g><rect x="150" y="192" width="200" height="52" rx="12" fill="#dcfce7" stroke="#15803d" stroke-width="4"/>
    <text x="196" y="225" fill="#166534" font-size="16" font-weight="800">increment</text></g>
    <path d="M110 100v146" stroke="#0ea5e9" stroke-width="5" stroke-dasharray="8 6"/>
    <text x="24" y="278" fill="#0369a1" font-size="15" font-weight="700">work flows down</text>`,

  mongodb: () => `
    <g><path d="M200 44q52 40 52 96v56h-104v-56q0-56 52-96z" fill="#22c55e" stroke="#166534" stroke-width="4"/>
    <path d="M200 44q-52 40-52 96v56h52z" fill="#4ade80" stroke="#166534" stroke-width="4"/>
    <path d="M148 148h104M148 176h104" stroke="#166534" stroke-width="4"/></g>
    <text x="118" y="252" fill="#166534" font-size="16" font-weight="700">documents, not tables</text>`,

  crud: () => {
    const ops = [['C', 'Create', '#22c55e'], ['R', 'Read', '#0ea5e9'], ['U', 'Update', '#f59e0b'], ['D', 'Delete', '#ef4444']];
    return `${ops.map(([l, n, c], i) => `
      <g transform="translate(${24 + (i % 2) * 190} ${52 + Math.floor(i / 2) * 100})">
        <rect width="172" height="82" rx="14" fill="${c}" opacity=".92"/>
        <text x="20" y="44" fill="#fff" font-size="30" font-weight="800">${l}</text>
        <text x="58" y="42" fill="#fff" font-size="19" font-weight="700">${n}</text>
      </g>`).join('')}<text x="118" y="268" fill="#334155" font-size="15" font-weight="700">the four basic data moves</text>`;
  },

  nodejs: () => `
    <path d="M200 40 L262 168 L200 128 L138 168z" fill="#22c55e" stroke="#166534" stroke-width="4" stroke-linejoin="round"/>
    <path d="M138 186 L200 146 L262 186 L200 246z" fill="#4ade80" stroke="#166534" stroke-width="4" stroke-linejoin="round"/>
    <text x="120" y="278" fill="#166534" font-size="15" font-weight="700">JavaScript on the server</text>`,

  repl: () => `
    <g><rect x="30" y="70" width="340" height="130" rx="12" fill="#0f172a"/>
    <text x="52" y="112" fill="#4ade80" font-size="20" font-family="monospace">&gt; node</text>
    <text x="52" y="146" fill="#e2e8f0" font-size="16" font-family="monospace">Welcome to Node.js</text>
    <text x="52" y="178" fill="#facc15" font-size="16" font-family="monospace">2 + 2</text></g>
    <text x="104" y="240" fill="#334155" font-size="15" font-weight="700">type, run, see, repeat</text>`,

  express: () => `
    <g stroke="#166534" stroke-width="6" fill="none" stroke-linecap="round">
      <path d="M40 70h130"/><path d="M40 120h200"/><path d="M40 170h100"/></g>
    ${[[170, 70], [240, 120], [140, 170]].map(([x, y]) =>
      `<circle cx="${x}" cy="${y}" r="13" fill="#22c55e" stroke="#166534" stroke-width="4"/>`).join('')}
    <rect x="286" y="52" width="94" height="160" rx="12" fill="#dcfce7" stroke="#166534" stroke-width="4"/>
    <path d="M306 92h54M306 122h54M306 152h34" stroke="#166534" stroke-width="5" stroke-linecap="round"/>
    <text x="88" y="248" fill="#166534" font-size="15" font-weight="700">paths lead to handlers</text>`,

  rest: () => `
    <g><rect x="20" y="52" width="150" height="60" rx="12" fill="#0ea5e9"/>
    <text x="60" y="90" fill="#fff" font-size="18" font-weight="800">client</text></g>
    <g><rect x="230" y="52" width="150" height="60" rx="12" fill="#22c55e"/>
    <text x="272" y="90" fill="#fff" font-size="18" font-weight="800">server</text></g>
    ${['GET', 'POST', 'PUT', 'DELETE'].map((m, i) => `
      <rect x="${28 + i * 90}" y="${148 + (i % 2) * 18}" width="78" height="36" rx="10" fill="#dcfce7" stroke="#166534" stroke-width="3"/>
      <text x="${38 + i * 90}" y="${172 + (i % 2) * 18}" fill="#166534" font-size="14" font-weight="800">${m}</text>`).join('')}
    <path d="M170 90q32 0 56 40M380 90q-32 0-56 40" stroke="#0ea5e9" stroke-width="4" fill="none" stroke-dasharray="8 6"/>
    <text x="96" y="268" fill="#334155" font-size="15" font-weight="700">URLs do the work</text>`,

  designthink: () => `
    ${['feel', 'define', 'idea', 'make', 'test'].map((n, i) => `
      <circle cx="${58 + i * 74}" cy="150" r="26" fill="#fce7f3" stroke="#db2777" stroke-width="4"/>
      <text x="${36 + i * 74}" y="157" fill="#831843" font-size="14" font-weight="800">${n}</text>
      ${i < 4 ? `<path d="M${86 + i * 74} 150h44" stroke="#db2777" stroke-width="4" marker-end="url(#ar)"/>` : ''}`).join('')}
    <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0 0l8 4-8 4z" fill="#db2777"/></marker></defs>
    <text x="100" y="230" fill="#831843" font-size="15" font-weight="700">think, make, learn, repeat</text>`,

  prototype: () => `
    <g><rect x="30" y="130" width="160" height="100" rx="10" fill="#f3f4f6" stroke="#6b7280" stroke-width="3"/>
    <path d="M48 165h124M48 190h90" stroke="#9ca3af" stroke-width="6" stroke-linecap="round"/></g>
    <path d="M196 180h56" stroke="#6b7280" stroke-width="4" stroke-dasharray="8 6"/>
    <g><rect x="258" y="110" width="130" height="130" rx="14" fill="#fce7f3" stroke="#db2777" stroke-width="4"/>
    <rect x="276" y="132" width="94" height="26" rx="6" fill="#f472b6"/>
    <rect x="276" y="170" width="60" height="20" rx="6" fill="#f9a8d4"/>
    <rect x="276" y="202" width="94" height="18" rx="6" fill="#fbcfe8"/></g>
    <text x="42" y="76" fill="#4b5563" font-size="15" font-weight="800">sketch</text>
    <text x="278" y="76" fill="#831843" font-size="15" font-weight="800">real thing</text>`,

  principles: () => `
    <g transform="translate(0 10)">
      ${[['contrast', '#ef4444'], ['repeat', '#22c55e'], ['align', '#0ea5e9'], ['proximity', '#a855f7'], ['balance', '#f59e0b']].map(([n, c], i) => `
        <g transform="translate(${28 + (i % 3) * 122} ${48 + Math.floor(i / 3) * 108})">
          <rect width="106" height="86" rx="14" fill="#fff" stroke="${c}" stroke-width="4"/>
          ${i === 0 ? `<circle cx="53" cy="36" r="20" fill="${c}"/><path d="M53 16v40" stroke="#fff" stroke-width="5"/>` : ''}
          ${i === 1 ? [0, 1, 2].map((j) => `<circle cx="${34 + j * 20}" cy="36" r="10" fill="${c}"/>`).join('') : ''}
          ${i === 2 ? `<path d="M22 30h62M22 46h62" stroke="${c}" stroke-width="7" stroke-linecap="round"/>` : ''}
          ${i === 3 ? `<circle cx="36" cy="36" r="11" fill="${c}"/><circle cx="70" cy="36" r="11" fill="${c}"/>` : ''}
          ${i === 4 ? `<rect x="20" y="24" width="66" height="9" rx="4" fill="${c}"/><rect x="46" y="38" width="40" height="9" rx="4" fill="${c}"/>` : ''}
          <text x="12" y="74" fill="#374151" font-size="13" font-weight="700">${n}</text>
        </g>`).join('')}</g>
    <text x="96" y="272" fill="#374151" font-size="14" font-weight="700">rules that make things clear</text>`,

  heuristics: () => `
    <g><rect x="26" y="52" width="348" height="200" rx="14" fill="#fff" stroke="#db2777" stroke-width="4"/>
    <g stroke="#db2777" stroke-width="4" stroke-linecap="round">
      <path d="M56 92h120M56 122h180M56 152h140M56 182h160M56 212h100"/></g>
    <g fill="#f472b6"><circle cx="330" cy="92" r="11"/><circle cx="330" cy="122" r="11"/>
    <circle cx="330" cy="152" r="11"/><circle cx="330" cy="182" r="11"/><circle cx="330" cy="212" r="11"/></g></g>
    <text x="92" y="284" fill="#831843" font-size="15" font-weight="700">simple rules that stop mistakes</text>`,

  usability: () => `
    <g><rect x="20" y="80" width="360" height="110" rx="14" fill="#f8fafc" stroke="#475569" stroke-width="3"/>
    <rect x="38" y="98" width="140" height="74" rx="8" fill="#e2e8f0"/>
    <g fill="#94a3b8">${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${48 + c * 32}" y="${108 + r * 21}" width="24" height="13" rx="3"/>`).join('')).join('')}</g>
    <g fill="#f472b6"><circle cx="222" cy="120" r="16"/><path d="M206 148h32v24h-32z"/></g>
    <rect x="266" y="98" width="94" height="74" rx="8" fill="#fff" stroke="#94a3b8" stroke-width="3"/>
    <path d="M280 122h64M280 142h44" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/></g>
    <path d="M250 140q30-30 60 0" stroke="#db2777" stroke-width="4" fill="none" stroke-dasharray="7 6"/>
    <text x="106" y="240" fill="#475569" font-size="15" font-weight="700">watch real people try it</text>`,

  uxmetrics: () => `
    ${[['time', '#0ea5e9'], ['errors', '#ef4444'], ['success', '#22c55e'], ['happy', '#f59e0b']].map(([n, c], i) => `
      <g transform="translate(${28 + i * 92} 84)">
        <rect width="78" height="120" rx="10" fill="#fff" stroke="${c}" stroke-width="4"/>
        <rect x="14" y="${100 - [46, 74, 30, 58][i]}" width="50" height="${[46, 74, 30, 58][i]}" rx="6" fill="${c}"/>
      </g>`).join('')}
    <text x="70" y="248" fill="#334155" font-size="15" font-weight="700">measure, do not guess</text>`,
};

/** The illustration for a question, falling back to a neutral panel. */
export function scene(key) {
  const draw = SCENES[key];
  if (!draw) {
    return `<svg viewBox="0 0 400 300" class="scene-art" role="img" aria-label="illustration">
      <rect x="20" y="20" width="360" height="260" rx="16" fill="#e2e8f0"/>
      <circle cx="200" cy="140" r="42" fill="#94a3b8"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 400 300" class="scene-art" role="img" aria-label="${key} diagram">${draw()}</svg>`;
}

/** Small decorative shapes that float behind the UI. */
export function doodles(colors) {
  const [a, b] = colors || ['#ffffff', '#fde68a'];
  return `<svg viewBox="0 0 200 200" class="doodles" aria-hidden="true">
    <circle cx="30" cy="40" r="12" fill="${b}" opacity=".55"/>
    <rect x="150" y="26" width="22" height="22" rx="5" fill="${a}" opacity=".5" transform="rotate(20 161 37)"/>
    <path d="M100 160l14 14-14 14-14-14z" fill="${b}" opacity=".5"/>
    <circle cx="176" cy="150" r="9" fill="${a}" opacity=".45"/>
  </svg>`;
}
