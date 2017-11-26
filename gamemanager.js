/*exported canvas, textureMapCanvas, ctx, playerView, GameObject, changeElementSelected, toggleRays, gameObjectMap*/

class GameManager{
	constructor(textureMap){
		this.textureMap = textureMap;
		this.updateMiliseconds = 15;

		this.selection = 0;
		this.raysActivated = true;

		this.keyboardManager = new KeyboardManager(this.updateMiliseconds);
		this.clickManager = new ClickManager(this.updateMiliseconds);	
		
		this.gameObjectMap = [
			//{ type: "object", textureLocation: [-1, 0] },
			{ name: "devilish wall", type: "wall", textureLocation: [128, 0] },
			{ name: "stone wall",type: "wall", textureLocation: [192, 0] },
			{ name: "blue wall",type: "wall", textureLocation: [256, 0] },
			{ name: "slimmy wall",type: "wall", textureLocation: [320, 0] },
			{ name: "wooden wall",type: "wall", textureLocation: [384, 0] },
			{ name: "stone wall",type: "wall", textureLocation: [448, 0] },
			{ name: "",type: "wall", textureLocation: [512, 0] }
		];

		this.setup();
	}
}

GameManager.prototype.updateAll = function(){
	this.editorControl.update();
	this.gameScreenControl.update();
};

GameManager.prototype.setup = function(){
	this.editorControl = new EditorControl(this, this.textureMap, this.updateMiliseconds);
	this.gameScreenControl = new GameScreenControl(this.updateMiliseconds, this.editorControl);

	this.player = new Player(this.editorControl, this.gameScreenControl);

	this.gameScreenControl.initializePlayerView(this.player);
	this.editorControl.player = this.player;

	let self = this;
	
	this.keyboardManager.on("move", self.editorControl.player.move.bind(self.editorControl.player));	
	this.keyboardManager.on("rotate", self.editorControl.player.rotate.bind(self.editorControl.player));	
	this.keyboardManager.on("changeSelected", self.changeElementSelected.bind(self));	
	this.keyboardManager.on("toggleRays", self.toggleRays.bind(self));	
	
	this.clickManager.on("interactGrid", self.editorControl.mouseEvent.bind(self.editorControl));	
	

	this.updateClass = setInterval(this.updateAll.bind(self), this.updateMiliseconds);
};

class GameObject {
	constructor(gameObjectMap) {
		this.name = gameObjectMap.name;
		this.type = gameObjectMap.type;
		this.textureLocation = gameObjectMap.textureLocation;
	}
}

GameManager.prototype.changeElementSelected = function(data) {
	switch (data.type) {
		case 'number':
			this.selection = data.key;
			if(this.gameObjectMap[this.selection])
				this.editorControl.sidebar.drawRectangle(true, {img: this.textureMap, sX: this.gameObjectMap[this.selection].textureLocation[0], sY: this.gameObjectMap[this.selection].textureLocation[1], sWidth: 64, sHeight: 64, x: 70, y: 64, width: 64, height:64}); 
	}
};

GameManager.prototype.toggleRays = function(data) {
	switch (data.type) {
		case 'altKey':
		if (this.raysActivated)
			this.raysActivated = false;
		else
			this.raysActivated = true;
	}
}
