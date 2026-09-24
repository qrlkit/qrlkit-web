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
  const code = example.source;
  const tile = document.createElement('article');
  tile.className = 'tile';
  tile.setAttribute('aria-label', example.file);
  const palette = Object.values(THEMES)[index % Object.keys(THEMES).length];
  ['bg', 'fg', 'muted', 'accent', 'key', 'string'].forEach((key, i) => tile.style.setProperty(`--${key}`, palette[i]));
  const header = document.createElement('div');
  header.className = 'tile-header';
  header.append(span('dot', ''), span('filename', example.file));
  const pre = document.createElement('pre');
  pre.className = 'code';
  pre.tabIndex = 0;
  pre.setAttribute('role', 'region');
  pre.setAttribute('aria-label', `${example.file} code, scroll to read`);
  const body = document.createElement('code');
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
function renderDesk() {
  const wall = document.getElementById('wall');
  wall.replaceChildren();
  NOTES.forEach((note, index) => {
    const tile = createTile(note, index);
    if (note.featured) tile.classList.add('superstar');
    tile.hidden = note.open === false;
    wall.append(tile);
  });
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
