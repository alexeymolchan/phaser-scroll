import Phaser from 'phaser';
import ProgressBar from '../ui/ProgressBar';
import rowDark from '../assets/row-dark.png';
import rowGrey from '../assets/row-grey.png';
import ScrollView from '../ui/ScrollView';

const listData = Array.from({length: 30}).map((a, i) => ({
  position: i,
  user: {
    name: 'Alex',
    experience: Math.floor(Math.random() * 1000)
  }
}));

class RootScene extends Phaser.Scene {
  constructor() {
    super('rootScene');
  }
  
  preload() {
    this.load.image('row-dark', rowDark);
    this.load.image('row-grey', rowGrey);
  }
  
  create() {
    const progressBarWidth = window.innerWidth / 4;
    const progressBarHeight = 40;
    // this.progressBar = new ProgressBar(this, 0, 333, 666, window.innerWidth / 4, 40, true);
    // this.progressBar.setPosition(10, 50);
    this.listItems = this.generateListItems(listData);
    this.scrollView = new ScrollView(this, 10 + window.innerWidth / 4 + 50, 50, window.innerWidth * 0.4, window.innerHeight * 0.4);
    this.scrollView.setData(this.listItems);
    this.fps = this.add.text(20, 30, '', {fontFamily: 'troika', color: '#c9c9c9'});
    this.fps.setFontSize(window.innerWidth * 0.03);
    this.events.on('resize', this.resizeHandler);
  }
  
  resizeHandler = () => {
    this.cameras.resize(window.innerWidth, window.innerHeight);
    const progressBarWidth = window.innerWidth / 4;
    const progressBarHeight = 50;
    // this.progressBar.resize(progressBarWidth, progressBarHeight);
    this.scrollView.resize(window.innerWidth * 0.4, window.innerHeight * 0.4, 10 + window.innerWidth / 4 + 50, 50);
    this.fps.setFontSize(window.innerWidth * 0.03);
  };
  
  generateListItems = data => {
    const list = [];
    data.forEach((item, index) => {
      let backgroundName = 'row-dark';
      if (index % 2 === 0) {
        backgroundName = 'row-grey';
      }
      const rowBackground = this.add.image(-window.innerWidth, 0, backgroundName);
      rowBackground.setName('background');
      const pos = `${item.position + 1}`;
      const position = this.add.text(-window.innerWidth, 0, pos, {
        fontFamily: 'troika',
        color: '#8c8c8c',
        fontStyle: 'bold'
      });
      position
        .setShadow(2.8, 2.8, '#000000', 0)
        .setName('position')
        .setScale(0.5)
        .setOrigin(0, 0.5);
      const name = this.add.text(-window.innerWidth, 10, item.user.name, {
        fontFamily: 'troika',
        color: '#ffffff',
        fontStyle: 'bold'
      });
      name
        .setShadow(2.8, 2.8, '#000000', 0)
        .setName('name')
        .setScale(0.5)
        .setOrigin(0, 0.5);
      
      const pointsValue = `${item.user.experience}`;
      const points = this.add.text(-window.innerWidth, 0, pointsValue, {
        fontFamily: 'troika',
        color: '#ffef38',
        fontStyle: 'bold'
      });
      points
        .setShadow(2.8, 2.8, '#993200', 0)
        .setName('points')
        .setScale(0.5)
        .setOrigin(1, 0.5);
      
      list.push([rowBackground, position, name, points]);
    });
    return list;
  };
  
  update(time, delta) {
    this.fps.setText(Math.floor(1 / delta * 1000))
  }
}

export default RootScene;