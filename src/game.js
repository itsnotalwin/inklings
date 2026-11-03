// INKLINGS · The Nest — small, offline-first creature-care vertical slice.
const KEY = 'inklings.nest.v1';
const $ = (selector) => document.querySelector(selector);
const defaults = () => ({ version: 1, visits: 0, lastSeen: 0, pets: { pip: 0, momo: 0 }, meals: 0, games: 0, naps: 0, sound: true });
function load() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    if (!value || value.version !== 1) return defaults();
    return { ...defaults(), ...value, pets: { ...defaults().pets, ...value.pets } };
  } catch { return defaults(); }
}
const state = load();
const elapsed = Date.now() - (Number(state.lastSeen) || 0);
state.visits++;
state.lastSeen = Date.now();
function save() {
  state.lastSeen = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* Private mode: remain playable. */ }
}
save();

const whisper = $('#paper-whisper');
const particles = $('#paint-animations');
const painting = $('#painting');
const inkies = [...document.querySelectorAll('[data-inkie]')];
const names = { pip: 'Pip', momo: 'Momo' };
let toastTimer;
let audioContext;
let lastPet = 0;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function say(message, duration = 4200) {
  clearTimeout(toastTimer);
  whisper.textContent = message;
  whisper.style.opacity = '1';
  toastTimer = setTimeout(() => { whisper.style.opacity = '.25'; }, duration);
}
function chirp(tone = 480) {
  if (!state.sound) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioContext ??= new AudioContext();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(tone, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(160, tone * .8), audioContext.currentTime + .18);
    gain.gain.setValueAtTime(.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.028, audioContext.currentTime + .02);
    gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .24);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(); oscillator.stop(audioContext.currentTime + .25);
  } catch { /* Audio is decorative only. */ }
}
function scatter(symbols, x, y, count = 6) {
  if (prefersReducedMotion) return;
  for (let i = 0; i < count; i++) {
    const part = document.createElement('span');
    part.className = 'particle';
    part.textContent = symbols[i % symbols.length];
    part.style.setProperty('--x', `${x + (Math.random() - .5) * 12}%`);
    part.style.setProperty('--y', `${y + (Math.random() - .5) * 10}%`);
    part.style.setProperty('--drift', `${(Math.random() - .5) * 90}px`);
    part.style.setProperty('--rot', `${Math.round((Math.random() - .5) * 95)}deg`);
    part.style.setProperty('--size', `${15 + Math.random() * 12}px`);
    part.style.animationDelay = `${i * .10}s`;
    part.addEventListener('animationend', () => part.remove(), { once: true });
    particles.appendChild(part);
  }
}
function animate(inkie, className, duration = 1300) {
  inkie.classList.remove('petted', 'is-eating', 'is-playing', 'is-sleeping');
  // Restart the CSS animation reliably even after repeated taps.
  void inkie.offsetWidth;
  inkie.classList.add(className);
  setTimeout(() => inkie.classList.remove(className), duration);
}
function pet(name) {
  // Ignore duplicate click events created by dragging across the same creature.
  if (Date.now() - lastPet < 250) return;
  lastPet = Date.now();
  state.pets[name] += 1;
  save();
  const el = $(`[data-inkie="${name}"]`);
  animate(el, 'petted', 780);
  const position = name === 'pip' ? [23, 62] : [74, 49];
  scatter(['♡', '·', '❋'], ...position, 5);
  say(name === 'pip' ? 'Pip gives a happy little wobble.' : 'Momo opens one eye, just for you.');
  chirp(name === 'pip' ? 540 : 390);
}
function feed() {
  state.meals += 1;
  save();
  inkies.forEach((el, i) => setTimeout(() => animate(el, 'is-eating', 1350), i * 200));
  scatter(['✳', '·', '•'], 63, 78, 10);
  say(state.meals === 1 ? 'A little supper, shared by two.' : 'Pip checks the bowl. Momo follows the smell.');
  chirp(440);
}
function play() {
  state.games += 1;
  save();
  inkies.forEach((el, i) => setTimeout(() => animate(el, 'is-playing', 1550), i * 260));
  scatter(['❋', '✿', '·'], 51, 60, 9);
  say('A painted leaf drifts past. It is the most exciting thing today.');
  chirp(620);
}
function rest() {
  state.naps += 1;
  save();
  inkies.forEach((el) => animate(el, 'is-sleeping', 9000));
  scatter(['z', '·'], 66, 43, 5);
  say('A little quiet. A little nap. Everything is all right.');
  chirp(320);
}

inkies.forEach((el) => {
  const name = el.dataset.inkie;
  let start = null;
  el.addEventListener('pointerdown', (event) => { start = { x: event.clientX, y: event.clientY }; });
  el.addEventListener('pointermove', (event) => {
    if (!start || event.buttons === 0) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 18) {
      start = null;
      pet(name);
    }
  });
  el.addEventListener('pointerup', () => { start = null; });
  el.addEventListener('pointercancel', () => { start = null; });
  el.addEventListener('click', () => pet(name));
});
$('#feed').addEventListener('click', feed);
$('#bowl').addEventListener('click', feed);
$('#play').addEventListener('click', play);
$('#rest').addEventListener('click', rest);

const journal = $('#journal');
const sound = $('#sound-toggle');
sound.checked = Boolean(state.sound);
sound.addEventListener('change', () => { state.sound = sound.checked; save(); });
function openJournal() {
  $('#journal-record').textContent = `Visits to the nest: ${state.visits} · Shared suppers: ${state.meals} · Little games: ${state.games} · Naps: ${state.naps} · Kind pats: ${state.pets.pip + state.pets.momo}.`;
  journal.showModal();
}
$('#open-journal').addEventListener('click', openJournal);
$('#close-journal').addEventListener('click', () => journal.close());
journal.addEventListener('click', (event) => { if (event.target === journal) journal.close(); });


// Cover and in-world navigation: no second game system, just a painted entry page.
const cover = $('#front-cover');
const app = $('#app');
function enterNest() { cover.hidden = true; app.hidden = false; document.body.classList.add('inside-nest'); }
function returnToCover() { app.hidden = true; cover.hidden = false; document.body.classList.remove('inside-nest'); }
$('#cover-play').addEventListener('click', enterNest);
$('#home-control').addEventListener('click', returnToCover);
$('#cover-journal').addEventListener('click', openJournal);
const settings = $('#settings');
$('#cover-settings').addEventListener('click', () => settings.showModal());
$('#close-settings').addEventListener('click', () => settings.close());
settings.addEventListener('click', (event) => { if (event.target === settings) settings.close(); });
const settingSound = $('#settings-sound');
settingSound.checked = state.sound;
settingSound.addEventListener('change', () => { state.sound = settingSound.checked; sound.checked = state.sound; save(); });
const reducedMotion = $('#gentle-motion');
try { reducedMotion.checked = localStorage.getItem('inklings.reduce-motion') === 'true'; } catch { reducedMotion.checked = false; }
function applyMotionPreference(){ document.documentElement.classList.toggle('less-motion', reducedMotion.checked); }
applyMotionPreference();
reducedMotion.addEventListener('change',()=>{try{localStorage.setItem('inklings.reduce-motion',String(reducedMotion.checked))}catch{};applyMotionPreference();});

const hour = new Date().getHours();
if (hour >= 19 || hour < 6) {
  painting.classList.add('is-night');
  $('#scene-caption').textContent = 'The lantern keeps the evening company.';
}
if (state.visits === 1) {
  say('Pip and Momo live here now. Tap gently to say hello.', 9000);
} else if (elapsed > 1000 * 60 * 60 * 24) {
  say('You came back. Pip and Momo are so pleased.', 9000);
} else {
  say('A familiar little nest. Welcome home.', 6000);
}

// Expose a read-only snapshot for smoke tests and debugging, never internal mutators.
window.inklingsStatus = () => structuredClone(state);