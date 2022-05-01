import { init } from './main.js';
import { loadImages } from './helpers.js';

const imageSources = {
	//evil1: 'images/Dr-evil.jpg',
	player: 'images/JelloBoySheet.png', //player spritesheet should be first thing loaded for code clarity
	kingPlayer: 'images/KingJelloBoySheet.png',
	background: 'images/Background.png',
	baseLevel: 'images/BaseLevel.png',
	titleScreen: 'images/TitleScreen.png',
	levelOne: 'images/Level1.png',
	levelTwo: 'images/Level2.png',
	levelThree: 'images/Level3.png',
	levelFour: 'images/Level4.png',
	levelFive: 'images/Level5.png',
	levelSix: 'images/Level6.png',
	levelSeven: 'images/Level7.png',
	levelEight: 'images/Level8.png',
	levelNine: 'images/Level9.png',
	levelTen: 'images/Level10.png',
	crown: 'images/crown.png',
	door: 'images/ExitDoor.png'
};

// loadImages(imageSourcesObject,callback);
loadImages(imageSources, startGame);


function startGame(imageData) {
	init(imageData);
}