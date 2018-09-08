import Phaser from 'phaser';
import {debounce} from './utils';
import loadFont from './utils/fontLoader';
import RootScene from './scenes/RootScene';

import './index.css';

const config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  autoResize: true,
  backgroundColor: '#c9c9c9',
  resolution: window.devicePixelRatio || 1,
  scene: [
    RootScene,
  ]
};

let game;

const gameResizeHadler = () => {
  game.resize(window.innerWidth, window.innerHeight);
};

loadFont()
  .then(() => {
    game = new Phaser.Game(config);
    
    window.addEventListener('resize', debounce(gameResizeHadler, 500));
    
    setTimeout(gameResizeHadler, 2000);
  })
  .catch(error => {
    console.error(error);
  });
