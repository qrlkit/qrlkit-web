// Keep descriptions readable as real comment lines, even before soft wrapping.
function wrapComment(text, width = 64) {
  const lines = [''];
  for (const word of text.split(/\s+/)) {
    const last = lines.length - 1;
    if (lines[last] && lines[last].length + word.length + 1 > width) lines.push(word);
    else lines[last] += (lines[last] ? ' ' : '') + word;
  }
  return lines;
}
/* Serializers keep content independent from presentation. */
function serialize(config, format) {
  if (format === 'json') return JSON.stringify(config, null, 2);
  if (format === 'yaml') {
    const yaml = (obj, depth = 0) => Object.entries(obj).map(([key, value]) => {
      const pad = '  '.repeat(depth);
      if (typeof value === 'object') return `${pad}${key}:\n${yaml(value, depth + 1)}`;
      if (value.includes('\n')) return `${pad}${key}: |-\n${value.split('\n').map(line => `${pad}  ${line}`).join('\n')}`;
      return `${pad}${key}: ${JSON.stringify(value)}`;
    }).join('\n');
    return yaml(config);
  }
  const sections = [];
  function toml(obj, path = []) {
    const fields = Object.entries(obj).filter(([, v]) => typeof v !== 'object');
    if (fields.length) sections.push(`[${path.join('.')}]\n` + fields.map(([k, v]) => `${k.startsWith('$') ? JSON.stringify(k) : k} = ${v.includes('\n') ? "'''\n" + v + "'''" : JSON.stringify(v)}`).join('\n'));
    Object.entries(obj).filter(([, v]) => typeof v === 'object').forEach(([k, v]) => toml(v, [...path, k]));
  }
  toml(config);
  return sections.join('\n\n');
}
function span(className, text) {
  const node = document.createElement('span');
  node.className = className;
  node.textContent = text;
  return node;
}
function highlight(line) {
  const fragment = document.createDocumentFragment();
  if (line.trimStart().startsWith('#')) {
    fragment.append(span('comment', line));
    return fragment;
  }
  // Tokenize strings before keys so URLs and escaped quotes remain intact.
  const tokens = line.split(/("(?:\\.|[^"\\])*"|'[^']*'|\[[^\]]*\]|^[\w$-]+(?=:)|^\s*[\w$-]+(?=\s*=))/g);
  tokens.forEach((token, index) => {
    if (!token) return;
    let type = '';
    if (index % 2) type = token.startsWith('[') ? 'section' : /^\s*[:=]/.test(tokens[index + 1] || '') ? 'key' : 'string';
    fragment.append(type ? span(type, token) : document.createTextNode(token));
  });
  return fragment;
}

function createTile(example, index) {
  const format = example.file.split('.').pop();
  const code = example.source ?? serialize(example.config, format);
  const tile = document.createElement('article');
  tile.className = 'tile';
  tile.setAttribute('aria-label', example.file);
  const palette = Object.values(THEMES)[index % Object.keys(THEMES).length];
  ['bg', 'fg', 'muted', 'accent', 'key', 'string'].forEach((key, i) => tile.style.setProperty(`--${key}`, palette[i]));
  tile.style.setProperty('--weight', code.split('\n').length + example.note.split('\n').length + 4);
  const header = document.createElement('div');
  header.className = 'tile-header';
  header.append(span('dot', ''), span('filename', example.file));
  const pre = document.createElement('pre');
  pre.className = 'code';
  pre.tabIndex = 0;
  pre.setAttribute('role', 'region');
  pre.setAttribute('aria-label', `${example.file} code, scroll to read`);
  // JSON has no comments: its note is visually adjacent but outside <code>.
  const note = span('example-note', example.note.split('\n').map(line => `${format === 'json' ? '↳ ' : '# '}${line}`).join('\n'));
  const body = document.createElement('code');
  if (!example.source) {
    if (format !== 'json') body.append(note, document.createTextNode('\n\n'));
    else pre.append(note, document.createTextNode('\n\n'));
  }
  code.split('\n').forEach(line => {
    const row = span('line', '');
    row.append(highlight(line));
    body.append(row, document.createTextNode('\n'));
  });
  pre.append(body);
  tile.append(header, pre);
  ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].forEach(direction => {
    const handle = document.createElement('span');
    handle.className = `resize-handle resize-${direction}`;
    handle.dataset.direction = direction;
    handle.setAttribute('aria-hidden', 'true');
    tile.append(handle);
  });
  return tile;
}
// Temporary copy-editing preview. Set to null to restore every note.
const HIDDEN_NOTES = new Set(['using-inputs.toml', 'customize.toml']);
const VISIBLE_NOTES = new Set(['cli/could-be-cool.toml', 'cli/nesting.toml', 'cli/qrlkit-basics.toml']);
function renderDesk() {
  const wall = document.getElementById('wall');
  wall.replaceChildren();
  // Interleave the collections so related notes do not form separate piles.
  const collections = FEATURES.map(feature => ({
    id: feature.id,
    featured: feature.superstar,
    notes: [...feature.sideExamples, ...feature.examples],
  }));
  const count = Math.max(...collections.map(collection => collection.notes.length));
  let paletteIndex = 0;
  for (let i = 0; i < count; i++) {
    for (const collection of collections) {
      const example = collection.notes[i];
      if (!example || (VISIBLE_NOTES && !VISIBLE_NOTES.has(`${collection.id}/${example.file}`) && !HIDDEN_NOTES.has(example.file))) continue;
      const tile = createTile(example, paletteIndex++);
      if (example.file === collection.featured) tile.classList.add('superstar');
      if (HIDDEN_NOTES.has(example.file)) tile.hidden = true;
      wall.append(tile);
    }
  }
  arrangeDesk(wall, 'all-notes');
  enableNoteMenu(wall);
}
function enableNoteMenu(wall) {
  const list = document.getElementById('notes-entries');
  const menu = document.querySelector('.notes-menu');
  menu.addEventListener('toggle', () => {
    if (menu.open) document.getElementById('notes-menu-label').textContent = 'Browse spec ideas';
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  }, true);
  list.replaceChildren();
  wall.querySelectorAll('.tile').forEach(tile => {
    const name = tile.getAttribute('aria-label');
    const entry = document.createElement('button'); entry.type = 'button';
    function label() {
      entry.textContent = `${tile.hidden ? '+ Open' : '↗ Show'} ${name}`;
      entry.setAttribute('aria-label', `${tile.hidden ? 'Open' : 'Show'} ${name}`);
    }
    const close = document.createElement('button'); close.type = 'button';
    close.className = 'note-close'; close.textContent = '×';
    close.setAttribute('aria-label', `Close ${name}`);
    close.addEventListener('pointerdown', event => event.stopPropagation());
    close.addEventListener('keydown', event => event.stopPropagation());
    close.addEventListener('click', () => {
      tile.hidden = true; label(); menu.querySelector('summary').focus();
    });
    tile.querySelector('.tile-header').append(close);
    entry.addEventListener('click', () => {
      tile.hidden = false; label(); menu.open = false;
      tile.querySelector('.tile-header').focus({ preventScroll: true });
    });
    label(); list.append(entry);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
  });
}
renderDesk();
