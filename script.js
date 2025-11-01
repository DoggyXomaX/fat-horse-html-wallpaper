const Size = 300, Speed = 300, MaxOffset = 10, FrameCount = 6, DirectionCount = 4, AnimationFPS = 32;
let x = 0, y = 0, dir = 0, frame = 0, prevTime = 0, needFrameUpdate = true, needColorUpdate = true;

window.onload = init;

function rand() {
  return Math.random();
}

function init() {
  horse.style.fontSize = Size + "px";
  x = rand() * (document.body.clientWidth - Size);
  y = rand() * (document.body.clientHeight - Size);
  dir = rand() * DirectionCount | 0;

  setInterval(updateFrame, 1000 / AnimationFPS);
  requestAnimationFrame(update);
}

function updateFrame() {
  frame = (frame + 1) % FrameCount;
  needFrameUpdate = true;
}

function update(time) {
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
    newX = document.body.clientWidth - Size + MaxOffset
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

  x = newX;
  y = newY;

  render();
}

function render() {
  horse.style.transform = `matrix(1,0,0,1,${x},${y})`;

  if (needColorUpdate) {
    horse.style.filter = `hue-rotate(${rand()}turn)`;
    needColorUpdate = false;
  }

  if (needFrameUpdate) {
    horse.style.backgroundPosition = `${-frame}em ${-dir}em`
    needFrameUpdate = false;
  }
}
