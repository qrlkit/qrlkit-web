/* A deterministic scatter, with per-topic positions kept for this page session. */
const deskPositions = new Map();
let deskCleanup = () => {};
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
function arrangeDesk(wall, topic) {
  deskCleanup();
  const cards = [...wall.querySelectorAll('.tile')];
  const positions = deskPositions.get(topic) || cards.map((card, i) => ({
    x: card.classList.contains('superstar') ? 0.5 : (0.08 + i * 0.61803398875) % 1,
    y: card.classList.contains('superstar') ? 0.1 : (0.12 + i * 0.38196601125 + Math.floor(i / 7) * 0.17) % 1,
    z: card.classList.contains('superstar') ? cards.length + 1 : i + 1,
  }));
  deskPositions.set(topic, positions);
  let top = Math.max(...positions.map(p => p.z));
  function paint(card, p) {
    if (card.hidden) return;
    const availableX = Math.max(0, wall.clientWidth - card.offsetWidth - 16);
    const availableY = Math.max(0, wall.clientHeight - card.offsetHeight - 16);
    card.style.left = `${8 + clamp(p.x, 0, 1) * availableX}px`;
    card.style.top = `${8 + clamp(p.y, 0, 1) * availableY}px`;
    card.style.transform = 'none';
    card.style.zIndex = p.z;
  }
  cards.forEach((card, i) => {
    const p = positions[i];
    const handle = card.querySelector('.tile-header');
    handle.tabIndex = 0; handle.setAttribute('role', 'button');
    handle.setAttribute('aria-label', `${card.getAttribute('aria-label')}: drag to move, arrow keys to nudge`);
    handle.title = 'Drag this note · click to bring forward · arrow keys to move';
    function front() {
      p.z = ++top; card.style.zIndex = p.z;
    }
    card.addEventListener('pointerdown', front);
    card.addEventListener('focusin', front);
    let drag = null;
    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      handle.focus({ preventScroll: true });
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: parseFloat(card.style.left), top: parseFloat(card.style.top) };
      handle.setPointerCapture(event.pointerId);
      card.classList.add('dragging'); event.preventDefault();
    });
    function move(left, top) {
      p.x = clamp((left - 8) / Math.max(1, wall.clientWidth - card.offsetWidth - 16), 0, 1);
      p.y = clamp((top - 8) / Math.max(1, wall.clientHeight - card.offsetHeight - 16), 0, 1);
      paint(card, p);
    }
    handle.addEventListener('pointermove', event => {
      if (drag?.id !== event.pointerId) return;
      move(drag.left + event.clientX - drag.x, drag.top + event.clientY - drag.y);
    });
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) handle.addEventListener(name, () => { drag = null; card.classList.remove('dragging'); });
    handle.addEventListener('keydown', event => {
      const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); front(); return; }
      if (!directions[event.key]) return;
      event.preventDefault(); front();
      const [x, y] = directions[event.key], step = event.shiftKey ? 30 : 10;
      move(parseFloat(card.style.left) + x * step, parseFloat(card.style.top) + y * step);
    });
    card.querySelectorAll('.resize-handle').forEach(resizeHandle => {
      resizeHandle.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        event.stopPropagation(); event.preventDefault(); front();
        const direction = resizeHandle.dataset.direction;
        const start = { x: event.clientX, y: event.clientY, width: card.offsetWidth, height: card.offsetHeight, left: parseFloat(card.style.left), top: parseFloat(card.style.top) };
        resizeHandle.setPointerCapture(event.pointerId);
        function resize(moveEvent) {
          const dx = moveEvent.clientX - start.x, dy = moveEvent.clientY - start.y;
          const minWidth = 220, minHeight = 160;
          let width = start.width, height = start.height, left = start.left, top = start.top;
          if (direction.includes('e')) width = Math.max(minWidth, start.width + dx);
          if (direction.includes('s')) height = Math.max(minHeight, start.height + dy);
          if (direction.includes('w')) { width = Math.max(minWidth, start.width - dx); left = start.left + start.width - width; }
          if (direction.includes('n')) { height = Math.max(minHeight, start.height - dy); top = start.top + start.height - height; }
          card.style.width = `${width}px`; card.style.height = `${height}px`;
          move(left, top);
        }
        const stop = () => { resizeHandle.releasePointerCapture?.(event.pointerId); resizeHandle.removeEventListener('pointermove', resize); resizeHandle.removeEventListener('pointerup', stop); resizeHandle.removeEventListener('pointercancel', stop); };
        resizeHandle.addEventListener('pointermove', resize);
        resizeHandle.addEventListener('pointerup', stop);
        resizeHandle.addEventListener('pointercancel', stop);
      });
    });
  });
  const observer = new ResizeObserver(() => cards.forEach((card, i) => paint(card, positions[i])));
  observer.observe(wall); cards.forEach(card => observer.observe(card));
  deskCleanup = () => observer.disconnect();
  cards.forEach((card, i) => paint(card, positions[i]));
}
