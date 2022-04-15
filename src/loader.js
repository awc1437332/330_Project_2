import init from './main.js';
import { loadImages } from './helpers.js';

const imageSources = {
	evil1: 'images/Dr-evil.jpg'
};

// loadImages(imageSourcesObject,callback);
loadImages(imageSources, startGame);


function startGame(imageData) {
	init(imageData);
}