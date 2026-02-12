// Minimal Web Audio API sound effects
const audioCtx = () => {
  if (!(window as any).__deadlinePetsAudioCtx) {
    (window as any).__deadlinePetsAudioCtx = new AudioContext();
  }
  return (window as any).__deadlinePetsAudioCtx as AudioContext;
};

const SOUND_KEY = "deadline-pets-sound";

export function isSoundEnabled(): boolean {
  try {
    const val = localStorage.getItem(SOUND_KEY);
    return val === null ? true : val === "true";
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, String(enabled));
  } catch {}
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  if (!isSoundEnabled()) return;
  try {
    const ctx = audioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playAdoptSound() {
  // Two-note happy chirp
  playTone(523, 0.12, "sine", 0.12);
  setTimeout(() => playTone(659, 0.15, "sine", 0.12), 100);
}

export function playDeleteSound() {
  // Soft descending tone
  playTone(440, 0.15, "sine", 0.1);
  setTimeout(() => playTone(330, 0.2, "sine", 0.08), 120);
}

export function playSaveSound() {
  // Gentle single blip
  playTone(587, 0.1, "sine", 0.1);
}

export function playExportSound() {
  // Quick soft click
  playTone(880, 0.06, "triangle", 0.08);
}

export function playImportSound() {
  // Rising blip
  playTone(440, 0.08, "sine", 0.08);
  setTimeout(() => playTone(660, 0.1, "sine", 0.1), 80);
}

export function playToggleSound() {
  playTone(700, 0.05, "sine", 0.08);
}
