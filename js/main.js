	// Globals
	var audioContext = new AudioContext();
	var canvas;
	var context;
	var numShapes = 9;
 
	var sound1;
	var sound2;
	var sound3;
	var sound4;
	var sound5;
	var sound6;
	var sound7;
	var sound8;

	var sounds = new Array();

	var shapes;
	var dragIndex;
	var dragging;
	var mouseX;
	var mouseY;
	var dragHoldX;
	var dragHoldY;

	var transliteWidth = 200;
	var transliteHeight = 160;

	var mouseMoving;

	$( document ).ready(function() {
 		var x = 0; //listener X-position

 		var generalProbability = 0.001;

 		// Play session sound files

 		sounds[0] = {path:"CreatureFromTheBlackLagoon",  file:"play1.mp3", x: 9, y: 8, z: 0, probability: generalProbability, numberOfSounds: 1};
		sounds[1] = {path:"AttackFromMars",  file:"play1.mp3", x: 1, y: 0, z: 0, probability: generalProbability, numberOfSounds: 1};
		sounds[2] = {path:"MedievalMadness", file:"play1.mp3", x: 5, y: 0, z: 0, probability: generalProbability, numberOfSounds: 1};
		sounds[3] = {path:"CircusVoltaire",  file:"play1.mp3", x: 1, y: 5, z: 0, probability: generalProbability, numberOfSounds: 1};
		sounds[4] = {path:"TheBlackKnight",  file:"play1.mp3", x: 9, y: 5, z: 0, probability: generalProbability, numberOfSounds: 1};
		sounds[5] = {path:"MonsterBash",     file:"play1.mp3", x: 5, y: 8, z: 0, probability: generalProbability, numberOfSounds: 2};
		sounds[6] = {path:"TheatreOfMagic",  file:"play1.mp3", x: 1, y: 8, z: 0, probability: generalProbability, numberOfSounds: 1};
		sounds[7] = {path:"StarTrekTNG",     file:"play1.mp3", x: 9, y: 0, z: 0, probability: generalProbability, numberOfSounds: 2};
		

		loadTableData(sounds[0], 0, numShapes-1); //this starts the loading of tables
		
	});

	function loadTableData(tableData, i, total){
		console.log("load: " + tableData.path);
		sounds[i] = playFile(tableData.path,tableData.file, tableData.x, tableData.y, tableData.z, tableData.probability, tableData.numberOfSounds); //filename, x, y, z, probability, number of sounds, 
		var total = total;
		var theSound = sounds[i];
		var i = i+1;

		sounds[i-1].audio.addEventListener("loaded", dataIsLoaded(theSound, i, total));
	} 

	function dataIsLoaded(ref, i, total){
		console.log("done: " + ref.path);
		console.log(ref.audio.readyState);
		soundTimer(ref);
		console.log("i=" + i);
		console.log("total = " + total);
		if(i==total){
			console.log("create canvas");
			// Build canvas
			// Get canvas reference
			canvas = document.getElementById("myCanvas");
			context = canvas.getContext("2d");

			init();	
		} 
		else {
			loadTableData(sounds[i], i, total);
		}
	}

	function soundTimer(soundRef){
		var prob = soundRef.probability;
		var rnd = Math.random();
		
		if(rnd<prob && soundRef.audio.active==false){
			console.log(soundRef.path);
			console.log("play sound");

			if(soundRef.audio.readyState){
				console.log("networkState: " + soundRef.audio.networkState);
				console.log("readyState= " + soundRef.audio.readyState);
				soundRef.audio.pause();
				soundRef.audio.currentTime = 0;
				soundRef.audio.src = soundRef.path + "/play"+ Math.floor(Math.random() * soundRef.numberOfSounds + 1 ) + ".mp3";
				console.log("readyState= " + soundRef.audio.readyState);
				soundRef.audio.autoplay = true;
				soundRef.audio.active = true;
				//soundRef.audio.play();
				if(canvas)
					drawScreen();
			} else {
				console.log(soundRef.path + " was not ready, readyState = " + soundRef.audio.readyState);
				console.log("networkState: " + soundRef.audio.networkState);
				console.log("error?: " + soundRef.error);
			}
			
		}
		setTimeout(function(){
			soundTimer(soundRef)}, 1000);
	}

  	function playFile(path, file, x, y, z, probability, numberOfSounds){
  		console.log(path);

		var source; 
		var audio0 = new Audio();   
		audio0.src = path + "/" + file;
		audio0.controls = true;
		audio0.autoplay = true;
		audio0.loop = false;
		audio0.active = false;
		source = audioContext.createMediaElementSource(audio0);

		
		audio0.pause();

		panner = audioContext.createPanner();
		panner.setPosition(x, y, z);
		source.connect(panner);
		panner.connect(audioContext.destination);

		console.log(source);
		console.log(audioContext);

		// Each audioContext has a single 'Listener' 
		audioContext.listener.setPosition(5, 5, 0);
		
		audio0.addEventListener('ended', function() {
	      console.log("ended!");
	      this.active = false;
		  drawScreen();
	    }, false);
		console.log("log1");

		return { panner: panner, 
				 audio: audio0, 
				 x: x, 
				 y: y, 
				 z: z, 
				 probability: probability,  
				 path: path, 
				 numberOfSounds:numberOfSounds
				};
	}

	function init() {
		shapes = [];
		makeShapes();
		drawScreen();
		canvas.addEventListener("mousedown", mouseDownListener, false);
		canvas.addEventListener("click", mouseClickListener, false);
		canvas.addEventListener("dblclick", mouseDoubleClickListener, false);
		
	}

	function makeShapes() {
		var i;
		var tempX;
		var tempY;
		var tempRad;
		var tempR;
		var tempG;
		var tempB;
		var tempColor;
		var tmpImg;
		var tempHeight;
		var tempWidth;
		

		for(var i=0; i<numShapes-1; i++){
			sounds[i].audio.removeEventListener("canplaythrough", dataIsLoaded);
			console.log("readyState: " + sounds[i].audio.readyState);
			loadTable(sounds[i]);

		}
			
		
		

		// Attack from Mars
		//loadTable(sound2);
		//console.log("made ATM");

		// Medieval Madness
		//loadTable(sound3);
		//console.log("made MM");

		// Circus Voltaire
		//loadTable(sound4);
		//console.log("made CV");

		// Theatre of Magic
		//loadTable(sound5);
		//console.log("made TOM");

		// Monster Bash
		//loadTable(sound6);
		//console.log("made MB");
	
		// The Black Knight
		//loadTable(sound7);
		//console.log("made TBK");

		// Creature From The Black Lagoon
		//loadTable(sound8);
		//console.log("made CFTBL");

		// Listener
		tempX = 500;
		tempY = 400;
		tempRad = 40;
		tempColor = "rgb(" + 200 + "," + 200 + "," + 200 +")";
		tempShape = {x:tempX, y:tempY, rad:tempRad, color:tempColor};
		shapes.push(tempShape);
	}

	function loadTable(soundRef){
		console.log("loadTable");
		console.log(soundRef);
		tempX = soundRef.x*100-transliteWidth/2;
		tempY = soundRef.y*100; //-transliteHeight/2;
		tempWidth = transliteWidth;
		tempHeight = transliteHeight;
		tempColor = "rgb(" + 0 + "," + 0 + "," + 0 +")";
		tmpImgLight = document.createElement('img');
		tmpImgLight.addEventListener('load', function(e) {
			drawScreen();
		});
		tmpImgLight.src = soundRef.path + "/translite.jpg";

		tmpImgDark = document.createElement('img');
		tmpImgDark.addEventListener('load', function(e) {
			drawScreen();
		});
		tmpImgDark.src = soundRef.path + "/translite_dark.jpg";

		tempShape = {x:tempX, 
					 y:tempY, 
					 width:tempWidth, 
					 height: tempHeight, 
					 color:tempColor, 
					 imageLight:tmpImgLight, 
					 imageDark:tmpImgDark, 
					 sound: soundRef, 
					 path: soundRef.path,
					 numberOfSounds: soundRef.numberOfSounds,
					 active: soundRef.audio.active //initial state is a silent table
		};

		shapes.push(tempShape);
	}

	function mouseDownListener(evt) {
		var i;
		mouseMoving = false;
		//We are going to pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
		//only the topmost one will be dragged.
		var highestIndex = -1;
		
		//getting mouse position correctly, being mindful of resizing that may have occured in the browser:
		var bRect = canvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);
				
		//find which shape was clicked
		for (i=0; i < numShapes; i++) {
			if	(hitTest(shapes[i], mouseX, mouseY)) {
				dragging = true;
				if (i > highestIndex) {
					//We will pay attention to the point on the object where the mouse is "holding" the object:
					dragHoldX = mouseX - shapes[i].x;
					dragHoldY = mouseY - shapes[i].y;
					highestIndex = i;
					dragIndex = i;
				}
			}
		}
		
		if (dragging) {
			window.addEventListener("mousemove", mouseMoveListener, false);
		}
		canvas.removeEventListener("mousedown", mouseDownListener, false);
		window.addEventListener("mouseup", mouseUpListener,  false);
		
		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;
	}

	function mouseClickListener(evt) {
		console.log("mouseClickListener");
		if(!mouseMoving){
			console.log("mouseMoving=false");
			var i;
			//We are going to pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
			//only the topmost one will be dragged.
			var highestIndex = -1;
			
			//getting mouse position correctly, being mindful of resizing that may have occured in the browser:
			var bRect = canvas.getBoundingClientRect();
			mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
			mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);
					
			//find which shape was clicked
			for (i=0; i < numShapes; i++) {
				if	(hitTest(shapes[i], mouseX, mouseY)) {
					console.log("shapes["+i+"]");
					shapes[i].sound.audio.pause();
					shapes[i].sound.audio.currentTime = 0;

					shapes[i].sound.audio.src = shapes[i].sound.path + "/play"+ Math.floor(Math.random() * shapes[i].sound.numberOfSounds + 1 ) + ".mp3";
					
					shapes[i].sound.audio.autoplay = true;
					shapes[i].sound.audio.active = true;
					//shapes[i].sound.audio.play();
					drawScreen();
				}	
			}
		}
		
	}

	function mouseDoubleClickListener(evt) {
		var i;
		
		
		//getting mouse position correctly, being mindful of resizing that may have occured in the browser:
		var bRect = canvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);
				
		//find which shape was clicked
		for (i=0; i < numShapes; i++) {
			if	(hitTest(shapes[i], mouseX, mouseY)) {
				shapes[i].sound.audio.pause();
				shapes[i].sound.audio.active = false;
				drawScreen();
			}
		}
	}

	function mouseUpListener(evt) {
		console.log("mouseUpListener");
		canvas.addEventListener("mousedown", mouseDownListener, false);
		window.removeEventListener("mouseup", mouseUpListener, false);
		if (dragging) {
			dragging = false;
			
			window.removeEventListener("mousemove", mouseMoveListener, false);
		} 
	}

	function mouseMoveListener(evt) {
		mouseMoving = true;
		var posX;
		var posY;
		if(shapes[dragIndex].rad){
			var shapeRad = shapes[dragIndex].rad;

			var minX = shapeRad;
			var maxX = canvas.width - shapeRad;
			var minY = shapeRad;
			var maxY = canvas.height - shapeRad;
		}
		else {
			var shapeWidth = shapes[dragIndex].width;
			var shapeHeight = shapes[dragIndex].height;

			var minX = shapeWidth;
			var maxX = canvas.width - shapeWidth;
			var minY = shapeHeight;
			var maxY = canvas.height - shapeHeight;
		}


		//getting mouse position correctly 
		var bRect = canvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);
		
		//clamp x and y positions to prevent object from dragging outside of canvas
		
		posX = mouseX - dragHoldX;
		//posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
		posY = mouseY - dragHoldY;
		//posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
		

		shapes[dragIndex].x = posX;
		shapes[dragIndex].y = posY;
		
		//listener
		if(shapes[dragIndex].sound){
			console.log(shapes[dragIndex]);
			shapes[dragIndex].sound.panner.setPosition(shapes[dragIndex].x/100+(transliteWidth/2)/100, shapes[dragIndex].y/100+(transliteHeight/2)/100, 0);
		} 
		else {
			audioContext.listener.setPosition(shapes[dragIndex].x/100, posY/100, 0);
		}
		
		drawScreen();
	}

	function hitTest(shape,mx,my) {
		if(shape.rad){
			var dx;
			var dy;
			dx = mx - shape.x;
			dy = my - shape.y;
			
			//a "hit" will be registered if the distance away from the center is less than the radius of the circular object		
			return (dx*dx + dy*dy < shape.rad*shape.rad);
		}
		else {
			var insideX = (mx > shape.x && mx < (shape.x+shape.width));
			var insideY = (my > shape.y && my < (shape.y+shape.height)); 
			return (insideX && insideY);
		}
		
	}

	function drawShapes() {
		var i;
		for (i=0; i < numShapes; i++) {
			context.fillStyle = shapes[i].color;
			context.beginPath();
			// circle, listener
			if(shapes[i].rad)
				context.arc(shapes[i].x, shapes[i].y, shapes[i].rad, 0, 2*Math.PI, false);
			else // table
				context.rect(shapes[i].x, shapes[i].y, shapes[i].width, shapes[i].height);

			context.closePath();
			context.fill();

			if(shapes[i].imageLight){
				if(shapes[i].sound.audio.active)
					context.drawImage(shapes[i].imageLight, shapes[i].x, shapes[i].y, transliteWidth, transliteHeight);
				else 
					context.drawImage(shapes[i].imageDark, shapes[i].x, shapes[i].y, transliteWidth, transliteHeight);
			}

		}
	}

	function drawScreen() {
		//bg
		context.fillStyle = "#000";
		context.fillRect(0,0,canvas.width,canvas.height);
		
		drawShapes();		
	}