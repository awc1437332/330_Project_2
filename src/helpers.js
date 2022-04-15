export { loadImages };

function loadImages(imageSources, callback) {
	let numImages = Object.keys(imageSources).length;
	let numLoadedImages = 0;

	// load images
	console.log("... start loading images ...");
	for (let imageName in imageSources) {
		console.log("... trying to load '" + imageName + "'");
		let img = new Image();
		img.src = imageSources[imageName];
		imageSources[imageName] = img;
		img.onload = function () {
			console.log("SUCCESS: Image named '" + imageName + "' at " + this.src + " loaded!");
			if (++numLoadedImages >= numImages) {
				console.log("... done loading images ...");
				callback(imageSources);
			}
		}
		img.onerror = function () {
			console.log("ERROR: image named '" + imageName + "' at " + this.src + " did not load!");
		}
	}
}