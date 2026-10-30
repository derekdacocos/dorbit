// A soft "ding-dong-ding" for reminders, made with the browser's built-in sound generator
export function playChime() {
  const audio = new AudioContext();
  const notes = [
    { frequency: 659, start: 0 },
    { frequency: 523, start: 0.35 },
    { frequency: 784, start: 0.7 },
  ];
  for (const note of notes) {
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = note.frequency;
    oscillator.connect(volume);
    volume.connect(audio.destination);

    const time = audio.currentTime + note.start;
    volume.gain.setValueAtTime(0.0001, time);
    volume.gain.exponentialRampToValueAtTime(0.3, time + 0.02);
    volume.gain.exponentialRampToValueAtTime(0.0001, time + 0.9);
    oscillator.start(time);
    oscillator.stop(time + 1);
  }
}