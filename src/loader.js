import { init } from './main.js';
import { loadImages } from './helpers.js';

const imageSources = {
	//evil1: 'images/Dr-evil.jpg',
	player: 'images/JelloBoySheet.png' //player spritesheet should be first thing loaded for code clarity
};

// loadImages(imageSourcesObject,callback);
loadImages(imageSources, startGame);


function startGame(imageData) {
	init(imageData);
}