import Phaser from 'phaser';
import ProgressBar from '../ui/ProgressBar';

class RootScene extends Phaser.Scene {
  constructor() {
    super('rootScene');
  }
  
  create() {
    const progressBarWidth = window.innerWidth / 4;
    const progressBarHeight = 40;
    this.progressBar = new ProgressBar(this, 0, 333, 666, window.innerWidth / 4, 40, true);
    this.progressBar.setPosition(window.innerWidth / 2 - progressBarWidth / 2, window.innerHeight / 2 - progressBarHeight / 2);
    this.events.on('resize', this.resizeHandler);
  }
  
  resizeHandler = () => {
    this.cameras.resize(window.innerWidth, window.innerHeight);
    const progressBarWidth = window.innerWidth / 4;
    const progressBarHeight = 40;
    this.progressBar.resize(progressBarWidth, progressBarHeight);
    this.progressBar.setPosition(window.innerWidth / 2 - progressBarWidth / 2, window.innerHeight / 2 - progressBarHeight / 2);
  }
}

export default RootScene;