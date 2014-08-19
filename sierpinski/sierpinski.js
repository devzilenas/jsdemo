//2013 m. Marius Žilėnas mzilenas@gmail.com 
// Sierpinski triangle 
// 	* to generate Pascal triangle I could use simple addition and this requires big numbers after some step. But I don't need big numbers since useful is only the indication if the number is odd. Therefore I add 1's and 0's.

function Triangle() {}

Triangle.prototype.height = function() {
	return this.data.length;
}

Triangle.prototype.scale = function scale(ctx, height) { 
	ballsfits = this.canvas.width/2;
	ballsgot  = height             ;
	var scale = ballsfits/ballsgot ;
	ctx.scale(scale, scale)        ;
	return scale                   ;
}

Triangle.prototype.init = function() {
	this.canvas       = gCanvas();
	var ctx           = this.canvas.getContext("2d");
	this.canvas.width = this.canvas.width; //clear
	ctx.strokeStyle = "#000";
	return ctx;
}

Triangle.prototype.generate = function(height) {
	//init
	this.data = new Array();
	this.data.push([1]);
	this.data.push(new Array(1,1));

	for(var i=2; i<height; i++) {
		var cRow = [1];
		// add each two members of preceeding row
		for(var j=0; j<this.data[i-1].length-1; j++)
			cRow.push((this.data[i-1][j] + this.data[i-1][j+1]) % 2);
		cRow.push(1);
		this.data.push(cRow);
	}
}

Triangle.prototype.draw = function() {
	var h     = this.height();
	var ctx   = this.init();
	var scale = this.scale(ctx, h);
	for(var y=0; y<h; y++)
		for(var x=0; x < this.data[y].length; x++)
			if (0 != this.data[y][x]) {
				ctx.beginPath();
				ctx.arc(h-this.data[y].length+x*2+1, y*2+1, 1, 0, Math.PI*2);
				ctx.fill();
			}
}

