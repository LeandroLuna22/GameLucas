const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Resolução lógica fixa (16:9)
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

function resize() {
  // O canvas interno SEMPRE terá esse tamanho, independente do monitor
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  
  // Essencial para não borrar após o resize
  ctx.imageSmoothingEnabled = false;
}
resize();
// Remova o window.addEventListener('resize', resize) se não quiser que
// a resolução interna mude, apenas o CSS cuida do tamanho visual.
// Não precisamos mais do listener de resize para o canvas.width 
// se a resolução for fixa, mas é bom manter para o ctx.imageSmoothingEnabled

function getTouchPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.touches[0].clientX - rect.left) * scaleX,
    y: (e.touches[0].clientY - rect.top) * scaleY
  };
}

window.addEventListener('touchstart', e => {
  e.preventDefault();
  const pos = getTouchPos(e);

  // Agora usamos 'pos.x' e 'pos.y' que estão na escala 1280x720
  if (pos.y < BASE_HEIGHT / 2) {
    if (player.onGround) {
      player.vy = -player.jump;
      player.onGround = false;
    }
  } else {
    if (pos.x < BASE_WIDTH / 2) keys.ArrowLeft = true;
    else keys.ArrowRight = true;
  }
}, { passive: false });

/* ===== MUNDO ===== */
const world = {
  width: 2000,
  height: 720
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

/* ===== CONTROLES TOUCH ===== */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Mantém os pixels nítidos após o resize
  ctx.imageSmoothingEnabled = false; 
}

/* Nos eventos de touch, adicione preventDefault */
window.addEventListener('touchstart', e => {
    e.preventDefault(); // Impede scrolls e gestos do navegador
    // ... seu código de toque aqui (usando e.touches[0])
}, { passive: false });

window.addEventListener('touchend', () => {
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
});

/* ===== PLATAFORMAS ===== */
const platforms = [
  { x: 0, y: 550, w: 2000, h: 200 },
  { x: 300, y: 420, w: 150, h: 20 },
  { x: 600, y: 360, w: 150, h: 20 },
  { x: 900, y: 300, w: 150, h: 20 }
];

function update() {
  // 1. Movimento Horizontal (vx)
  player.vx = 0;
  if (keys.ArrowLeft) player.vx = -player.speed;
  if (keys.ArrowRight) player.vx = player.speed;

  // 2. Movimento Vertical (vy) - PULO
  // Se o pulo "vai para a frente" sozinho, certifique-se de que vy só afeta o eixo Y
  if (keys.Space && player.onGround) {
    player.vy = -player.jump; // Força negativa para subir
    player.onGround = false;
  }

  // 3. Aplica Gravidade
  player.vy += gravity;

  // 4. Aplica as velocidades à posição
  player.x += player.vx; // Move pros lados
  player.y += player.vy; // Move pra cima/baixo

  // 5. Limites do Mundo
  player.x = Math.max(0, Math.min(player.x, world.width - player.w));

  // 6. Colisão com Plataformas
  player.onGround = false;
  platforms.forEach(p => {
    if (
      player.x < p.x + p.w &&
      player.x + player.w > p.x &&
      player.y + player.h <= p.y + 10 && 
      player.y + player.h + player.vy >= p.y
    ) {
      if (player.vy > 0) { // Só colide se estiver a cair
          player.y = p.y - player.h;
          player.vy = 0;
          player.onGround = true;
      }
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

  // Desenha Chão/Plataformas
  ctx.fillStyle = '#654321';
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

  // Desenha Player
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