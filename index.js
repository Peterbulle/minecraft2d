const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rows = 20;
const cols = 26;
const blockSize = 30;
const grid = [];
const blockCount = {};

let selectedBlock = 'grass';

// Initialize the grid with empty blocks and block count
for (let row = 0; row < rows; row++) {
    grid[row] = [];
    for (let col = 0; col < cols; col++) {
        grid[row][col] = 'empty';
    }
}

const blockTypes = ['grass', 'dirt', 'stone', 'water', 'sand', 'wood', 'brick',
    'cobblestone', 'oakPlank', 'ironOre', 'goldOre', 'diamondOre', 'coalOre',
    'redstoneOre', 'emeraldOre', 'obsidian', 'netherrack', 'netherBrick',
    'endStone', 'glowstone', 'quartzOre', 'clay', 'gravel', 'mycelium',
    'sandstone', 'redSandstone', 'prismarine', 'darkPrismarine', 'seaLantern',
    'purpur', 'boneBlock', 'terracotta', 'redTerracotta', 'blueTerracotta',
    'greenTerracotta', 'yellowTerracotta'];

blockTypes.forEach(block => blockCount[block] = 0);

// Character position
let player = {
    x: Math.floor(cols / 2),
    y: Math.floor(rows / 2),
    width: blockSize,
    height: blockSize * 1.5,
    headSize: blockSize / 2,
    bodyColor: '#6495ED',
    pantsColor: '#0000FF',
    skinColor: '#F5CBA7',
    hairColor: '#8B4513'
};

// Set block types
function setBlockType(type) {
    selectedBlock = type;
}

// Create block patterns
function createPattern(color1, color2, design = 'checkerboard') {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 10;
    patternCanvas.height = 10;
    const pCtx = patternCanvas.getContext('2d');

    pCtx.fillStyle = color1;
    pCtx.fillRect(0, 0, 10, 10);

    switch (design) {
        case 'checkerboard':
            pCtx.fillStyle = color2;
            pCtx.fillRect(0, 0, 5, 5);
            pCtx.fillRect(5, 5, 5, 5);
            break;
        case 'stripes':
            pCtx.fillStyle = color2;
            pCtx.fillRect(0, 0, 10, 5);
            break;
        case 'dots':
            pCtx.fillStyle = color2;
            pCtx.beginPath();
            pCtx.arc(5, 5, 3, 0, 2 * Math.PI);
            pCtx.fill();
            break;
        case 'cross':
            pCtx.fillStyle = color2;
            pCtx.fillRect(4, 0, 2, 10);
            pCtx.fillRect(0, 4, 10, 2);
            break;
        case 'grid':
            pCtx.fillStyle = color2;
            pCtx.fillRect(3, 0, 4, 10);
            pCtx.fillRect(0, 3, 10, 4);
            break;
    }

    return ctx.createPattern(patternCanvas, 'repeat');
}

// Updated textures with unique designs
const textures = {
    grass: createPattern('#32CD32', '#228B22', 'checkerboard'),
    dirt: createPattern('#8B4513', '#A0522D', 'dots'),
    stone: createPattern('#808080', '#696969', 'stripes'),
    water: createPattern('#1E90FF', '#104E8B', 'cross'),
    sand: createPattern('#F4A460', '#DEB887', 'grid'),
    wood: createPattern('#A0522D', '#8B4513', 'stripes'),
    brick: createPattern('#B22222', '#8B0000', 'checkerboard'),

    // 30 New Blocks with unique patterns
    cobblestone: createPattern('#A9A9A9', '#696969', 'grid'),
    oakPlank: createPattern('#D2B48C', '#8B4513', 'stripes'),
    ironOre: createPattern('#C0C0C0', '#B0C4DE', 'dots'),
    goldOre: createPattern('#FFD700', '#FFA500', 'checkerboard'),
    diamondOre: createPattern('#00CED1', '#4682B4', 'cross'),
    coalOre: createPattern('#2F4F4F', '#1C1C1C', 'grid'),
    redstoneOre: createPattern('#8B0000', '#FF0000', 'dots'),
    emeraldOre: createPattern('#50C878', '#006400', 'cross'),
    obsidian: createPattern('#4B0082', '#2F2F4F', 'stripes'),
    netherrack: createPattern('#8B3A3A', '#B22222', 'checkerboard'),
    netherBrick: createPattern('#3D2B1F', '#8B0000', 'stripes'),
    endStone: createPattern('#FFFF99', '#FFFF66', 'dots'),
    glowstone: createPattern('#F5DEB3', '#FFE4B5', 'grid'),
    quartzOre: createPattern('#E0E0E0', '#FFFFFF', 'cross'),
    clay: createPattern('#B0C4DE', '#D3D3D3', 'checkerboard'),
    gravel: createPattern('#A9A9A9', '#C0C0C0', 'stripes'),
    mycelium: createPattern('#8B4513', '#C0C0C0', 'dots'),
    sandstone: createPattern('#F4A460', '#DEB887', 'grid'),
    redSandstone: createPattern('#CD5C5C', '#F08080', 'checkerboard'),
    prismarine: createPattern('#00CED1', '#4682B4', 'cross'),
    darkPrismarine: createPattern('#013220', '#004b23', 'stripes'),
    seaLantern: createPattern('#E0FFFF', '#AFEEEE', 'dots'),
    purpur: createPattern('#9370DB', '#8A2BE2', 'checkerboard'),
    boneBlock: createPattern('#F5F5DC', '#FAFAD2', 'grid'),
    terracotta: createPattern('#D2691E', '#A0522D', 'stripes'),
    redTerracotta: createPattern('#A52A2A', '#800000', 'cross'),
    blueTerracotta: createPattern('#00008B', '#0000CD', 'checkerboard'),
    greenTerracotta: createPattern('#228B22', '#006400', 'stripes'),
    yellowTerracotta: createPattern('#DAA520', '#FFD700', 'dots')
};

// Load sound effects
const placeSound = new Audio('place.mp3'); // Replace with actual path to your sound file
const breakSound = new Audio('break.mp3'); // Replace with actual path to your sound file

// Draw the grid and the player
function drawGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let texture = textures[grid[row][col]];
            if (!texture) {
                texture = '#87CEEB'; // Default background color
            }
            ctx.fillStyle = texture;
            ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
            ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
        }
    }
    drawPlayer();
    updateBlockCount();
}

// Draw the player character (Steve-like)
function drawPlayer() {
    const playerX = player.x * blockSize;
    const playerY = player.y * blockSize;

    // Draw the body
    ctx.fillStyle = player.bodyColor;
    ctx.fillRect(playerX, playerY + player.headSize, player.width, player.height - player.headSize);

    // Draw the pants
    ctx.fillStyle = player.pantsColor;
    ctx.fillRect(playerX, playerY + player.headSize + player.height / 2, player.width, player.height / 2);

    // Draw the head
    ctx.fillStyle = player.skinColor;
    ctx.fillRect(playerX + player.width / 4, playerY, player.headSize, player.headSize);

    // Draw the hair
    ctx.fillStyle = player.hairColor;
    ctx.fillRect(playerX + player.width / 4, playerY, player.headSize, player.headSize / 4);
}

// Block Break Animation
function breakBlockAnimation(row, col) {
    const originalBlock = grid[row][col];
    grid[row][col] = 'stone'; // Temporary texture for break animation

    // Draw with the break animation
    drawGrid();

    // Restore the original block after a short delay
    setTimeout(() => {
        grid[row][col] = 'empty';
        drawGrid();
    }, 200); // Duration of the break animation
}

// Update block count display
function updateBlockCount() {
    const countContainer = document.getElementById('blockCount');
    if (countContainer) {
        countContainer.innerHTML = '';
        blockTypes.forEach(type => {
            countContainer.innerHTML += `<div>${type}: ${blockCount[type]}</div>`;
        });
    }
}

// Handle block placement
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / blockSize);
    const row = Math.floor(y / blockSize);

    // Toggle block placement
    if (grid[row][col] === 'empty') {
        grid[row][col] = selectedBlock;
        placeSound.play();
    } else {
        breakBlockAnimation(row, col);
        breakSound.play();
    }

    // Update block count
    blockCount[selectedBlock] += 1;
    drawGrid();
});

// Handle player movement
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            if (player.y > 0) player.y -= 1;
            break;
        case 's':
            if (player.y < rows - 1) player.y += 1;
            break;
        case 'a':
            if (player.x > 0) player.x -= 1;
            break;
        case 'd':
            if (player.x < cols - 1) player.x += 1;
            break;
    }
    drawGrid();
});

// Initial draw
drawGrid();
