import Phaser from 'phaser';

export const progressBarStyles = {
  borderColor: 0x005e09,
  shadowColor: '#005e09',
  progressColor: 0xc0ff38,
  progressShadowColor: 0x27b78d,
};

class ProgressBar extends Phaser.GameObjects.Container {
  constructor(scene, minValue = 0, currentValue = 100, maxValue = 100, width, height, isTextCentered = false) {
    super(scene);
    this.scene = scene;
    this.minValue = minValue;
    this.currentValue = currentValue;
    this.maxValue = maxValue;
    this.updateTween = null;
    this.isTextCentered = isTextCentered;
    this.root = this.scene.make.graphics();
    this.progress = this.scene.make.graphics();
    this.text = this.scene.make.text({style: {fontFamily: 'troika', color: '#ffffff', fontStyle: 'bold'}});
    this.text
      .setOrigin(1, 0.5)
      .setShadow(2.8, 2.8, progressBarStyles.shadowColor, false, true)
      .setScale(0.5);
    const textValue = `${currentValue}/${maxValue} XP`;
    this.text.setText(textValue);
    this.boot(false, width, height);
    this.add([this.root, this.progress, this.text]);
    this.scene.add.existing(this);
  }
  
  boot = (isResize = false, width, height) => {
    if (this.updateTween) {
      this.updateTween.pause();
    }
    
    const containerWidth = width || window.innerWidth * 0.3;
    const containerHeight = height || containerWidth * 0.11;
    this.setSize(containerWidth, containerHeight);
    this.innerWidth = this.width - this.height * 0.09;
    this.innerHeight = this.height - this.height * 0.09;
    this.createRoot(isResize);
    this.createProgress(isResize);
    this.setupTextStyles();
    
    if (this.updateTween) {
      this.updateTween.resume();
    }
  };
  
  createRoot = (withClear = false) => {
    if (withClear) {
      this.root.clear();
    }
    const offset = this.height * 0.045;
    const radius = this.height * 0.1;
    const halfPI = Math.PI * 0.5;
    const minusHalfPI = halfPI * -1;
    this.root.fillStyle(0x000000, 0.3);
    this.root.fillRect(offset, offset, this.innerWidth, this.innerHeight);
    this.root.beginPath();
    this.root.lineStyle(this.height * 0.09, progressBarStyles.borderColor, 1);
    this.root.moveTo(radius, 0);
    this.root.lineTo(this.width - radius, 0);
    this.root.moveTo(this.width - radius, 0);
    this.root.arc(this.width - radius, radius, radius, minusHalfPI, 0);
    this.root.lineTo(this.width, this.height - radius);
    this.root.moveTo(this.width, this.height - radius);
    this.root.arc(this.width - radius, this.height - radius, radius, 0, halfPI);
    this.root.lineTo(radius, this.height);
    this.root.moveTo(radius, this.height);
    this.root.arc(radius, this.height - radius, radius, halfPI, Math.PI);
    this.root.lineTo(0, radius);
    this.root.moveTo(0, radius);
    this.root.arc(radius, radius, radius, -Math.PI, minusHalfPI);
    this.root.closePath();
    this.root.strokePath();
  };
  
  createProgress = (withClear = false) => {
    if (withClear) {
      this.progress.clear();
    }
    const valuesAspect = this.getValuesAspect();
    if (valuesAspect === 0) {
      return;
    }
    const borderBaseRadius = this.innerHeight * 0.09;
    const borders = {
      tl: borderBaseRadius,
      bl: borderBaseRadius,
      br: valuesAspect < 1 ? 0 : borderBaseRadius,
      tr: valuesAspect < 1 ? 0 : borderBaseRadius
    };
    
    const offset = this.height * 0.045;
    const shadowOffset = this.innerHeight * 0.076;
    this.progress.fillStyle(progressBarStyles.progressShadowColor, 1);
    this.progress.fillRoundedRect(offset, offset, this.innerWidth * valuesAspect, this.innerHeight, borders);
    this.progress.fillStyle(progressBarStyles.progressColor, 1);
    this.progress.fillRoundedRect(
      offset,
      offset,
      this.innerWidth * valuesAspect,
      this.innerHeight - shadowOffset,
      borders
    );
  };
  
  setupTextStyles = () => {
    const textFontPercentage = this.isTextCentered ? 0.5 : 0.65;
    this.text.setFontSize(this.height * textFontPercentage * 2);
    this.text.setPosition(
      this.isTextCentered ? this.width / 2 + this.text.displayWidth / 2 : this.width - 10,
      this.height / 2
    );
  };
  
  resize = (width, height) => {
    this.boot(true, width, height);
  };
  
  getValuesAspect = () => (this.currentValue - this.minValue) / (this.maxValue - this.minValue);
  
  updateProgress = (nextValue, completeCallback, delay = 0) => {
    if (this.updateTween) {
      this.updateTween.stop();
    }
    if (nextValue >= 0) {
      this.updateTween = this.scene.add.tween({
        targets: this,
        currentValue: nextValue <= this.maxValue ? nextValue : this.maxValue,
        onUpdate: tween => {
          const nextCalculatedValue = tween.data[0].current;
          const textValue = `${Math.round(nextCalculatedValue)}/${this.maxValue} XP`;
          this.text.setText(textValue);
          this.createProgress(true);
        },
        onComplete: () => {
          this.updateTween = null;
          if (completeCallback) {
            completeCallback();
          }
        },
        duration: 200,
        ease: 'Linear',
        delay
      });
    }
  };
  
  reset = (min, current, max) => {
    const textValue = `${Math.round(current)}/${max} XP`;
    this.text.setText(textValue);
    this.currentValue = current;
    this.maxValue = max;
    this.minValue = min;
    this.createProgress(true);
  };
}

export default ProgressBar;
