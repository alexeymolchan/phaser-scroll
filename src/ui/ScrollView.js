import Phaser from 'phaser';
import { getPercentageFromSide, flatten } from '../utils';

class ScrollView extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height) {
    super(scene, 0, 0);
    this.isLoading = true;
    this.scene = scene;
    this.scroll = 0;
    this.iterationScroll = 0;
    this.data = [];
    this.inputZone = this.scene.add.zone();
    
    this.inputZone.setInteractive({ draggable: true });
    this.maskShape = this.scene.make.graphics();
    this.setup(width, height, x, y);
    this.childHeight = (this.getAt(0) && this.getAt(0).displayHeight) || 0;
    this.childMargin = this.height * 0.003;
    this.scene.add.existing(this);
    
    this.inputZone.on('dragstart', ({ downY }) => {
      console.log('kek');
      this.prevDragY = downY;
    });
    
    this.inputZone.on('drag', ({ y: dragY, downY }) => {
      const scrollHeight =
        this.data.length * (this.childHeight + this.childMargin) -
        this.height;
      if (scrollHeight < 0) {
        return;
      }
      
      const nextY = this.y + dragY - this.prevDragY;
      
      if (this.initialY - nextY >= scrollHeight && dragY - this.prevDragY < 0) {
        this.setY(this.initialY - scrollHeight);
        this.prevDragY = dragY;
        return;
      }
      
      if (nextY >= this.initialY && dragY - this.prevDragY > 0) {
        this.setY(this.initialY);
        this.prevDragY = dragY;
        return;
      }
      
      this.setY(nextY);
      this.prevDragY = dragY;
    });
  }
  
  setup = (width, height, x, y) => {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    this.setSize(width, height);
    this.setPosition(centerX, centerY);
    this.initialY = y + height / 2;
    this.inputZone.setSize(width, height);
    this.inputZone.setPosition(x - width / 2, y - height / 2);
    if (!this.inputZone.input) {
      this.inputZone.setInteractive({ draggable: true });
    } else {
      this.inputZone.input.hitArea.setSize(width, height);
    }
    
    this.positionAndScaleRows(this.data);
    
    this.maskShape.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    this.setMask(new Phaser.Display.Masks.GeometryMask(this.scene, this.maskShape));
  };
  
  resize = (width, height, x, y) => {
    this.maskShape.clear();
    this.setup(width, height, x, y);
    this.childHeight = (this.getAt(0) && this.getAt(0).displayHeight) || 0;
    this.childMargin = this.height * 0.003;
  };
  
  resetScroll = () => {
    this.setY(this.initialY);
  };
  
  positionAndScaleRows = childs => {
    let rowHeight;
    let rowWidth;
    let textFont;
    
    childs.forEach((child, index) => {
      let yPos;
      let positionX;
      let rankX;
      let nameX;
      let nameWidth;
      child.forEach(gameObject => {
        switch (gameObject.name) {
          case 'background':
            gameObject.setScale(this.width / gameObject.width);
            if (!yPos) {
              yPos =
                -this.height / 2 +
                gameObject.displayHeight / 2 +
                index * (gameObject.displayHeight + this.height * 0.003);
            }
            gameObject.setPosition(0, yPos);
            if (!rowWidth && !rowHeight && !textFont) {
              rowHeight = gameObject.displayHeight;
              rowWidth = gameObject.displayWidth;
              textFont = rowHeight * 0.41 * 2;
            }
            break;
          case 'position':
            if (!positionX) {
              positionX = getPercentageFromSide(rowWidth, 3.5) - this.width / 2;
            }
            gameObject.setFontSize(textFont).setPosition(positionX, yPos);
            break;
          case 'name':
            gameObject.setFontSize(textFont);
            if (!nameX) {
              nameX = positionX + getPercentageFromSide(rowWidth, 10);
              nameWidth = gameObject.displayWidth;
            }
            gameObject.setPosition(nameX, yPos);
            break;
          
          case 'points':
            gameObject.setFontSize(textFont).setPosition(this.width / 2 - getPercentageFromSide(rowWidth, 4.5), yPos);
            break;
          default:
            break;
        }
      });
    });
  };
  
  setData = (data) => {
    this.data = data;
    this.positionAndScaleRows(data);
    this.add(flatten(this.data));
    this.childHeight = this.getAt(0).displayHeight;
  };
}

export default ScrollView;
