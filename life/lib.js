function World(sizex, sizey) {
	this.matrix = new Array();
	this.size_x = sizex;
	this.size_y = sizey; 
	this.age    = null;
}

World.prototype.isNew = function() {
	return this.age === null;
}
World.prototype.idx = function idx(x,y) {
	return this.mod(y,this.size_y)*this.size_x+this.mod(x,this.size_x);
}
World.prototype.at = function at(x,y) {
	return this.matrix[this.idx(x,y)];
}
World.prototype.borns = function borns(x,y) {
	this.putAt(1,x,y);
}
World.prototype.dies = function dies(x,y) {
	this.putAt(0, x,y);
}
World.prototype.isLive = function isLive(x,y) {
	return this.at(x,y)===1;
}
World.prototype.putAt = function putAt(val, x,y) {
	this.matrix[this.idx(x,y)] = val;
}
World.prototype.neighboursCount = function neighboursCount(x,y) {
	var nc = 0;
	if (this.isLive(x,y-1)) {//N
		nc++;
	}
	if (this.isLive(x+1, y-1)) {//NE
		nc++;
	}
	if (this.isLive(x+1, y)) {//E
		nc++;
	}
	if (this.isLive(x+1, y+1)) {//SE
		nc++;
	}
	if (this.isLive(x, y+1)) {//S
		nc++;
	}
	if (this.isLive(x-1,y+1)) {//SW
		nc++;
	}
	if (this.isLive(x-1,y)) {//W
		nc++;
	}
	if (this.isLive(x-1, y-1)) {//NW
		nc++;
	}
	return nc;
}

World.prototype.advance = function advance() {
	var new_matrix = new Array();
	var nc         = 0;
	var live       = false; 
	for(var y = 0; y < this.size_y; y++) {
		for(var x = 0; x < this.size_x; x++) {
			nc         = this.neighboursCount(x,y);
			live       = this.isLive(x,y); 
			previously = live;
			if (live) {
				if (nc < 2) {
					//dies
					live = false;
				} else if (nc == 2 || nc == 3) {
					//lives
				} else if (nc > 3) {
					//dies
					live = false;
				}
			} else {
				if (nc == 3) {
					live = true;
					//borns
				}
			}
			new_matrix[this.idx(x,y)] = (live) ? 1 : 0 ;
		}
	}

	live = false;
	for(var y = 0; y < this.size_y; y++) {
		for(var x = 0; x < this.size_x; x++) {
			live = this.isLive(x,y);
			if (live && new_matrix[this.idx(x,y)]===0) {
				this.dies(x,y);
			}
			if (!live && new_matrix[this.idx(x,y)]===1) {
				this.borns(x,y);
			}
		}
	}

	this.age++;
} 
World.prototype.randomize = function randomize() {
	var rand = 0;
	for(var y = 0; y < this.size_y; y++) {
		for(var x = 0; x < this.size_x; x++) {
			rand = Math.random();
			this.putAt((rand>0.5) ? 0 : 1, x,y); 
		}
	}
	this.age++;
} 
World.prototype.mod = function mod(a,b) {
	return (b+(a % b)) % b;
}
World.prototype.draw = function draw(cellSize) {
	if (cellSize == undefined) cellSize = 3; 
	var canvas        = getCanvas();
	var ctx           = canvas.getContext("2d"); 
	ctx.fillStyle     = "#00ff00";
	for(var y = 0; y < this.size_y; y++) {
		for(var x = 0; x < this.size_x; x++) {
			if(this.isLive(x,y)) {
				ctx.beginPath();
				ctx.arc(x*cellSize+0.5*cellSize, y*cellSize+0.5*cellSize, cellSize*0.5, 0, 2*Math.PI);
				ctx.fill();
			}
		}
	}
	ctx.fillStyle = "#000000";
	ctx.font = "10px Verdana";
	ctx.fillText("Iteration: "+this.age,0,this.size_y*cellSize);
}
World.prototype.clearDrawing = function clearDrawing() {
	var canvas = getCanvas(); 
	var ctx    = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width, canvas.height);
}
World.prototype.tick = function tick() {
	(this.isNew()) ? this.randomize() : this.advance();
	this.clearDrawing();
	this.draw(cellSize);
}
