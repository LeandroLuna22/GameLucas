const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

/* ===== CANVAS FULL ===== */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

/* ===== MUNDO ===== */
const world = {
  width: 3000,
  height: 600
};

/* ===== CAMERA ===== */
const camera = { x: 0, y: 0 };

/* ===== PLAYER ===== */
const player = {
  x: 100,
  y: 300,
  w: 32,
  h: 32,
  vx: 0,
  vy: 0,
  speed: 5,
  jump: 14,
  onGround: false
};

const gravity = 0.6;
const keys = {};

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

/* ===== PLATAFORMAS ===== */
const platforms = [
  { x: 0, y: 500, w: world.width, h: 100 },
  { x: 300, y: 420, w: 150, h: 20 },
  { x: 600, y: 360, w: 150, h: 20 },
  { x: 900, y: 300, w: 150, h: 20 }
];

/* ===== UPDATE ===== */
function update() {
  player.vx = 0;
  if (keys.ArrowLeft) player.vx = -player.speed;
  if (keys.ArrowRight) player.vx = player.speed;

  if (keys.Space && player.onGround) {
    player.vy = -player.jump;
    player.onGround = false;
  }

  player.vy += gravity;

  player.x += player.vx;
  player.y += player.vy;

  player.x = Math.max(0, Math.min(player.x, world.width - player.w));

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

  /* CAMERA */
  camera.x = player.x - canvas.width / 2 + player.w / 2;
  camera.x = Math.max(0, Math.min(camera.x, world.width - canvas.width));
}

/* ===== DRAW ===== */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(-camera.x, 0);

  ctx.fillStyle = '#654321';
  platforms.forEach(p =>
    ctx.fillRect(p.x, p.y, p.w, p.h)
  );

  ctx.fillStyle = '#ff0000';
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.restore();
}

/* ===== LOOP ===== */
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();