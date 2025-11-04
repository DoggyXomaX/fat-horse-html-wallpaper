const Size = 300,
      Speed = 300,
      MaxOffset = 10,
      MinDelay = 1000,
      MaxDelay = 10000,
      FrameCount = 6,
      DirectionCount = 4,
      AnimationFPS = 32;
let x = 0,
    y = 0,
    dir = 0,
    frame = 0,
    prevTime = 0,
    isStay = true,
    delay = 0,
    needFrameUpdate = true,
    needColorUpdate = true;

window.onload = init;

function rand() {
  return Math.random();
}

function init() {
  horse.style.fontSize = `${Size}px`;
  x = rand() * (document.body.clientWidth - Size);
  y = rand() * (document.body.clientHeight - Size);
  dir = rand() * DirectionCount | 0;

  updateFrame();
  updateStay();
  update();
}

function updateStay() {
  isStay = !isStay;
  setTimeout(updateStay, MinDelay + rand() * (MaxDelay - MinDelay));
}

function updateFrame() {
  frame = (frame + 1) % FrameCount;
  needFrameUpdate = true;
  setTimeout(updateFrame, 1000 / AnimationFPS);
}

function update(time = 0) {
  requestAnimationFrame(update);

  const deltaTime = (time - prevTime) / 1000;
  prevTime = time;

  let newX = x + (dir & 2 ? 1 : -1) * Speed * deltaTime;
  let newY = y + (dir & 1 ? 1 : -1) * Speed * deltaTime;

  if (newX < -MaxOffset) {
    newX = -MaxOffset;
    dir |= 2;
    needColorUpdate = true;
  } else if (newX > document.body.clientWidth - Size + MaxOffset) {
    newX = document.body.clientWidth - Size + MaxOffset;
    dir &= 1;
    needColorUpdate = true;
  }

  if (newY < -MaxOffset) {
    newY = -MaxOffset;
    dir |= 1;
    needColorUpdate = true;
  } else if (newY > document.body.clientHeight - Size + MaxOffset) {
    newY = document.body.clientHeight - Size + MaxOffset;
    dir &= 2;
    needColorUpdate = true;
  }

  if (!isStay) {
    x = newX;
    y = newY;
  }

  render();
}

function render() {
  horse.style.transform = `matrix(1,0,0,1,${x},${y})`;

  if (needColorUpdate) {
    horse.style.filter = `hue-rotate(${rand()}turn)`;
    needColorUpdate = false;
  }

  if (needFrameUpdate) {
    const dx = isStay ? 0 : frame;
    const dy = isStay ? dir | 1 : dir;
    horse.style.backgroundPosition = `${-dx}em ${-dy}em`;
    needFrameUpdate = false;
  }
}
