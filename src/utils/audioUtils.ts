// Web Audio API Mechanical Keyboard Sound Synthesizer

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a subtle, soft mechanical keyboard click sound.
 * @param enabled Whether sound effect is enabled by user setting
 */
export function playKeyboardClick(enabled: boolean = true) {
  if (!enabled) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Noise burst for key switch click mechanism
    const bufferSize = ctx.sampleRate * 0.008; // 8ms burst
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass filter for crisp click sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now); // Soft 12-15% volume
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // 2. Damped low pulse for key bottoming-out feel
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.012);

    oscGain.gain.setValueAtTime(0.08, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    noise.start(now);
    osc.start(now);

    noise.stop(now + 0.01);
    osc.stop(now + 0.015);
  } catch {
    // Graceful fallback if Web Audio is restricted
  }
}
