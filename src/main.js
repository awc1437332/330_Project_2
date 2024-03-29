export { init };
import ImageSprite from './ImageSprite.js';
import { getRandomUnitVector } from './utilities.js';

const canvas = document.querySelector("canvas");
let ctx;
let screenWidth;
let screenHeight
if(canvas) {
    ctx = canvas.getContext("2d");
    screenWidth = canvas.width;
    screenHeight = canvas.height;
}
 

const text = document.querySelector("#flavor-text");
const stats = document.querySelector("#player-stats");

const clearBtn = document.querySelector("#clear-btn");
const musicToggle = document.querySelector("#music-enabled");
const volumeSlide = document.querySelector("#volume-slider");

let currentLevel = 1;
//#region Variables
let stillLooping = false;

let musicEnabled = true;


//Player Data
let playerImage;
let unlockableImage;
let currentPlayerAnimation;
let currentAnimationFrame = 0;

let playerSprite; //the sprite object
let basePlayerSprite;
let altPlayerSprite;

let playerCenter; //location vector

let playerObj; //physics object

let crownsCollected = 0;

//Physics Variables
let Engine, Render, Runner, Body, Bodies, Composite, Collision;
let render;
let engine;

let boxColliders = [];
let crowns = [];
let doorObj;

let FrameCounter = 0;
let frameCounter = 0;
let sCounter = 0;
let minCounter = 0;
let hCounter = 0;

let titleImage;
let backgroundImg;
let levelImgs;
let currentLevelImage;
let crownImg;
let doorImg;

let crownSkinUnlocked = false;

//JSON Level Data and Local Storage Data
let JSONData;
let localData;
const playerKey = "playerData";

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

//level data
let baseLevelImage;

//Music
let backgroundMusic;
let bounceSFX;
let pickupSFX;
let nextLevelSFX;

//Event Handlers (single keypress) - listen for input and set bool
//Handles both WASD and Arrow Keys
let leftInputPressed = false;
let rightInputPressed = false;
let topInputPressed = false;
//#endregion

//#region Functions
//Parse level JSON data using fetch
function fetchData()
{
    let fetchPromise = async () =>{
        let levelData = await fetch("data/level-data.json");

        if(!levelData.ok){
            throw new Error(`Error getting races: status ${response.status}`);
        }

        let levelJSON = await levelData.json();


        //store data in global variable
        JSONData = levelJSON;
        console.log(JSONData);
    };

    fetchPromise().catch(e => {
        console.log(`in catch with e = ${e}`);
    });
}

//Setup data using loaded images, initialize main menu
function init(imgData)
{
    //localStorage.clear();
    

    //Fetch only if data is not set
    if(!JSONData)
    {
        fetchData();
    }

    //load in player data from local storage
    localData = JSON.parse(localStorage.getItem(playerKey));
    if(!localData)
    {
        localData = 
        {
            skinUnlocked:false,
            numCrowns:0,
            bestTime: //Set default best time to a whole hour
            {
                frames:0,
                seconds:0,
                minutes:0,
                hours:1
            }
        }
        localStorage.setItem(playerKey, JSON.stringify(localData));
        //JSON.parse(localData);
    }

    //add background music
    backgroundMusic = new Audio("./media/platformerMusic.wav");
    bounceSFX = new Audio("./media/bounce.wav");
    pickupSFX = new Audio("./media/pickup.ogg");
    nextLevelSFX = new Audio("./media/nextLevel.wav");

    //#region IMG Data
    //initialize variables using image data
    playerImage = imgData.player; //player spritesheet should be the first image loaded
    unlockableImage = imgData.kingPlayer;

    backgroundImg = imgData.background;
    titleImage = imgData.titleScreen;
    baseLevelImage = imgData.baseLevel;

    levelImgs = []; //add level images into an array for easy reference
    levelImgs.push(imgData.levelOne);
    levelImgs.push(imgData.levelTwo);
    levelImgs.push(imgData.levelThree);
    levelImgs.push(imgData.levelFour);
    levelImgs.push(imgData.levelFive);
    levelImgs.push(imgData.levelSix);
    levelImgs.push(imgData.levelSeven);
    levelImgs.push(imgData.levelEight);
    levelImgs.push(imgData.levelNine);
    levelImgs.push(imgData.levelTen);

    currentLevelImage = levelImgs[currentLevel-1];

    crownImg = imgData.crown;
    doorImg = imgData.door;
    //#endregion

    //Player animation
    currentPlayerAnimation = playerFall;

    //Player sprites
    basePlayerSprite = new ImageSprite(screenWidth/2, screenHeight/2, getRandomUnitVector(), 0, 32, 32, playerImage, "player");
    altPlayerSprite = new ImageSprite(screenWidth/2, screenHeight/2, getRandomUnitVector(), 0, 32, 32, unlockableImage, "player");

    playerSprite = basePlayerSprite;

    //Get player character's center point
    playerCenter = {x:playerSprite.x + playerSprite.width/2, y:playerSprite.y + playerSprite.height/2}

    //Draw Main Menu
    ctx.drawImage(titleImage, 0, 0);

    document.onkeypress = (event) => 
    {
        switch(event.key){
            case 'Enter':
                setupGame();
                loop();
                break;
        }
    }

    //document.addEventListener('keypress', function(event) {
    //    switch(event.key){
    //        case 'Enter':
    //            setupGame();
    //            loop();
    //            break;
    //    }
    //});

    //Setup UI
    if(text){
        text.innerHTML = `Total Crowns Collected: ${localData.numCrowns}<br>`;
    }

    if(stats){
        stats.innerHTML = `Best time: ${localData.bestTime.hours}:${localData.bestTime.minutes}:${localData.bestTime.seconds}:${localData.bestTime.frames}`;
    }

    setupOptions();
}

//game loop
function loop()
{
    //because request animation frame is so finicky
    if(!stillLooping)
    {
        return;
    }

    //Start loop
    requestAnimationFrame(loop);

    //setTimeout(loop, 25);

    //Draw the objects in the level
    drawLevel();
    updatePlayer();

    //update the animation "asynchronously"
    if(FrameCounter == 5){
        currentAnimationFrame = (currentAnimationFrame+1) % currentPlayerAnimation.length;
        FrameCounter = 0;
    }
    FrameCounter++;
    

    //Check if the player is colliding with a crown pickup
    if(crowns.length > 0) //preliminary check to see if there are items in the crowns array
    {
        for(let i = 0; i < crowns.length; i++)
        {
            if(Collision.collides(playerObj, crowns[i]))
            {
                //Adjust local data
                crownsCollected++; //number of crowns for this game

                localData.numCrowns++; //number of crowns collected total
                localStorage.setItem(playerKey, JSON.stringify(localData));

                if(musicEnabled)
                {
                    pickupSFX.play();
                }
                //stats.innerHTML = `Best time: ${localData.bestTime.hours}:${localData.bestTime.minutes}:${localData.bestTime.seconds}:${localData.bestTime.frames} | Time: ${hCounter}:${minCounter}:${sCounter}:${frameCounter}`;
                Composite.remove(engine.world, crowns[i]);
                crowns.splice(i, 1);
                i--;
            }
        }
    }

    if(Collision.collides(playerObj, doorObj)){
        //only move to next level if there is a next level to move to
        if(musicEnabled)
        {
            nextLevelSFX.play();
        }
        if (currentLevel < 10){
            currentLevel++;
            setupLevel(currentLevel);
        }
        else{
            returnToMainMenu();
        }
    }

    //Timer
    frameCounter++;
    if(frameCounter >= 60) //60Frames/1second
    {
        sCounter++;
        frameCounter = 0;
    }

    if(sCounter >= 60) //60s/1min
    {
        minCounter++;
        sCounter = 0;
    }

    if(minCounter >= 60)//60mins/1hr (there is no way it takes anyone *this* long to beat all 10 levels)
    {
        hCounter++;
        minCounter = 0;        
    }
    text.innerHTML = `Level ${currentLevel}: "${JSONData.levels[currentLevel - 1].title}"<br>Crowns collected: ${crownsCollected} | Total Crowns Collected: ${localData.numCrowns}<br>`;
    stats.innerHTML = `Best time: ${localData.bestTime.hours}:${localData.bestTime.minutes}:${localData.bestTime.seconds}:${localData.bestTime.frames} | Time: ${hCounter}:${minCounter}:${sCounter}:${frameCounter}`;

    //For debug purposes
    //Render.lookAt(render, playerObj, {x:100, y:150});
}

//Helper Functions
//Setup Matter.js, add bounding box to scene, and add player collider that will not rotate
//(Debug: adds Matter.js physics renderer)
function initPhysics(playerCenter)
{
    Engine = Matter.Engine;
    Render = Matter.Render;
    Runner = Matter.Runner;
    Body = Matter.Body;
    Bodies = Matter.Bodies;
    Composite = Matter.Composite;
    Collision = Matter.Collision;


    // create an engine
    engine = Engine.create();

    //if(!render) //make sure only one renderer is ever on screen
    //{
    //    render = Render.create({
    //        element: document.body,
    //        engine: engine
    //    });
    //}

    // create two boxes and a ground
    playerObj = Bodies.rectangle(playerCenter.x, playerCenter.y, 16, 16);
    playerObj.friction = 0;
    playerObj.mass = 1;

    Body.setInertia(playerObj, Infinity); //So the physics object does not rotate and cause any abnormalities with animation
    //console.log(playerObj);

    //Create bounding box
    addBoxCollider(screenWidth/2, screenHeight - 16, screenWidth, 32);
    addBoxCollider(screenWidth + 16, screenHeight/2, 32, screenHeight);
    addBoxCollider(-16, screenHeight/2, 32, screenHeight);
    addBoxCollider(screenWidth/2, -16, screenWidth, 32);

    // add all of the bodies to the world
    Composite.add(engine.world, [playerObj]);

    // run the renderer
    //Render.run(render);
    
    // create runner
    let runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
}

//Adds Control Event Listeners, begins game loop
function setupGame()
{
    stillLooping = true;
    //initPhysics(playerCenter);

    if(musicEnabled)
    {
        backgroundMusic.play();
    }

    backgroundMusic.loop = true;

    //Set initial player sprite
    if(localData.skinUnlocked)
    {
        playerSprite = altPlayerSprite;
    }
    else
    {
        playerSprite = basePlayerSprite;
    }

    //Event Listeners
    //remove original keypress eventlistener
    document.onkeypress = null;

    document.onkeypress = (event) => 
    {
        switch(event.key){
            case 'a':
            case "ArrowLeft":
                leftInputPressed = true;
                break;
    
            case 'd':
            case "ArrowRight":
                rightInputPressed = true;
                break;
    
            case 'w': //W is the only key that doesnt require constant key press
            case "ArrowUp":
                topInputPressed = true;
                Body.setVelocity(playerObj, {x:playerObj.velocity.x, y:-10});
                if(musicEnabled)
                {
                    if(musicEnabled)
                    {
                        bounceSFX.play();
                    }
                }
                break;
        }
    }

    document.onkeyup = (event) => 
    {
        switch(event.key){
            case 'a':
            case "ArrowLeft":
                leftInputPressed = false;
                break;
    
            case 'd':
            case "ArrowRight":
                rightInputPressed = false;
                break;
    
            case 'w': //W is the only key that doesnt require constant key press
            case "ArrowUp":
                topInputPressed = false;
                break;
        }
    }

    setupLevel(currentLevel);
}

//Draw the player
function updatePlayer()
{
    //Draw the player
    playerSprite.draw(ctx, currentPlayerAnimation[currentAnimationFrame]);

    //Update player position and animation
    playerSprite.x = playerObj.position.x - playerSprite.width/2;
    playerSprite.y = playerObj.position.y - playerSprite.width/2;

    updatePlayerAnimation(playerObj);

    //Update player velocity based on keypresses
    if(leftInputPressed && !rightInputPressed) //Move Left
    {
        Body.setVelocity(playerObj, {x:-5, y:playerObj.velocity.y});
    }

    if(!leftInputPressed && rightInputPressed) //Move Right
    {
        Body.setVelocity(playerObj, {x:5, y:playerObj.velocity.y});
    }

    if((leftInputPressed && rightInputPressed) || (!leftInputPressed && !rightInputPressed)) //Dont move if there are no keys down or both A and D are pressed simultaneously
    {
        Body.setVelocity(playerObj, {x:0, y:playerObj.velocity.y});
    }
}

//Helper function to update player's animation to prevent cluttering the code too much
function updatePlayerAnimation(playerObj)
{   
    //console.log(playerObj.velocity);

    //Player moving left or right
    if(playerObj.velocity.x > 2)
    {
        currentPlayerAnimation = playerMoveRight;
        return;
    }

    if(playerObj.velocity.x < -2)
    {
        currentPlayerAnimation = playerMoveLeft;
        return;
    }

    if(currentPlayerAnimation == playerFall && topInputPressed)
    {
        currentPlayerAnimation = playerJump;
        return;
    }


    //player is landing when:
    if(currentPlayerAnimation == playerFall && playerObj.velocity.y <= 0)
    {
        currentPlayerAnimation = playerLand;
        currentAnimationFrame = 0;
        return;
    }

    if(currentPlayerAnimation == playerLand && currentAnimationFrame >= 5)
    {
        currentPlayerAnimation = playerIdle;
        return;
    }
    else if (currentPlayerAnimation == playerLand)
    {
        return;
    }

    //player is falling when: velocity.y is bigger than 0 and moving at a total speed faster than 1
    if(playerObj.velocity.y > 1 && playerObj.speed > 1)
    {
        currentPlayerAnimation = playerFall;
        return;
    }

    if(playerObj.speed < 2)
    {
       currentPlayerAnimation = playerIdle; 
       return;
    }

    //player is jumping when:
    if(playerObj.velocity.y <= 0)
    {
        currentPlayerAnimation = playerJump;
        return;
    }
}

//#region Helper Collider add Methods
function addBoxCollider(x, y, width, height)
{
    //reference to new box
    let newBox = Bodies.rectangle(x, y, width, height, { isStatic: true });

    //add to collection of all boxes
    boxColliders.push(newBox);

    //add to physics renderer
    Composite.add(engine.world, [newBox]);

    //console.log(newBox);
}

function addCrown(x, y)
{
    let newCrown = Bodies.rectangle(x, y, 32, 32, {isStatic: true});
    crowns.push(newCrown);

    Composite.add(engine.world, [newCrown]);

    //console.log(newCrown);
}

function setExit(x, y)
{
    doorObj = Bodies.rectangle(x, y, 32, 32, {isStatic: true});
    Composite.add(engine.world, [doorObj]);
    
    //console.log(doorObj);
}
//#endregion


//#region Level Functions
//Uses level JSON data to add platforms, pickups, and the level exit
function setupLevel(levelNum)
{
    //clear any current level data
    clearLevel();
    initPhysics(playerCenter);

    currentLevelImage = levelImgs[levelNum - 1];

    let levelObj = JSONData.levels[levelNum - 1];

    //Move the player to the start position
    Body.setPosition(playerObj, levelObj.playerPosition);

    //Add the physics bodies
    for(let i = 0; i < levelObj.tiles.length; i++)
    {
        addBoxCollider(levelObj.tiles[i].x, levelObj.tiles[i].y, levelObj.tiles[i].width, levelObj.tiles[i].height);
    }

    //Add the crowns
    for(let i = 0; i < levelObj.crowns.length; i++)
    {
        addCrown(levelObj.crowns[i].x, levelObj.crowns[i].y);
    }

    //Add the exit door
    setExit(levelObj.exit.x, levelObj.exit.y);
}

//Clear all objects (INCLUDING PLAYER) from the physics simulation
function clearLevel()
{
    //preliminary check to make sure the level actually has colliders to remove
    if(boxColliders.length < 1){
        return;
    }

    Composite.clear(engine.world, false);
    boxColliders = [];
    crowns = [];
    doorObj = null;
}

//Draw all physics components in the physics simulation
function drawLevel()
{
    //background
    ctx.fillStyle = 'green';
    //ctx.fillRect(0, 0, screenWidth, screenHeight);
    ctx.drawImage(backgroundImg, 0, 0);
    
    //environment (for debugging purposes only)
    /*ctx.fillStyle = "black";
    for (let i = 0; i < boxColliders.length; i++)
    {
        //x, y, width, height
        ctx.fillRect(boxColliders[i].vertices[0].x, boxColliders[i].vertices[0].y, boxColliders[i].vertices[1].x - boxColliders[i].vertices[0].x, boxColliders[i].vertices[2].y - boxColliders[i].vertices[0].y);
    }*/

    //Draw BaseLevel
    //ctx.drawImage(baseLevelImage, 0, 0);

    //Draw CurrentLevel
    ctx.drawImage(currentLevelImage, 0, 0);

    //Draw Crowns
    for(let i = 0; i < crowns.length; i++)
    {
        ctx.drawImage(crownImg, crowns[i].vertices[0].x, crowns[i].vertices[0].y);
    }

    //Draw Exit
    ctx.drawImage(doorImg, doorObj.vertices[0].x, doorObj.vertices[0].y);
}
//#endregion

//Resets game to main menu
function returnToMainMenu()
{
    //Update best time if necessary
    updateBestTime();

    //Check to see if the player has done the special objective
    if(getTotalTime(frameCounter, sCounter, minCounter, hCounter) < 3600 && crownsCollected >= 10)
    {
        localData.skinUnlocked = true;
        localStorage.setItem(playerKey, JSON.stringify(localData));
    }

    text.innerHTML += `Congratulations! Your time was ${hCounter}:${minCounter}:${sCounter}:${frameCounter} and you collected ${crownsCollected}<br>Press 'Enter' to play again!`;
    stats.innerHTML = `Best time: ${localData.bestTime.hours}:${localData.bestTime.minutes}:${localData.bestTime.seconds}:${localData.bestTime.frames} `; 

    hCounter = 0;
    minCounter = 0;
    sCounter = 0;
    frameCounter = 0;

    crownsCollected = 0;

    document.onkeypress = null;
    document.onkeypress = (event) => 
    {
        switch(event.key){
            case 'Enter':
                setupGame();
                loop();
                break;
        }
    }

    cancelAnimationFrame(loop);
    currentLevel = 1;
    stillLooping = false;

    ctx.drawImage(titleImage, 0, 0);
   
}


function updateBestTime()
{
    let currentBest = getTotalTime(localData.bestTime.frames, localData.bestTime.seconds, localData.bestTime.minutes, localData.bestTime.hours);
    let currentRun = getTotalTime(frameCounter, sCounter, minCounter, hCounter);

    //only update the current best if the current run beats it
    if(currentRun < currentBest)
    {
        localData.bestTime.frames = frameCounter;
        localData.bestTime.seconds = sCounter;
        localData.bestTime.minutes = minCounter;
        localData.bestTime.hours = hCounter;

        localStorage.setItem(playerKey, JSON.stringify(localData));
    }
}

//returns total amount of frames
function getTotalTime(frames, seconds, minutes, hours)
{
    //1hr = 3600s * 60 = 216,000frames
    //1min = 60s * 60 = 3600frames
    //1s = 60frames
    return frames + (seconds * 60) + (minutes * 3600) + (hours * 216000);
}

//#endregion

//Options


function setupOptions()
{
    //add a user input for clearing local storage manually
    if(clearBtn)
    {
        clearBtn.onclick = () => localStorage.clear();
    }

    //Add an option to toggle music 
    if(musicToggle)
    {
        musicToggle.checked = true;
        musicToggle.onchange = () => {
            musicEnabled = musicToggle.checked;
            if(!musicEnabled)
            {
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
            }
            else 
            {
                backgroundMusic.play();
                backgroundMusic.loop = true;
            }
        };
    }

    if(volumeSlide)
    {
        volumeSlide.onchange = () => backgroundMusic.volume = volumeSlide.value/100;
        //console.log(backgroundMusic.volume)
    }
}