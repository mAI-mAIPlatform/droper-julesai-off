const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
const game = {
    running: true,
    lastTime: 0
};

// Tactical Objects
const objects = [];

// Player setup
const player = {
    x: 400,
    y: 300,
    size: 20,
    color: '#e74c3c',
    speed: 200 // pixels per second
};

// Input handling
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    // Tactical Deployments (Instant trigger)
    if (e.key === '1') {
        deployObject('tent');
    }
    if (e.key === '2') {
        deployObject('trampoline');
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update function
function update(deltaTime) {
    // Movement logic
    let moveX = 0;
    let moveY = 0;

    if (keys['w'] || keys['ArrowUp']) moveY -= 1;
    if (keys['s'] || keys['ArrowDown']) moveY += 1;
    if (keys['a'] || keys['ArrowLeft']) moveX -= 1;
    if (keys['d'] || keys['ArrowRight']) moveX += 1;

    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
        const factor = 1 / Math.sqrt(2);
        moveX *= factor;
        moveY *= factor;
    }

    player.x += moveX * player.speed * deltaTime;
    player.y += moveY * player.speed * deltaTime;

    // Boundary checks
    const halfSize = player.size / 2;
    if (player.x < halfSize) player.x = halfSize;
    if (player.x > canvas.width - halfSize) player.x = canvas.width - halfSize;
    if (player.y < halfSize) player.y = halfSize;
    if (player.y > canvas.height - halfSize) player.y = canvas.height - halfSize;
}

// Render function
function render() {
    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Objects
    objects.forEach(obj => {
        if (obj.type === 'tent') {
            ctx.fillStyle = '#f1c40f'; // Yellow
            ctx.fillRect(obj.x - 15, obj.y - 15, 30, 30);
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(obj.x - 15, obj.y - 15, 30, 30);
        } else if (obj.type === 'trampoline') {
            ctx.fillStyle = '#3498db'; // Blue
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.stroke();
        }
    });

    // Draw Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
}

function deployObject(type) {
    objects.push({
        type: type,
        x: player.x,
        y: player.y,
        timestamp: Date.now()
    });
}

// Game Loop
function gameLoop(timestamp) {
    if (!game.running) return;

    const deltaTime = (timestamp - game.lastTime) / 1000;
    game.lastTime = timestamp;

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}

// Start the game
requestAnimationFrame(gameLoop);
