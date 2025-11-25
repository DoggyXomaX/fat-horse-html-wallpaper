const MaxOffset = 10;
const MinDelay = 2000;
const MaxDelay = 20000;
const FrameCount = 6;
const DirectionCount = 4;
const AnimationFPS = 8;

class Horse {
  speedAnimation = [0.25, 0.5, 1, 0.5, 1, 0.5];
  size = 300;
  speed = 150;
  x = 0;
  y = 0;
  dir = 0;
  frame = 0;
  isStay = true;
  element = document.createElement('div');
  constructor() {
    this.element.className = 'horse';
  }
  init() {
    this.x = Math.random() * (document.body.clientWidth - this.size);
    this.y = Math.random() * (document.body.clientHeight - this.size);
    this.size = 150 + Math.random() * 300 | 0;
    this.speed = this.size / 2;
    this.frame = Math.random() * FrameCount | 0;
    this.dir = Math.random() * DirectionCount | 0;

    this.element.style.fontSize = `${this.size}px`;
    this.element.style.filter = `brightness(${50 + Math.random() * 50}%)`;
    document.body.append(this.element);

    this.updateStay();
  }
  updateStay = () => {
    this.isStay = !this.isStay;
    if (Math.random() > 0.75 && !this.isStay) this.dir = Math.random() * DirectionCount | 0;
    this.draw();

    setTimeout(this.updateStay, MinDelay + Math.random() * (MaxDelay - MinDelay));
  }
  updateFrame() {
    this.frame = (this.frame + 1) % FrameCount;
    if (!this.isStay) this.update(1 / AnimationFPS);
  }
  update(deltaTime) {
    const speedScale = this.speedAnimation[this.frame];

    let newX = this.x + (this.dir & 2 ? 1 : -1) * this.speed * speedScale * deltaTime;
    let newY = this.y + (this.dir & 1 ? 1 : -1) * this.speed * speedScale * deltaTime;

    if (newX < -MaxOffset) {
      newX = -MaxOffset;
      this.dir |= 2;
    } else if (newX > document.body.clientWidth - this.size + MaxOffset) {
      newX = document.body.clientWidth - this.size + MaxOffset;
      this.dir &= 1;
    }

    if (newY < -MaxOffset) {
      newY = -MaxOffset;
      this.dir |= 1;
    } else if (newY > document.body.clientHeight - this.size + MaxOffset) {
      newY = document.body.clientHeight - this.size + MaxOffset;
      this.dir &= 2;
    }

    if (!this.isStay) {
      this.x = newX;
      this.y = newY;
    }

    this.draw();
  }
  draw() {
    this.element.style.transform = `matrix(1,0,0,1,${this.x},${this.y})`;

    const dx = this.isStay ? 0 : this.frame;
    const dy = this.isStay ? this.dir | 1 : this.dir;
    this.element.style.setProperty('--dx', dx);
    this.element.style.setProperty('--dy', dy);
    this.element.style.zIndex = (this.y + this.size) | 0;
  }
}

const horses = new Array(8);
for (let i = 0, k = horses.length; i < k; i++) {
  const horse = new Horse();
  horses[i] = horse;
}

window.onload = init;

function init() {
  for (let i = 0, k = horses.length; i < k; i++) horses[i].init();
  updateFrame();
}

function updateFrame() {
  for (let i = 0, k = horses.length; i < k; i++) horses[i].updateFrame();
  setTimeout(updateFrame, 1000 / AnimationFPS);
}
