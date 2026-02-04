export class Player {
    constructor(gameWidth, gameHeight) {
        this.w = 128;
        this.h = 128;
        this.x = 100;
        this.y = 300;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.jump = 15;
        this.facing = 'right';
        this.onGround = false;
        
        this.image = new Image();
        this.image.src = 'player.png';
        
        this.spriteW = 64;
        this.spriteH = 64;
        this.frameX = 0;
    }

    draw(ctx) {
        ctx.save();
        if (this.facing === 'left') {
            ctx.translate(this.x + this.w / 2, 0);
            ctx.scale(-1, 1);
            ctx.translate(-(this.x + this.w / 2), 0);
        }
        ctx.drawImage(this.image, this.frameX * this.spriteW, 0, this.spriteW, this.spriteH, this.x, this.y, this.w, this.h);
        ctx.restore();
    }

    update(keys, gravity, platforms) {
        // Toda aquela lógica de movimento e colisão que estava no script.js
        // vem para cá, usando "this.x", "this.vx", etc.
    }
}