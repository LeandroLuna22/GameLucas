const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* ===== PLAYER IMAGE ===== */
const playerImg = new Image();
playerImg.src = 'player.png';


/* ===== CANVAS FULL ===== */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ===== MUNDO ===== */
const world = {
  width: 4000,
  height: 640
};

/* ===== TILES ===== */
const TILE = 32;
const COLS = Math.floor(world.width / TILE);
const ROWS = Math.floor(world.height / TILE);

/*
0 = vazio
1 = sólido
*/
const map = [];

for (let y = 0; y < ROWS; y++) {
  map[y] = [];
  for (let x = 0; x < COLS; x++) {

    if (y >= ROWS - 3) {
      map[y][x] = 1; // chão
    }

    else if (y === ROWS - 6 && x % 6 === 0) {
      map[y][x] = 3; // plataformas
    }

    else if (y === ROWS - 9 && x % 12 === 0) {
      map[y][x] = 2; // blocos suspensos
    }

    else {
      map[y][x] = 0;
    }
  }
}


/* ===== CAMERA ===== */
const camera = { x: 0 };

/* ===== PLAYER ===== */
const player = {
  x: 100,
  y: 100,
  w: 28,
  h: 28,
  vx: 0,
  vy: 0,
  speed: 4,
  jump: 13,
  onGround: false
};

const gravity = 0.6;
const keys = {};

/* ===== INPUT ===== */
window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);

/* ===== TILE CHECK ===== */
function solidAt(px, py) {
  const cx = Math.floor(px / TILE);
  const cy = Math.floor(py / TILE);

  if (cx < 0 || cy < 0 || cx >= COLS || cy >= ROWS) return false;
  return map[cy][cx] === 1;
}

/* ===== UPDATE ===== */
function update() {

  /* input */
  player.vx = 0;
  if (keys.ArrowLeft) player.vx = -player.speed;
  if (keys.ArrowRight) player.vx = player.speed;

  if (keys.Space && player.onGround) {
    player.vy = -player.jump;
    player.onGround = false;
  }

  player.vy += gravity;

  /* ===== HORIZONTAL COLLISION ===== */
  player.x += player.vx;

function solidAt(px, py) {
  const cx = Math.floor(px / TILE);
  const cy = Math.floor(py / TILE);

  if (cx < 0 || cy < 0 || cx >= COLS || cy >= ROWS) return false;

  return map[cy][cx] !== 0; // tudo que não é vazio é sólido
}

  if (
    solidAt(player.x, player.y) ||
    solidAt(player.x + player.w, player.y) ||
    solidAt(player.x, player.y + player.h - 1) ||
    solidAt(player.x + player.w, player.y + player.h - 1)
  ) {
    player.x -= player.vx;
  }

  /* ===== VERTICAL COLLISION ===== */
  player.y += player.vy;
  player.onGround = false;

  if (
    solidAt(player.x + 2, player.y + player.h) ||
    solidAt(player.x + player.w - 2, player.y + player.h)
  ) {
    player.y = Math.floor((player.y + player.h) / TILE) * TILE - player.h;
    player.vy = 0;
    player.onGround = true;
  }

  /* limites do mundo */
  player.x = Math.max(0, Math.min(player.x, world.width - player.w));

  /* câmera */
  camera.x = player.x - canvas.width / 2 + player.w / 2;
  camera.x = Math.max(0, Math.min(camera.x, world.width - canvas.width));
}

/* ===== DRAW ===== */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(-camera.x, 0);

  /* tiles */
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {

    const tile = map[y][x];
    if (tile === 0) continue;

    if (tile === 1) ctx.fillStyle = "#068b01";     // chão
    if (tile === 2) ctx.fillStyle = "#c68642";     // bloco
    if (tile === 3) ctx.fillStyle = "#8b5a2b";     // plataforma

    ctx.fillRect(
      x * TILE,
      y * TILE,
      TILE - 1,
      TILE - 1
    );
  }
}


  /* player */
  

  ctx.drawImage(
  playerImg,
  player.x -1,   // pequeno ajuste visual
  player.y -1,
  150,
  150
);


  ctx.restore();
}

/* ===== LOOP ===== */
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

