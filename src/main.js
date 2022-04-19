export { init };
import ImageSprite from './ImageSprite.js';
import { getRandomUnitVector } from './utilities.js';

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const screenWidth = 600;
const screenHeight = 400;

//Player Data
let playerImage;
let currentPlayerAnimation;
let currentAnimationFrame = 0;

let playerSprite; //the sprite object
let playerCenter; //location vector

let playerObj; //physics object

//Physics Variables
let Engine, Runner, Bodies, Composite;

let FrameCounter = 0;

//#region Player Animations
const playerIdle = [
    {x:0, y:0, w: 32, h: 32},
    {x:32, y:0, w: 32, h: 32},
    {x:64, y:0, w: 32, h: 32},
    {x:96, y:0, w: 32, h: 32},
    {x:128, y:0, w: 32, h: 32},
    {x:160, y:0, w: 32, h: 32}
];
const playerMoveRight = [
    {x:0, y:32, w: 32, h: 32},
    {x:32, y:32, w: 32, h: 32},
    {x:64, y:32, w: 32, h: 32},
    {x:96, y:32, w: 32, h: 32},
    {x:128, y:32, w: 32, h: 32},
    {x:160, y:32, w: 32, h: 32}
];
const playerMoveLeft = [
    {x:0, y:64, w: 32, h: 32},
    {x:32, y:64, w: 32, h: 32},
    {x:64, y:64, w: 32, h: 32},
    {x:96, y:64, w: 32, h: 32},
    {x:128, y:64, w: 32, h: 32},
    {x:160, y:64, w: 32, h: 32}
];
const playerJumpPrep = [
    {x:0, y:96, w: 32, h: 32},
    {x:32, y:96, w: 32, h: 32},
    {x:64, y:96, w: 32, h: 32},
    {x:96, y:96, w: 32, h: 32},
    {x:128, y:96, w: 32, h: 32},
    {x:160, y:96, w: 32, h: 32}
];
const playerJump = [
    {x:0, y:128, w: 32, h: 32},
    {x:32, y:128, w: 32, h: 32},
    {x:64, y:128, w: 32, h: 32},
    {x:96, y:128, w: 32, h: 32},
    {x:128, y:128, w: 32, h: 32},
    {x:160, y:128, w: 32, h: 32}
];
const playerFall = [
    {x:0, y:160, w: 32, h: 32},
    {x:32, y:160, w: 32, h: 32},
    {x:64, y:160, w: 32, h: 32},
    {x:96, y:160, w: 32, h: 32},
    {x:128, y:160, w: 32, h: 32},
    {x:160, y:160, w: 32, h: 32}
];
const playerLand = [
    {x:0, y:192, w: 32, h: 32},
    {x:32, y:192, w: 32, h: 32},
    {x:64, y:192, w: 32, h: 32},
    {x:96, y:192, w: 32, h: 32},
    {x:128, y:192, w: 32, h: 32},
    {x:160, y:192, w: 32, h: 32}
];
//#endregion


//Event Handlers (single keypress)
let aKeyPressed = false;
let dKeyPressed = false;
let wKeyPressed = false;

document.addEventListener('keydown', function(event) {
    switch(event.key){
        case 'a':
            playerObj.force.x = -.001;
            break;

        case 'd':
            playerObj.force.x = .001;
            break;

        case 'w':
            playerObj.force.y = -.002;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch(event.key){
        case 'a':
            aKeyPressed = false;
            playerObj.force.x = 0;
            break;
        case 'd':
            dKeyPressed = false;
            playerObj.force.x = 0;
            break;
        case 'w':
            wKeyPressed = false;
            playerObj.force.y = 0;
            break;
    }
});


function init(imgData)
{
    playerImage = imgData.player; //player spritesheet should be the first image loaded
    currentPlayerAnimation = playerFall;

    playerSprite = new ImageSprite(screenWidth/2, screenHeight/2, getRandomUnitVector(), 0, 32, 32, playerImage, "player");
    playerCenter = {x:playerSprite.x + playerSprite.width/2, y:playerSprite.y + playerSprite.height/2}

    initPhysics(playerCenter);
    
    loop();
    checkPhysics();
}

function loop()
{
    //Start loop
    requestAnimationFrame(loop);

    //Fill background
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    //Draw Ground
    ctx.fillStyle = "black";
    ctx.fillRect(0, screenHeight - 35, screenWidth + 30, 60);

    ctx.fillRect(screenWidth - 30, 0, 60, screenHeight);
    ctx.fillRect(-30, 0, 60, screenHeight);

    ctx.fillRect(0, 0, screenWidth + 30, 60);

    //Draw the player
    playerSprite.draw(ctx, currentPlayerAnimation[currentAnimationFrame]);

    //Update player position and animation
    playerSprite.x = playerObj.position.x;
    playerSprite.y = playerObj.position.y;

    updatePlayerAnimation(playerObj);

    //update the animation asynchronously
    if(FrameCounter == 10){
        currentAnimationFrame = (currentAnimationFrame+1) % currentPlayerAnimation.length;
        FrameCounter = 0;
    }
    
    //console.log(playerObj.force);
    FrameCounter++;

    //console.log(FrameCounter);
}

function initPhysics(playerCenter)
{
    Engine = Matter.Engine;
    Runner = Matter.Runner;
    Bodies = Matter.Bodies;
    Composite = Matter.Composite;

    // create an engine
    let engine = Engine.create();

    // create two boxes and a ground
    playerObj = Bodies.rectangle(playerCenter.x, playerCenter.y, 8, 8);
    console.log(playerObj);

    let ground = Bodies.rectangle(screenWidth/2, screenHeight - 30, screenWidth, 60, { isStatic: true });

    let wall1 = Bodies.rectangle(screenWidth - 30, screenHeight, 60, screenHeight, { isStatic: true });
    let wall2 = Bodies.rectangle(0, screenHeight, 60, screenHeight, { isStatic: true });

    let ceiling = Bodies.rectangle(screenWidth/2, 0, screenWidth, 60, { isStatic: true });

    // add all of the bodies to the world
    Composite.add(engine.world, [playerObj, ground, wall1, wall2, ceiling]);

    // create runner
    let runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
}

function updatePlayerAnimation(playerObj)
{
    //player is falling when: velocity.y is bigger than 0 and moving at a total speed faster than 1
    if(playerObj.velocity.y > 0 && playerObj.speed > 1)
    {
        currentPlayerAnimation = playerFall;
        return;
    }
    
    //player is landing when:
    if(currentPlayerAnimation == playerFall && playerObj.speed < 1)
    {
        currentPlayerAnimation = playerLand;
        currentAnimationFrame = 0;
        return;
    }
    
    if(currentPlayerAnimation == playerLand && currentAnimationFrame != 5)
    {
        currentPlayerAnimation = playerIdle;
        return;
    }


    //player is preparing to jump when:
    if((currentPlayerAnimation == playerIdle || currentPlayerAnimation == playerMoveRight || currentPlayerAnimation == playerMoveLeft) && playerObj.force.y > 0)
    {
        currentPlayerAnimation = playerJumpPrep;
        return;   
    }

    //player is jumping when:
    if(currentPlayerAnimation == playerJumpPrep && currentAnimationFrame != 5) 
    {
        currentPlayerAnimation = playerJump;
        return;
    }

    if(playerObj.velocity.y < 0 && playerObj.speed > 1 && currentPlayerAnimation != playerJump)
    {
        currentPlayerAnimation = playerJump;
        return;
    }

    //player is idle when: completely stationary and not preparing to jump or land
    if(playerObj.speed < 1 && (currentPlayerAnimation != playerLand || currentPlayerAnimation != playerJumpPrep))
    {
        currentPlayerAnimation = playerIdle; 
        return;
    }
}

function updateAnimationFrame()
{
    currentAnimationFrame = (currentAnimationFrame+1) % currentPlayerAnimation.length;
}

// module aliases

