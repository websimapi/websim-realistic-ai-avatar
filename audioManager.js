export class AudioManager {
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.source = null;
  }

  async playBlob(blob, onEnded) {
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);

    if (this.source) {
      this.source.stop();
    }

    this.source = this.audioCtx.createBufferSource();
    this.source.buffer = audioBuffer;
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
    
    this.source.onended = onEnded;
    this.source.start(0);
  }

  getVolume() {
    this.analyser.getByteFrequencyData(this.dataArray);
    let values = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      values += this.dataArray[i];
    }
    const average = values / this.dataArray.length;
    return average / 128; // Normalize to 0-1 range
  }
}

export const playSoundEffect = (filename) => {
  const audio = new Audio(filename);
  audio.play().catch(e => console.error("Sound effect play failed", e));
};