const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

/* =========================
   RESOLUÇÃO LÓGICA DO JOGO
   ========================= */
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

/* =========================
   ESCALA DA TELA
   ========================= */
function resize() {
  const scale = Math.min(
    window.innerWidth / GAME_WIDTH,
    window.innerHeight / GAME_HEIGHT
  );

  canvas.style.width = Math.floor(GAME_WIDTH * scale) + 'px';
  canvas.style.height = Math.floor(GAME_HEIGHT * scale) + 'px';
}

window.addEventListener('resize', resize);
resize();

/* =========================
   MUNDO
   ========================= */
const world = {
  width: 3000,
  height: GAME_HEIGHT
};

/* =========================
   CÂMERA
   ========================= */
const camera = {
  x: 0
};

/* =========================
   CONFIG
   ========================= */
const gravity = 0.6;
const keys = {};

/* =========================
   PLAYER
   ========================= */
const player = {
  x: 100,
  y: 100,
  w: 32,
  h: 32,
  vx: 0,
  vy: 0,
  speed: 5,
  jump: 14,
  onGround: false
};

/* =========================
   PLATAFORMAS
   ========================= */
const platforms = [
  { x: 0, y: GAME_HEIGHT - 200, w: world.width, h: 200 }, // chão
  { x: 300, y: 420, w: 150, h: 20 },
  { x: 600, y: 360, w: 150, h: 20 },
  { x: 900, y: 300, w: 150, h: 20 },
  { x: 1300, y: 420, w: 150, h: 20 },
  { x: 1700, y: 350, w: 200, h: 20 }
];

/* =========================
   INPUT
   ========================= */
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

/* =========================
   UPDATE
   ========================= */
function update() {
  player.vx = 0;

  if (keys['ArrowLeft']) player.vx = -player.speed;
  if (keys['ArrowRight']) player.vx = player.speed;

  if (keys['Space'] && player.onGround) {
    player.vy = -player.jump;
    player.onGround = false;
  }

  player.vy += gravity;

  player.x += player.vx;
  player.y += player.vy;

  /* Limites do mundo */
  player.x = Math.max(0, Math.min(player.x, world.width - player.w));
  player.y = Math.min(player.y, world.height - player.h);

  /* Colisão */
  player.onGround = false;
  platforms.forEach(p => {
    if (
      player.x < p.x + p.w &&
      player.x + player.w > p.x &&
      player.y + player.h <= p.y + player.vy &&
      player.y + player.h + player.vy >= p.y
    ) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  });

  /* CÂMERA HORIZONTAL */
  camera.x = player.x - GAME_WIDTH / 2 + player.w / 2;
  camera.x = Math.max(0, Math.min(camera.x, world.width - GAME_WIDTH));
}

/* =========================
   DRAW
   ========================= */
function draw() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.save();
  ctx.translate(-camera.x, 0);

  // Player
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Plataformas
  ctx.fillStyle = '#654321';
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.w, p.h);
  });

  ctx.restore();
}

/* =========================
   LOOP
   ========================= */
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();