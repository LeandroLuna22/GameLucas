const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 1. Configuração de Resolução Fixa (16:9)
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

function setupCanvas() {
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    ctx.imageSmoothingEnabled = false;
}
setupCanvas();

/* ===== MUNDO E CAMERA ===== */
const world = { width: 2000, height: 720 };
const camera = { x: 0, y: 0 };
const gravity = 0.6;
const keys = {};

// Carrega a imagem de fundo
const backgroundImg = new Image();
backgroundImg.src = 'world1.png'; // Crie ou baixe uma imagem 1280x720 e coloque-a aqui

/* ===== PLAYER COM SPRITE ===== */
const playerImg = new Image();
playerImg.src = 'player.png'; 

const player = {
    x: 100, y: 300,
    w: 128, h: 128,
    spriteW: 64, spriteH: 64,
    frameX: 0, frameY: 0,
    vx: 0, vy: 0,
    speed: 5, jump: 15,
    onGround: false,
    facing: 'right' // 'right' ou 'left'
};

/* ===== PLATAFORMAS ===== */
const platforms = [
    { x: 0, y: 600, w: 2000, h: 120 },
    { x: 300, y: 450, w: 200, h: 30 },
    { x: 650, y: 350, w: 200, h: 30 },
    { x: 1000, y: 250, w: 200, h: 30 }
];

/* ===== INPUTS ===== */
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

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
    if (pos.y < GAME_HEIGHT / 2) {
        if (player.onGround) {
            player.vy = -player.jump;
            player.onGround = false;
        }
    } else {
        if (pos.x < GAME_WIDTH / 2) {
            keys.ArrowLeft = true;
        } else {
            keys.ArrowRight = true;
        }
    }
}, { passive: false });

window.addEventListener('touchend', () => {
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
});

/* ===== LÓGICA DO JOGO ===== */
let gameFrame = 0;
const staggerFrames = 6;

function update() {
    // Movimento e Direção (Onde o facing é atualizado)
    player.vx = 0;
    if (keys.ArrowLeft || keys.KeyA) {
        player.vx = -player.speed;
        player.facing = 'left';
    }
    if (keys.ArrowRight || keys.KeyD) {
        player.vx = player.speed;
        player.facing = 'right';
    }

    // Pulo
    if ((keys.Space || keys.ArrowUp || keys.KeyW) && player.onGround) {
        player.vy = -player.jump;
        player.onGround = false;
    }

    player.vy += gravity;
    player.x += player.vx;
    player.y += player.vy;

    // Colisão
    player.onGround = false;
    platforms.forEach(p => {
        if (player.x < p.x + p.w &&
            player.x + player.w > p.x &&
            player.y + player.h <= p.y + 10 &&
            player.y + player.h + player.vy >= p.y) {
            if (player.vy > 0) {
                player.y = p.y - player.h;
                player.vy = 0;
                player.onGround = true;
            }
        }
    });

    // Limites e Câmera
    player.x = Math.max(0, Math.min(player.x, world.width - player.w));
    camera.x = player.x - GAME_WIDTH / 2 + player.w / 2;
    camera.x = Math.max(0, Math.min(camera.x, world.width - GAME_WIDTH));

    // Animação
    if (player.vx !== 0) {
        if (gameFrame % staggerFrames === 0) {
            player.frameX < 3 ? player.frameX++ : player.frameX = 0;
        }
    } else {
        player.frameX = 0;
    }
    gameFrame++;
}

/* ===== DESENHO ===== */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a imagem de fundo PRIMEIRO
    if (backgroundImg.complete && backgroundImg.naturalWidth !== 0) {
        ctx.drawImage(backgroundImg, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    } else {
        // Fallback: se a imagem não carregar, usa a cor de fundo definida no CSS (ou uma cor sólida)
        ctx.fillStyle = 'rgb(180, 180, 224)'; // Cor de fundo do canvas no CSS
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
    
    ctx.save();
    ctx.translate(-camera.x, 0);

    // Plataformas
    ctx.fillStyle = '#59b377';
    platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

    // Player com Espelhamento
    ctx.save(); 
    if (player.facing === 'left') {
        // Inverte o contexto centralizado no player
        ctx.translate(player.x + player.w / 2, 0); 
        ctx.scale(-1, 1);
        ctx.translate(-(player.x + player.w / 2), 0);
    }

    if (playerImg.complete && playerImg.naturalWidth !== 0) {
        ctx.drawImage(
            playerImg,
            player.frameX * player.spriteW, player.frameY * player.spriteH,
            player.spriteW, player.spriteH,
            player.x, player.y, player.w, player.h
        );
    } else {
        // Backup visual caso o sprite suma
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, player.w, player.h);
    }
    
    ctx.restore(); // Fecha espelhamento
    ctx.restore(); // Fecha câmera
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
loop();