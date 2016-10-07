/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys;			// Keyboard input
var localPlayer = {};
var allPlayers = {};
var Circles = {};
var Damage = {};
var Bonus = {};
var Parties = {};
var widthViewPort, heightViewPort;
var widthMap, heightMap;
var widthBar, heightBar;
var keysDown = {};
var testowyNick;
var prevLvl;
var czyKoniecBonusa = new Boolean (true);
var alphaPoint = 1;

var vips = {};

	localPlayer = {
		nick: "", 
		x: 500, 
		y: 500, 
		hp: 100, 
		lvla: 1,
		lvlb: 1, 
		lvlc: 1, 
		sta: 10, 
		pda: 10, 
		dea: 10,
		r1a: 10, 
		a1a: 10, 
		r2a: 10, 
		a2a: 10, 
		r3a: 10, 
		a3a: 10, 
		stb: 10, 
		pdb: 10, 
		deb: 10,
		r1b: 10, 
		a1b: 10, 
		r2b: 10, 
		a2b: 10, 
		r3b: 10, 
		a3b: 10, 
		stc: 10, 
		pdc: 10, 
		dec: 10,
		r1c: 10, 
		a1c: 10, 
		r2c: 10, 
		a2c: 10, 
		r3c: 10, 
		a3c: 10, 
		klasa: "a",
		color: "#ffffff", 
		hitsa: 0, 
		hitsb: 0, 
		hitsc: 0, 
		bonus: "n",
		bonusToShow: "n", 
		party: ""};


function showPoint(){
	if(alphaPoint==1){
		alphaPoint=0;
	}else{
		alphaPoint=1;
	}
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

var coolDownTpLongDone = new Boolean(false);

var coolDownAttackDone = new Boolean(false);
var coolDownAttackLongDone = new Boolean(false);

var attackCounter = 0;
var attackCounterLong = 0;

var tpCounter = 0;
var tpCounterLong = 0;
function cooldownTp(){
	//console.log(tpCounter);
	tpCounter++;
	ctxMpbar.clearRect(0, 0, widthBarMp, heightBarMp);
    ctxMpbar.fillStyle = '#CCCCFF';
    ctxMpbar.fillRect(0, 0,(widthBarMp/80)*tpCounter, heightBarMp);
    if(((widthBarMp/80)*tpCounter)>=widthBarMp){
    	tp();
    	clearInterval(intervalTp);
    }
}

//zmienne do ustalania cooldownow (cooldown short tp jest gdzie indziej patrz -> setTimeout na mouseleave)
var longTime = 100;
//if((localPlayer.lvl/4)<=0){longTime = 400;} 
var shortTime = 20;
function cooldownTpLong(){
	//console.log(tpCounter);
	if(localPlayer!=undefined){
		switch(localPlayer.klasa){
			case "a":
				tpCounterLong=tpCounterLong+localPlayer.lvla;
			break;
			case "b":
				tpCounterLong=tpCounterLong+localPlayer.lvlb;
			break;
			case "c":
				tpCounterLong=tpCounterLong+localPlayer.lvlc;
			break;
		}
	}
	//tpCounterLong=tpCounterLong+localPlayer.lvl;
	ctxMpbarLong.clearRect(0, 0, widthBarMpLong, heightBarMpLong);
    ctxMpbarLong.fillStyle = '#CCCCFF';
	//w tymmiejscu moznaustawiac predkosccooldownu (widthBarMpLong/200)*tpCounterLong
    ctxMpbarLong.fillRect(0, 0,((widthBarMpLong)*tpCounterLong)/longTime, heightBarMpLong);
    //ctxMpbar.fillRect(0, 0,(widthBar/200)*tpCounter, heightBar);
    if(((widthBarMpLong)*tpCounterLong)/longTime>=widthBarMpLong){
    	coolDownTpLongDone = true;
    	clearInterval(intervalTpLong);
    }
}

function cooldownAttack(){
	//console.log(tpCounter);
	attackCounter++;
	ctxAttackbar.clearRect(0, 0, widthBarMpLong, heightBarMpLong);
    ctxAttackbar.fillStyle = '#993333';
	//ctxMpbar.rect(0, 0, (widthBar/20)*tpCounter, heightBar);
    ctxAttackbar.fillRect(0, 0,(widthBarMpLong*attackCounter)/shortTime, heightBarMpLong);
    //ctxMpbar.fillRect(0, 0,(widthBar/200)*tpCounter, heightBar);
    if(((widthBarMpLong*attackCounter)/shortTime)>=widthBarMpLong){
    	coolDownAttackDone = true;
    	clearInterval(intervalAttack);
    }
}

function cooldownAttackLong(){
	//console.log(tpCounter);
	if(localPlayer!=undefined){
		switch(localPlayer.klasa){
			case "a":
				attackCounterLong=attackCounterLong+localPlayer.lvla;
			break;
			case "b":
				attackCounterLong=attackCounterLong+localPlayer.lvlb;
			break;
			case "c":
				attackCounterLong=attackCounterLong+localPlayer.lvlc;
			break;
		}
	}
	
	
	ctxAttackbarLong.clearRect(0, 0, widthBarMpLong, heightBarMpLong);
    ctxAttackbarLong.fillStyle = '#993333';
	//ctxMpbar.rect(0, 0, (widthBar/20)*tpCounter, heightBar);
    ctxAttackbarLong.fillRect(0, 0,(widthBarMpLong*attackCounterLong)/longTime, heightBarMpLong);
    //ctxMpbar.fillRect(0, 0,(widthBar/200)*tpCounter, heightBar);
    if(((widthBarMpLong*attackCounterLong)/longTime)>=widthBarMpLong){
    	coolDownAttackLongDone = true;
    	clearInterval(intervalAttackLong);
    }
}

function tp(){
	if(localPlayer.bonusToShow!=1){
		tpCounter = 0;
		//clearInterval(intervalTp);
		ctxMpbar.clearRect(0, 0, widthBarMp, heightBarMp);
	}
	
  	var element = canvasViewPort;
  	var offsetX = 0, offsetY = 0;
    if (element.offsetParent) {
     	do {
       		offsetX += element.offsetLeft;
       		offsetY += element.offsetTop;
      	} while ((element = element.offsetParent));
    }
    x = xTP - offsetX;
    y = yTP - offsetY;
    localPlayer.x = localPlayer.x + (x-widthViewPort/2);
    localPlayer.y = localPlayer.y + (y-heightViewPort/2);

    if(localPlayer.x>10000){localPlayer.x=10000;}
    if(localPlayer.y>10000){localPlayer.y=10000;}
    if(localPlayer.x<0){localPlayer.x=0;}
    if(localPlayer.y<0){localPlayer.y=0;}
    emitPlayer();
}
/**************************************************
** GAME INITIALISATION
**************************************************/
var prevLvla;
var prevLvlb;
var prevLvlc;

function init() {
	keysDown = {};


	canvasViewPort = document.getElementById("viewport");
	ctxViewPort = canvasViewPort.getContext("2d");
	canvasHpbar = document.getElementById("hpbar");
	ctxHpbar = canvasHpbar.getContext("2d");
	canvasMpbar = document.getElementById("mpbar");
	ctxMpbar = canvasMpbar.getContext("2d");
	canvasMpbarLong = document.getElementById("mpbarLong");
	ctxMpbarLong = canvasMpbarLong.getContext("2d");
	canvasAttackbar = document.getElementById("attackbar");
	ctxAttackbar = canvasAttackbar.getContext("2d");
	canvasAttackbarLong = document.getElementById("attackbarLong");
	ctxAttackbarLong = canvasAttackbarLong.getContext("2d");
	canvasMap = document.getElementById("mapa");
	ctxMap = canvasMap.getContext("2d");
	// Maximise the canvas
	canvasViewPort.width = window.innerWidth;
	canvasViewPort.height = window.innerHeight;
	canvasMap.width = window.innerWidth*15/100;
	canvasMap.height = window.innerHeight*15/100;
	canvasHpbar.width = window.innerWidth;
	canvasHpbar.height = window.innerHeight*4/100;
	canvasMpbar.width = window.innerWidth;
	canvasMpbar.height = window.innerHeight*2/100;
	canvasMpbarLong.width = window.innerWidth;
	canvasMpbarLong.height = window.innerHeight*2/100;
	canvasAttackbar.width = window.innerWidth;
	canvasAttackbar.height = window.innerHeight*2/100;
	canvasAttackbarLong.width = window.innerWidth;
	canvasAttackbarLong.height = window.innerHeight*2/100;

	widthViewPort=canvasViewPort.width;
	heightViewPort=canvasViewPort.height;

	widthMap=canvasMap.width;
	heightMap=canvasMap.height;

	widthBar=canvasHpbar.width;
	heightBar=canvasHpbar.height;

	widthBarMp=canvasMpbar.width;
	heightBarMp=canvasMpbar.height;

	widthBarMpLong=canvasMpbarLong.width;
	heightBarMpLong=canvasMpbarLong.height;

	//dwcanvasViewPort.style.webkitFilter = "blur(1px)";
	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(10000)),
		startY = Math.round(Math.random()*(10000));
	// Initialise the local player
	
	intervalTpLong = setInterval(cooldownTpLong, 70);
	intervalAttackLong = setInterval(cooldownAttackLong, 70);
	intervalAttack = setInterval(cooldownAttack, 70);
	//r- promien, a - ilosc; 1-3- typ ataku; a,b,c- klasa

	

	prevLvla = localPlayer.lvla;
	prevLvlb = localPlayer.lvlb;
	prevLvlc = localPlayer.lvlc;
	//console.log(localPlayer);
	setEventHandlers();
	document.getElementById("nickToShow").innerHTML= localPlayer.nick;
	document.getElementById("lvlToShowA").innerHTML= localPlayer.lvla;
	document.getElementById("lvlToShowB").innerHTML= localPlayer.lvlb;
	document.getElementById("lvlToShowC").innerHTML= localPlayer.lvlc;
	document.getElementById("hitsToShowA").innerHTML= localPlayer.hitsa;
	document.getElementById("hitsToShowB").innerHTML= localPlayer.hitsb;
	document.getElementById("hitsToShowC").innerHTML= localPlayer.hitsc;
	document.getElementById("r1aToShow").innerHTML= localPlayer.r1a;
	document.getElementById("r1bToShow").innerHTML= localPlayer.r1b;
	document.getElementById("r1cToShow").innerHTML= localPlayer.r1c;
	document.getElementById("a1aToShow").innerHTML= localPlayer.a1a;
	document.getElementById("a1bToShow").innerHTML= localPlayer.a1b;
	document.getElementById("a1cToShow").innerHTML= localPlayer.a1c;
	document.getElementById("r2aToShow").innerHTML= localPlayer.r2a;
	document.getElementById("r2bToShow").innerHTML= localPlayer.r2b;
	document.getElementById("r2cToShow").innerHTML= localPlayer.r2c;
	document.getElementById("a2aToShow").innerHTML= localPlayer.a2a;
	document.getElementById("a2bToShow").innerHTML= localPlayer.a2b;
	document.getElementById("a2cToShow").innerHTML= localPlayer.a2c;
	document.getElementById("r3aToShow").innerHTML= localPlayer.r3a;
	document.getElementById("r3bToShow").innerHTML= localPlayer.r3b;
	document.getElementById("r3cToShow").innerHTML= localPlayer.r3c;
	document.getElementById("a3aToShow").innerHTML= localPlayer.a3a;
	document.getElementById("a3bToShow").innerHTML= localPlayer.a3b;
	document.getElementById("a3cToShow").innerHTML= localPlayer.a3c;

	document.getElementById("staToShow").innerHTML= localPlayer.sta;
	document.getElementById("deaToShow").innerHTML= localPlayer.dea;
	document.getElementById("pdaToShow").innerHTML= localPlayer.pda;
	document.getElementById("stbToShow").innerHTML= localPlayer.stb;
	document.getElementById("debToShow").innerHTML= localPlayer.deb;
	document.getElementById("pdbToShow").innerHTML= localPlayer.pdb;
	document.getElementById("stcToShow").innerHTML= localPlayer.stc;
	document.getElementById("decToShow").innerHTML= localPlayer.dec;
	document.getElementById("pdcToShow").innerHTML= localPlayer.pdc;

	var skillPointsA = parseInt(parseInt(localPlayer.lvla-(localPlayer.r1a+localPlayer.a1a+localPlayer.r2a+localPlayer.a2a+localPlayer.r3a+localPlayer.a3a))+parseInt(59));
	var skillPointsB = parseInt(parseInt(localPlayer.lvlb-(localPlayer.r1b+localPlayer.a1b+localPlayer.r2b+localPlayer.a2b+localPlayer.r3b+localPlayer.a3b))+parseInt(59));
	var skillPointsC = parseInt(parseInt(localPlayer.lvlc-(localPlayer.r1c+localPlayer.a1c+localPlayer.r2c+localPlayer.a2c+localPlayer.r3c+localPlayer.a3c))+parseInt(59));
	var statsPointsA = parseInt(parseInt(localPlayer.lvla-(localPlayer.sta+localPlayer.dea+localPlayer.pda))+parseInt(29)); 
	var statsPointsB = parseInt(parseInt(localPlayer.lvlb-(localPlayer.stb+localPlayer.deb+localPlayer.pdb))+parseInt(29)); 
	var statsPointsC = parseInt(parseInt(localPlayer.lvlc-(localPlayer.stc+localPlayer.dec+localPlayer.pdc))+parseInt(29)); 

	document.getElementById("skillpointsToShowA").innerHTML= skillPointsA;
	document.getElementById("skillpointsToShowB").innerHTML= skillPointsB;
	document.getElementById("skillpointsToShowC").innerHTML= skillPointsC;

	document.getElementById("statspointsToShowA").innerHTML= statsPointsA;
	document.getElementById("statspointsToShowB").innerHTML= statsPointsB;
	document.getElementById("statspointsToShowC").innerHTML= statsPointsC;

	//if(tempSkillPoints<0){	
	//	tempSkillPoints=0
	//}
	//document.getElementById("skillPointsToShow").innerHTML= tempSkillPoints;
	colorPick.style.backgroundColor = localPlayer.color;
	intervalBonus = setInterval(sprawdzajBonus, 50);
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {


	window.addEventListener("resize", onResize, false);
	window.addEventListener('keydown', function(e) {
		keysDown[e.keyCode] = true;
		c = e.keyCode;
		if(($('#partyName').is(':focus')==false)&&($('#toInvite').is(':focus')==false)&&($('#vip').is(':focus')==false)){
			switch (c) {
			case 13: // Down
				if(document.getElementById("chat").style.display!="none"&&document.getElementById("msgInput").value!=""){
					sendChatMessage();
				}
				break;
			case 67: // Down
				if($('#msgInput').is(':focus')==false){
					showChat();
				}
				break;
			case 80: // Down
				if($('#msgInput').is(':focus')==false){
					if(document.getElementById("peopleInParty").style.display!="none"){
						document.getElementById("peopleInParty").style.display="none";
					}else{
						document.getElementById("peopleInParty").style.display="block";
					}
				}
				break;
			case 73: // Down
				if($('#msgInput').is(':focus')==false){
					if(document.getElementById("items").style.display!="none"){
						document.getElementById("items").style.display="none";
					}else{
						document.getElementById("items").style.display="block";
					}
				}
				break;
			case 77: // Down
				if($('#msgInput').is(':focus')==false){
					showMinimap();
				}
				break;
			case 86: // Down
				if($('#msgInput').is(':focus')==false){
					showArrows();
				}
				break;
			case 84: // Down
				if($('#msgInput').is(':focus')==false){
					showTools();
				}
				break;
			case 79: // Down
				if($('#msgInput').is(':focus')==false){
					showPoint();
				}
				break;
			case 27: 
				if($('#msgInput').is(':focus')==false){
					if(document.getElementById("tools").style.display=="block"){
						document.getElementById("tools").style.display="none";
						document.getElementById("stats").style.display="none";
						document.getElementById("shop").style.display="none";
					}
				}else{
					if(document.getElementById("tools").style.display=="none"){
						if(document.getElementById("chat").style.display!="none"){
							document.getElementById("chat").style.display="none";
						}
					}else{
						document.getElementById("tools").style.display="none";
						document.getElementById("stats").style.display="none";
						document.getElementById("shop").style.display="none";
					}
				}
				break;
			case 49: 
				if($('#msgInput').is(':focus')==false){
					document.getElementById("att1").checked=true;
				}
			break;
			case 50: 
				if($('#msgInput').is(':focus')==false){
					document.getElementById("att2").checked=true;
				}
			break;
			case 51: 
				if($('#msgInput').is(':focus')==false){
					document.getElementById("att3").checked=true;
				}
			break;
		};
		}
		
	});
	//window.addEventListener("keydown", onKeydown, false);
  	window.addEventListener('keyup', function(e) {delete keysDown[e.keyCode];});

	$( document ).on( "mousemove", function( event ) {
	  	xTP= event.pageX;
		yTP= event.pageY;
		//console.log("holding")
	});

	var intervalTp = 0;
	var timeoutId = 0;
	var attackLongDone = new Boolean (false);
	$('#viewport').mousedown(function(event) {
		//console.log(event);
		switch (event.which) {
	        case 1:
		        if(localPlayer.hp>0){
		        	xAtt= event.pageX;
					yAtt= event.pageY;
		        	if(localPlayer.bonusToShow==1){
		        		attack();
		        	}else{
		        		attackLongDone=false;
		        		if(coolDownAttackLongDone==true){
		        			attackLongDone=true;
			        		coolDownAttackLongDone=false;
			        		attackCounterLong=0;
			        		intervalAttackLong = setInterval(cooldownAttackLong, 70);
			        		attack();
			        	}else{
			        		if(coolDownAttackDone==true&&attackLongDone==false){
			        			attackLongDone=false;
				        		coolDownAttackDone=false;
				        		attackCounter=0;
				        		intervalAttack = setInterval(cooldownAttack, 70);
				        		attack();
				        	}
			        	}
		        	}
		        }
	        	
	            break;
	        case 2:
	            
	            break;
	        case 3:
		        if(localPlayer.hp>0){
		        	if(localPlayer.bonusToShow==1){
		        		tp();
		        	}else{
		        		xTP= event.pageX;
						yTP= event.pageY;
						tpCounter = 0;
						if(coolDownTpLongDone==true){
							coolDownTpLongDone=false;
							tpCounterLong=0;
							intervalTpLong = setInterval(cooldownTpLong, 70);
							tp();
						}else{
							clearInterval(intervalTp);
							intervalTp = setInterval(cooldownTp, 20);
					    	timeoutId = setTimeout(tp, 1600);
						}
		        	}
		        	
		        }
	            break;
	        default:
	            //alert('You have a strange Mouse!');
    	}
	}).bind('mouseup mouseleave', function() {
		switch (event.which) {
	        case 1:

	            break;
	        case 2:
	            
	            break;
	        case 3:
	        	ctxMpbar.clearRect(0, 0, widthBarMp, heightBarMp);
		        if(localPlayer.bonus!=1){
		        	tpCounter = 0;
					clearInterval(intervalTp);
		    		clearTimeout(timeoutId);
		        }
	            break;
	        default:
	            //alert('You have a strange Mouse!');
    	}

	});

	$(document).bind("contextmenu", function(event) {
    	event.preventDefault();
    	$("<div class='custom-menu'>Custom menu</div>")
        .appendTo("body")
        .css({top: event.pageY + "px", left: event.pageX + "px"});
	});
	/*
	document.oncontextmenu=RightMouseDown;
	document.onmousedown = mouseDown; 



	function mouseDown(e) {
	    if (e.which==3) {//righClick
	        //alert("Right-click menu goes here");
	    }
	    if (e.which==1) {//leftClick
	        //alert("left?-click menu goes here");
	    }
	}


	function RightMouseDown() { return false; }
	*/
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
canvasViewPort.width = window.innerWidth;
	canvasViewPort.height = window.innerHeight;
	canvasMap.width = window.innerWidth*15/100;
	canvasMap.height = window.innerHeight*15/100;
	canvasHpbar.width = window.innerWidth*85/100;
	canvasHpbar.height = window.innerHeight*4/100;
	canvasMpbar.width = window.innerWidth*85/100;
	canvasMpbar.height = window.innerHeight*2/100;
	canvasMpbarLong.width = window.innerWidth*85/100;
	canvasMpbarLong.height = window.innerHeight*2/100;
	canvasAttackbar.width = window.innerWidth*85/100;
	canvasAttackbar.height = window.innerHeight*2/100;
	canvasAttackbarLong.width = window.innerWidth*85/100;
	canvasAttackbarLong.height = window.innerHeight*2/100;


	widthViewPort=canvasViewPort.width;
	heightViewPort=canvasViewPort.height;

	widthMap=canvasMap.width;
	heightMap=canvasMap.height;

	widthBar=canvasHpbar.width;
	heightBar=canvasHpbar.height;

	widthBarMp=canvasMpbar.width;
	heightBarMp=canvasMpbar.height;

	widthBarMpLong=canvasMpbarLong.width;
	heightBarMpLong=canvasMpbarLong.height;
};

String.prototype.getWidth = function(font) {
  var f = font || 'bolder 15px arial',
      o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();
  o.remove();
  return w;
}
String.prototype.getWidthHp = function(font) {
  var f = font || (heightBar+'px arial'),
      o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();
  o.remove();
  return w;
}

/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};
function usunKola(){
	for(var k in Circles) {
    var currentTime = new Date();
    if((Circles[k].czasStartu+2000)>=currentTime.getTime()){
            deleteCircle(k);
        }
    }
}
/**************************************************
** GAME DRAW
**************************************************/
function invertColor(rgb) {
    rgb = [].slice.call(arguments).join(",").replace(/rgb\(|\)|rgba\(|\)|\s/gi, '').split(',');
    for (var i = 0; i < rgb.length; i++) rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
    return rgb.join(", ");
}
var counterMinimapAnimation = 0;
var toAdd = 2;

//intervalBonus = setInterval(sprawdzajBonus, 50);
//(0-60*1000)/50ms
//dlugosc bonusa
var bonusCounter = 0;
var czyDodano = new Boolean (false);
function sprawdzajBonus(){
	bonusCounter++;
	
	/*
	if(localPlayer.bonusToShow==2){
		localPlayer.x = Math.round(Math.random()*(10000)),
		localPlayer.y = Math.round(Math.random()*(10000));
		bonusCounter = 0;
		localPlayer.bonusToShow="n";
		czyKoniecBonusa=true;
		emitPlayer();
		clearInterval(intervalBonus);
	}
	*/
	switch(localPlayer.bonusToShow){
		case 0:
			//console.log(localPlayer.hp,localPlayer.lvl*100);
			//localPlayer.hp=localPlayer.lvl*100;
			//bonusCounter = 0;
			//localPlayer.bonusToShow="n";
			//czyKoniecBonusa=true;
			//emitPlayer();
			//clearInterval(intervalBonus);
		break;
		case 1:
			//emitPlayer();
		break;
		case 2:
			
		break;
		case 3:
			if(czyDodano==false){
				czyDodano=true;
				localPlayer.sta = localPlayer.sta +10;
				localPlayer.stb = localPlayer.stb +10;
				localPlayer.stc = localPlayer.stc +10;
			}
			emitPlayer();
		break;
		case 4:
			if(czyDodano==false){
				czyDodano=true;
				localPlayer.r1a = localPlayer.r1a +10;
				localPlayer.r1b = localPlayer.r1b +10;
				localPlayer.r1c = localPlayer.r1c +10;
				localPlayer.r2a = localPlayer.r2a +10;
				localPlayer.r2b = localPlayer.r2b +10;
				localPlayer.r2c = localPlayer.r2c +10;
				localPlayer.r3a = localPlayer.r3a +10;
				localPlayer.r3b = localPlayer.r3b +10;
				localPlayer.r3c = localPlayer.r3c +10;
			}
			emitPlayer();
		break;
		case 5:
			if(czyDodano==false){
				czyDodano=true;
				localPlayer.a1a = localPlayer.a1a +10;
				localPlayer.a1b = localPlayer.a1b +10;
				localPlayer.a1c = localPlayer.a1c +10;
				localPlayer.a2a = localPlayer.a2a +10;
				localPlayer.a2b = localPlayer.a2b +10;
				localPlayer.a2c = localPlayer.a2c +10;
				localPlayer.a3a = localPlayer.a3a +10;
				localPlayer.a3b = localPlayer.a3b +10;
				localPlayer.a3c = localPlayer.a3c +10;
			}
			emitPlayer();
		break;
		case 6:
			if(czyDodano==false){
				czyDodano=true;
				localPlayer.pda = localPlayer.pda +10;
				localPlayer.pdb = localPlayer.pdb +10;
				localPlayer.pdc = localPlayer.pdc +10;
			}
			emitPlayer();
		break;
		case 7:
			if(czyDodano==false){
				czyDodano=true;
				localPlayer.dea = localPlayer.dea +10;
				localPlayer.deb = localPlayer.deb +10;
				localPlayer.dec = localPlayer.dec +10;
			}
			emitPlayer();
		break;
	}
	
	if(bonusCounter>=1200){
		switch(localPlayer.bonusToShow){
			case 1:
				localPlayer.bonusToShow="n";
				emitPlayer();
			break;
			case 3:
				czyDodano=false;
				localPlayer.sta = localPlayer.sta -10;
				localPlayer.stb = localPlayer.stb -10;
				localPlayer.stc = localPlayer.stc -10;
				emitPlayer();
			break;
			case 4:
				czyDodano=false;
				localPlayer.r1a = localPlayer.r1a -10;
				localPlayer.r1b = localPlayer.r1b -10;
				localPlayer.r1c = localPlayer.r1c -10;
				localPlayer.r2a = localPlayer.r2a -10;
				localPlayer.r2b = localPlayer.r2b -10;
				localPlayer.r2c = localPlayer.r2c -10;
				localPlayer.r3a = localPlayer.r3a -10;
				localPlayer.r3b = localPlayer.r3b -10;
				localPlayer.r3c = localPlayer.r3c -10;
				emitPlayer();
			break;
			case 5:
				czyDodano=false;
				localPlayer.a1a = localPlayer.a1a -10;
				localPlayer.a1b = localPlayer.a1b -10;
				localPlayer.a1c = localPlayer.a1c -10;
				localPlayer.a2a = localPlayer.a2a -10;
				localPlayer.a2b = localPlayer.a2b -10;
				localPlayer.a2c = localPlayer.a2c -10;
				localPlayer.a3a = localPlayer.a3a -10;
				localPlayer.a3b = localPlayer.a3b -10;
				localPlayer.a3c = localPlayer.a3c -10;
				emitPlayer();
			break;
			case 6:
				czyDodano=false;
				localPlayer.pda = localPlayer.pda -10;
				localPlayer.pdb = localPlayer.pdb -10;
				localPlayer.pdc = localPlayer.pdc -10;
				emitPlayer();
			break;
			case 7:
				czyDodano=false;
				localPlayer.dea = localPlayer.dea -10;
				localPlayer.deb = localPlayer.deb -10;
				localPlayer.dec = localPlayer.dec -10;
				emitPlayer();
			break;
		}
		bonusCounter = 0;
		czyKoniecBonusa=true;
		localPlayer.bonusToShow="n";
		emitPlayer();
		clearInterval(intervalBonus);
	}

	//if(localPlayer.bonusToShow=="n"||czyKoniecBonusa==true){
	//intervalBonus = setInterval(sprawdzajBonus, 50);
	//clearInterval(intervalTp);

}

function drawPartyCircle(x,y,nick) {
	if(nick!=localPlayer.nick){
		var c = Parties[allPlayers[nick].party].color;
	}else{
		//x = localPlayer.x;
		//y = localPlayer.y;
		var c = Parties[localPlayer.party].color;
	}
	//dopasuj 3 kanaly do 4
	//from rgb(255, 255, 255) to 255, 255, 255 
	while((c.charAt(0) === 'r')||(c.charAt(0) === 'g')||(c.charAt(0) === 'b')||(c.charAt(0) === '(')) c = c.substr(1);
    c = c.substring(0, c.length - 1);
    ctxViewPort.globalAlpha=1-((1/counterMinimapAnimation)+(Math.random()/10));
    ctxViewPort.beginPath();
    var rad = ctxViewPort.createRadialGradient(x, y, 1, x, y, 70);
    
    rad.addColorStop(0, 'rgba('+c+', 1)');
    rad.addColorStop(1, 'rgba('+c+', 0)');
    ctxViewPort.fillStyle = rad;
    ctxViewPort.arc(x, y, 70, 0, Math.PI*2, false);
    ctxViewPort.fill();
    ctxMap.closePath();
    ctxViewPort.globalAlpha=1;

}
var directon = 0;
function draw() {

	if(counterMinimapAnimation==0){
		document.getElementById("peopleInParty").innerHTML="<b><i><u>P</b></i></u>arty:<br>";
	}
	
	counterMinimapAnimation++;
	if(counterMinimapAnimation>=90){
		counterMinimapAnimation=0;
		if(directon==0){directon=1;}else{directon=0;}
	}
	if(counterMinimapAnimation%45==0){
		toAdd = 2;
	}
	if(counterMinimapAnimation%45==15){
		toAdd = 1;
	}
	

	ctxViewPort.clearRect(0, 0, widthViewPort, heightViewPort);
	/*
	var my_gradient=ctxViewPort.createLinearGradient(0,0,widthViewPort,heightViewPort);
	//my_gradient.addColorStop(0,"rgb("+((Math.pow(localPlayer.x-localPlayer.y,2)/255).toFixed())+","+(Math.pow(localPlayer.y-localPlayer.x,2)/255).toFixed()+","+(Math.pow(localPlayer.y-localPlayer.x,2)/255).toFixed());
	//my_gradient.addColorStop(0.5,"rgb(0,"+(Math.pow((localPlayer.x+localPlayer.y),2)/255).toFixed()+",0)");
	//my_gradient.addColorStop(1,"rgb(0,0,0)");
	if(localPlayer.x<5000){
		var skladowaA =((localPlayer.x)*(255/5000)).toFixed();
	}else{
		var skladowaA =((10000-localPlayer.x)*(255/5000)).toFixed();
	}

	if(localPlayer.y<5000){
		var skladowaC =(localPlayer.y*(255/5000)).toFixed();
	}else{
		var skladowaC =(10000-localPlayer.y*(255/5000)).toFixed();
	}
	var skladowaB =((Math.pow(localPlayer.x+localPlayer.y,2))*(255/400000000)).toFixed();
	//console.log(skladowaA,skladowaB,skladowaC);
	my_gradient.addColorStop(0,"rgb("+skladowaA+","+skladowaC+","+skladowaB+")");
	my_gradient.addColorStop(0.5,"rgb("+skladowaB+","+skladowaA+","+skladowaC+")");
	my_gradient.addColorStop(1,"rgb("+skladowaC+","+skladowaB+","+skladowaA+")");
	*/
	//ctxViewPort.fillStyle=my_gradient;
	ctxViewPort.fillStyle="blue";
	ctxViewPort.fillRect(0,0,widthViewPort,heightViewPort);
	//bg
	//console.log((10000-localPlayer.x).toFixed(),(10000-localPlayer.y).toFixed(),0,0,widthViewPort,heightViewPort);
	//ctxViewPort.drawImage(canvasBg,(localPlayer.x-widthViewPort/2).toFixed(),(localPlayer.y-heightViewPort/2).toFixed(),widthViewPort,heightViewPort,0,0,widthViewPort,heightViewPort);
	//ctxViewPort.drawImage(canvasBg,localPlayer.x,localPlayer.y,widthViewPort,heightViewPort,0,0,widthViewPort,heightViewPort);
	//console.log(localPlayer.x,localPlayer.y,widthViewPort,heightViewPort,0,0,widthViewPort,heightViewPort);
	// Wipe the canvas clean
	//rysuj ramke na granicy
	if(localPlayer.x<=widthViewPort/2){
      ctxViewPort.fillStyle = '#505347';
      ctxViewPort.fillRect(0, 0,(widthViewPort/2-10)-localPlayer.x, heightViewPort);

    }
    if(localPlayer.y<=heightViewPort/2){
      ctxViewPort.fillStyle = '#505347';
      ctxViewPort.fillRect(0, 0, widthViewPort, (heightViewPort/2-10)-localPlayer.y);
    }
    if(localPlayer.x>=10000-widthViewPort/2){
      ctxViewPort.fillStyle = '#505347';
      ctxViewPort.fillRect(10000-widthViewPort/2+((widthViewPort)-localPlayer.x+10), 0, widthViewPort/2,heightViewPort);
    }
    if(localPlayer.y>=10000-heightViewPort/2){
      ctxViewPort.fillStyle = '#505347';
      ctxViewPort.fillRect(0, 10000-heightViewPort/2+((heightViewPort)-localPlayer.y+10), widthViewPort, heightViewPort/2);
    }
	//draw local Player
	
	//ctxViewPort.beginPath();


	//draw on minimap
	ctxMap.clearRect(0, 0, widthMap, heightMap);
	ctxMap.beginPath();
	// Draw the local player
	ctxMap.fillStyle = invertColor(localPlayer.color);
	ctxMap.arc(localPlayer.x*widthMap/10000, localPlayer.y*heightMap/10000,
            2+toAdd, 0, 2*Math.PI, false);
	ctxMap.fill();
	ctxMap.closePath();
	
	//drawpart on localplayer on minimap
	if((localPlayer.party!="")&&(Parties[localPlayer.party]!=undefined)){
		ctxMap.beginPath();
		ctxMap.strokeStyle = Parties[localPlayer.party].color;
		ctxMap.arc(localPlayer.x*widthMap/10000, localPlayer.y*heightMap/10000, 5, 0, 2*Math.PI, false);
		

		ctxMap.stroke();
		ctxMap.closePath();
		drawPartyCircle(widthViewPort/2, heightViewPort/2,localPlayer.nick);
	}
	ctxMap.beginPath();
	// Draw the local player
	ctxMap.fillStyle = localPlayer.color;
	ctxMap.arc(localPlayer.x*widthMap/10000, localPlayer.y*heightMap/10000,
            3, 0, 2*Math.PI, false);
	ctxMap.fill();
	ctxMap.closePath();

	for(var k in Bonus) {
		
		switch (Bonus[k].rodzaj){
            case 0:
            	//console.log(Bonus[k].rodzaj);
            	ctxMap.fillStyle = "red";
				ctxViewPort.fillStyle = "red";
                break;
            case 1:
            	//console.log(Bonus[k].rodzaj);
            	ctxMap.fillStyle = "white";
				ctxViewPort.fillStyle = "white";
                break;
            case 2:
            	ctxMap.fillStyle = "#CCCCFF";
				ctxViewPort.fillStyle = "#CCCCFF";
                break;
            case 3:
            	ctxMap.fillStyle = "#CC3300";
				ctxViewPort.fillStyle = "#CC3300";
                break;
            case 4:
            	ctxMap.fillStyle = "#009900";
				ctxViewPort.fillStyle = "#009900";
                break;
            case 5:
            	ctxMap.fillStyle = "#3399FF";
				ctxViewPort.fillStyle = "#3399FF";
                break;
            case 6:
            	ctxMap.fillStyle = "#FFFF00";
				ctxViewPort.fillStyle = "#FFFF00";
                break;
            case 7:
            	ctxMap.fillStyle = "#333300";
				ctxViewPort.fillStyle = "#333300";
                break;
            }
            ctxMap.fillRect((Bonus[k].x*widthMap/10000)-1,(Bonus[k].y*heightMap/10000)-1, 1, 1);
			if((Math.abs(Bonus[k].x-localPlayer.x)<(widthViewPort/2))&&(Math.abs(Bonus[k].y-localPlayer.y)<(heightViewPort/2))){
				ctxViewPort.fillRect((Bonus[k].x-localPlayer.x)+widthViewPort/2-10, (Bonus[k].y-localPlayer.y)+heightViewPort/2-10, 20, 20);
			}

	}

	if((xToShow>=0)&&(yToShow>=0)){
		ctxMap.beginPath();
		ctxMap.strokeStyle = "red";
		ctxMap.arc(xToShow*widthMap/10000, yToShow*heightMap/10000, 5+toAdd*2, 0, 2*Math.PI, false);
		ctxMap.stroke();
		ctxMap.closePath();
	}

	// Draw the remote players ==
    for(var k in allPlayers) {
    	if(k!=localPlayer.nick){
    		/*
    		var czyJestOnline = new Boolean(false);

    		for(var m in vips) {
    			if(vips[m]!=null&&vips[m]!=undefined&&allPlayers[k]!=null&&allPlayers[k]!=undefined){
    				if(vips[m].nick==allPlayers[k].nick){
			            vips[m].status="on";
			            czyJestOnline=true;
			            break;
			        }
    			}
		    }
		    if(czyJestOnline==false){
		    	var key = allPlayers[k].nick;
		    	if(vips[key]!=undefined){
		    		vips[key].status="off";
		    	}
		    }
*/
    		//console.log(allPlayers[k].color,localPlayer.color);
    		ctxMap.beginPath();
		   	ctxMap.fillStyle = allPlayers[k].color;
			ctxMap.arc(allPlayers[k].x*widthMap/10000, allPlayers[k].y*heightMap/10000,
		            2, 0, 2*Math.PI, false);
			ctxMap.fill();
			ctxMap.closePath();

			
			if((allPlayers[k].party==localPlayer.party)&&(localPlayer.party!="")){
				ctxMap.beginPath();

				ctxMap.strokeStyle = Parties[localPlayer.party].color;
				ctxMap.arc(allPlayers[k].x*widthMap/10000, allPlayers[k].y*heightMap/10000, 4+toAdd, 0, 2*Math.PI, false);
				ctxMap.stroke();
				ctxMap.closePath();
				if(counterMinimapAnimation==1){
					addPartyTp(k);
				}
			}
			
			//rysuj party na minimapie
			if(Parties[allPlayers[k]]!=undefined){
				if((allPlayers[k].party!=localPlayer.party)&&(allPlayers[k].party!="")&&(Parties[allPlayers[k].party].color!=undefined)){
					ctxMap.beginPath();

					ctxMap.strokeStyle = Parties[allPlayers[k].party].color;
					ctxMap.arc(allPlayers[k].x*widthMap/10000, allPlayers[k].y*heightMap/10000, 4, 0, 2*Math.PI, false);
					ctxMap.stroke();
					ctxMap.closePath();
				}
			}
			
			//if zasiegu wzroku
			if((Math.abs(allPlayers[k].x-localPlayer.x)<(widthViewPort/2))&&(Math.abs(allPlayers[k].y-localPlayer.y)<(heightViewPort/2))){
				if(allPlayers[k].party!=""){
					drawPartyCircle((allPlayers[k].x-localPlayer.x)+widthViewPort/2,(allPlayers[k].y-localPlayer.y)+heightViewPort/2,k);
				}

				//ctx3.fillRect((localPlayer.x-allPlayers[k].x)+widthViewPort/2, (localPlayer.y-allPlayers[k].y)+heightViewPort/2, a.width, a.height);
				

				function rysujRemoteBonus(Fcolor){
					ctxViewPort.beginPath();
					ctxViewPort.strokeStyle = Fcolor;
					ctxViewPort.arc((allPlayers[k].x-localPlayer.x)+widthViewPort/2, (allPlayers[k].y-localPlayer.y)+heightViewPort/2,30, 0, 2*Math.PI, false);
					ctxViewPort.arc((allPlayers[k].x-localPlayer.x)+widthViewPort/2, (allPlayers[k].y-localPlayer.y)+heightViewPort/2,30, Math.round(Math.random()*(10)), 2*Math.PI, false);
					ctxViewPort.stroke();
					ctxViewPort.closePath();

					if(directon==0){
						ctxViewPort.globalAlpha=counterMinimapAnimation/200;
					}else{
						ctxViewPort.globalAlpha=(90-counterMinimapAnimation)/200;
					}
							
					//Math.random()/2;
					ctxViewPort.fillStyle = Fcolor;
					ctxViewPort.arc((allPlayers[k].x-localPlayer.x)+widthViewPort/2, (allPlayers[k].y-localPlayer.y)+heightViewPort/2,counterMinimapAnimation/30, 0, 2*Math.PI, false);
					ctxViewPort.fill();
					ctxViewPort.globalAlpha=1;
				}

				//rysuj bonusToShow tutaj
				switch (allPlayers[k].bonusToShow){
					case 1:
						rysujRemoteBonus('white');
					break;
					case 3:
						rysujRemoteBonus('#CC3300');

					break;
					case 4:
						rysujRemoteBonus('#009900');

					break;
					case 5:
						rysujRemoteBonus('#3399FF');
	
					break;
					case 6:
						rysujRemoteBonus('#FFFF00');

					break;
					case 7:
						rysujRemoteBonus('#333300');

					break;
				}


				ctxViewPort.beginPath();
				// Draw the remote player
				ctxViewPort.fillStyle = allPlayers[k].color;
				ctxViewPort.arc((allPlayers[k].x-localPlayer.x)+widthViewPort/2, (allPlayers[k].y-localPlayer.y)+heightViewPort/2,
			            10, 0, 2*Math.PI, false);
				ctxViewPort.fill();
				ctxViewPort.closePath();
				//narysuj pasek hp i nick
				ctxViewPort.fillStyle = allPlayers[k].color;
				ctxViewPort.font = 'bolder 15px arial';
				ctxViewPort.textBaseline = 'bottom';
				switch (allPlayers[k].klasa){
					case "a":
						var toShow = k +"[" +  allPlayers[k].lvla+"]";
						var szerokoscPaska = (allPlayers[k].hp/(allPlayers[k].lvla*100))*40;
					break;
					case "b":
						var toShow = k +"[" +  allPlayers[k].lvlb+"]";
						var szerokoscPaska = (allPlayers[k].hp/(allPlayers[k].lvlb*100))*40;
					break;
					case "c":
						var toShow = k +"[" +  allPlayers[k].lvlc+"]";
						var szerokoscPaska = (allPlayers[k].hp/(allPlayers[k].lvlc*100))*40;
					break;
				}
				
				ctxViewPort.fillText(toShow, (allPlayers[k].x-localPlayer.x)+widthViewPort/2-toShow.getWidth()/2, (allPlayers[k].y-localPlayer.y)+heightViewPort/2-20);
				ctxViewPort.fillStyle = "red";
				
    			var polowaPaska = szerokoscPaska/2;
				ctxViewPort.fillRect((allPlayers[k].x-localPlayer.x)+widthViewPort/2-polowaPaska, (allPlayers[k].y-localPlayer.y)+heightViewPort/2-20, szerokoscPaska, 10);
				
				
				
			}

    	}else{
    		//console.log(k, allPlayers[k]);
    		localPlayer.party=allPlayers[k].party;
    		localPlayer.hp=allPlayers[k].hp;
    		localPlayer.hitsa=allPlayers[k].hitsa;
    		localPlayer.lvla=allPlayers[k].lvla;
    		localPlayer.hitsb=allPlayers[k].hitsb;
    		localPlayer.lvlb=allPlayers[k].lvlb;
    		localPlayer.hitsc=allPlayers[k].hitsc;
    		localPlayer.lvlc=allPlayers[k].lvlc;//((allPlayers[k].hits/10)+1).toFixed();
    		ctxViewPort.globalAlpha=alphaPoint/9*10;
    		ctxViewPort.beginPath();
    		ctxViewPort.fillStyle = localPlayer.color;
			ctxViewPort.arc(-(allPlayers[k].x-localPlayer.x)+widthViewPort/2, -(allPlayers[k].y-localPlayer.y)+heightViewPort/2,
			            2, 0, 2*Math.PI, false);
			ctxViewPort.fill();
			ctxViewPort.closePath();
			ctxViewPort.globalAlpha=1;
			//sprawdz allPlayers[k].bonus, jezeli //&&czyKoniecBonusa==true
			if((localPlayer.bonusToShow=="n")&&(allPlayers[k].bonus!="n")&&(czyKoniecBonusa==true)){
					if(allPlayers[k].bonus==2){
						localPlayer.x = Math.round(Math.random()*(10000)),
						localPlayer.y = Math.round(Math.random()*(10000));
						//bonusCounter = 0;
						//localPlayer.bonusToShow="n";
						//czyKoniecBonusa=true;
						emitPlayer();		
					}
					if((allPlayers[k].bonus!=2)&&(allPlayers[k].bonus!=0)){
						localPlayer.bonusToShow=allPlayers[k].bonus;
						emitPlayer();
						czyKoniecBonusa=false;
						intervalBonus = setInterval(sprawdzajBonus, 50);
						//console.log(localPlayer.bonusToShow);
					}
					
				//clearInterval(intervalBonus);
				
				//if z regeneracja hp jezeli bonus.rodzaj = 1
				/*
				if(allPlayers[k].bonus==0){
					localPlayer.hp=localPlayer.lvl*100;
					emitPlayer();
				}
				*/
				
			}else{
				if((allPlayers[k].bonus==2)){
					//console.log("tp");
					localPlayer.x = Math.round(Math.random()*(10000)),
					localPlayer.y = Math.round(Math.random()*(10000));
					//bonusCounter = 0;
					//localPlayer.bonusToShow="n";
					//czyKoniecBonusa=true;
					emitPlayer();	
				}
			}
			function rysujBonus(Fcolor){
				ctxViewPort.beginPath();
				ctxViewPort.strokeStyle = Fcolor;
				ctxViewPort.arc(widthViewPort/2, heightViewPort/2,30, 0, 2*Math.PI, false);					ctxViewPort.arc(widthViewPort/2, heightViewPort/2,30, Math.round(Math.random()*(10)), 2*Math.PI, false);
				ctxViewPort.stroke();
				ctxViewPort.closePath();
				if(directon==0){
					ctxViewPort.globalAlpha=counterMinimapAnimation/200;
				}else{
					ctxViewPort.globalAlpha=(90-counterMinimapAnimation)/200;
				}
							
				//Math.random()/2;
				ctxViewPort.fillStyle = Fcolor;
				ctxViewPort.arc(widthViewPort/2, heightViewPort/2,counterMinimapAnimation/30, 0, 2*Math.PI, false);
				ctxViewPort.fill();
				ctxViewPort.globalAlpha=1;
			}
			//rysuj bonusToShow local tutaj
			switch (localPlayer.bonusToShow){
					case 1:
						rysujBonus('white');
					break;
					case 3:
						rysujBonus('#CC3300');
						document.getElementById("staToShow").innerHTML= localPlayer.sta+"(+10)";
						document.getElementById("stbToShow").innerHTML= localPlayer.stb+"(+10)";
						document.getElementById("stcToShow").innerHTML= localPlayer.stc+"(+10)";
					break;
					case 4:
						rysujBonus('#009900');
						//document.getElementById("rToShow").innerHTML= localPlayer.r+"(+10)";
						document.getElementById("r1aToShow").innerHTML= localPlayer.r1a+"(+10)";
						document.getElementById("r2aToShow").innerHTML= localPlayer.r2a+"(+10)";
						document.getElementById("r3aToShow").innerHTML= localPlayer.r3a+"(+10)";
						document.getElementById("r1bToShow").innerHTML= localPlayer.r1b+"(+10)";
						document.getElementById("r2bToShow").innerHTML= localPlayer.r2b+"(+10)";
						document.getElementById("r3bToShow").innerHTML= localPlayer.r3b+"(+10)";
						document.getElementById("r1cToShow").innerHTML= localPlayer.r1c+"(+10)";
						document.getElementById("r2cToShow").innerHTML= localPlayer.r2c+"(+10)";
						document.getElementById("r3cToShow").innerHTML= localPlayer.r3c+"(+10)";
					break;
					case 5:
						rysujBonus('#3399FF');
						document.getElementById("a1aToShow").innerHTML= localPlayer.a1a+"(+10)";
						document.getElementById("a2aToShow").innerHTML= localPlayer.a2a+"(+10)";
						document.getElementById("a3aToShow").innerHTML= localPlayer.a3a+"(+10)";
						document.getElementById("a1bToShow").innerHTML= localPlayer.a1b+"(+10)";
						document.getElementById("a2bToShow").innerHTML= localPlayer.a2b+"(+10)";
						document.getElementById("a3bToShow").innerHTML= localPlayer.a3b+"(+10)";
						document.getElementById("a1cToShow").innerHTML= localPlayer.a1c+"(+10)";
						document.getElementById("a2cToShow").innerHTML= localPlayer.a2c+"(+10)";
						document.getElementById("a3cToShow").innerHTML= localPlayer.a3c+"(+10)";
					break;
					case 6:
						rysujBonus('#FFFF00');
						document.getElementById("pdaToShow").innerHTML= localPlayer.pda+"(+10)";
						document.getElementById("pdbToShow").innerHTML= localPlayer.pdb+"(+10)";
						document.getElementById("pdcToShow").innerHTML= localPlayer.pdc+"(+10)";
					break;
					case 7:
						rysujBonus('#333300');
						document.getElementById("deaToShow").innerHTML= localPlayer.dea+"(+10)";
						document.getElementById("debToShow").innerHTML= localPlayer.deb+"(+10)";
						document.getElementById("decToShow").innerHTML= localPlayer.dec+"(+10)";
					break;
					
				}
    	}
	}

	ctxViewPort.fillStyle = localPlayer.color;
	ctxViewPort.font = 'bolder 15px arial';
	ctxViewPort.textBaseline = 'bottom';
	//ctxViewPort.fillText(k, (allPlayers[k].x-localPlayer.x)+widthViewPort/2-k.getWidth()/2, (allPlayers[k].y-localPlayer.y)+heightViewPort/2-20);
    ctxViewPort.fillText(localPlayer.nick, widthViewPort/2-localPlayer.nick.getWidth()/2, heightViewPort/2-20);
    ctxViewPort.fillStyle = "red";
    switch(localPlayer.klasa){
    	case "a":
    		var szerokoscPaska = (localPlayer.hp/(localPlayer.lvla*100))*40;
    	break;
    	case "b":
    		var szerokoscPaska = (localPlayer.hp/(localPlayer.lvlb*100))*40;
    	break;
    	case "c":
    		var szerokoscPaska = (localPlayer.hp/(localPlayer.lvlc*100))*40;
    	break;
    }
    
    var polowaPaska = szerokoscPaska/2;
	ctxViewPort.fillRect(widthViewPort/2-polowaPaska, heightViewPort/2-20, szerokoscPaska, 10);
	
	


	ctxHpbar.fillStyle = "#c30";
	ctxHpbar.fillRect(0,0, widthBar, heightBar);
	ctxHpbar.fillStyle = "red";
	ctxHpbar.font = heightBar+'px arial';
	ctxHpbar.textBaseline = 'bottom';
	var toShow = "Find health shrine (red square) ";
	ctxHpbar.fillText(toShow, widthBar-toShow.getWidthHp(), heightBar);

	ctxHpbar.fillStyle = "red";
	switch(localPlayer.klasa){
        case "a":
            ctxHpbar.fillRect(0,0, (localPlayer.hp/(localPlayer.lvla*100))*widthBar, heightBar);
        break;
        case "b":
            ctxHpbar.fillRect(0,0, (localPlayer.hp/(localPlayer.lvlb*100))*widthBar, heightBar);
        break;
        case "c":
            ctxHpbar.fillRect(0,0, (localPlayer.hp/(localPlayer.lvlc*100))*widthBar, heightBar);
        break;
    }
	


 	// Draw the local player
 	ctxViewPort.beginPath();
	ctxViewPort.fillStyle = localPlayer.color;
	ctxViewPort.arc(widthViewPort/2, heightViewPort/2,
            10, 0, 2*Math.PI, false);
	ctxViewPort.fill();
	ctxViewPort.closePath();
	//rysuj kolka
	for(var k in Circles) {
 		//console.log(Circles[k]);
 		//if(((Math.abs(Circles[k].x-localPlayer.x)<(widthViewPort/2))&&(Math.abs(Circles[k].y-localPlayer.y)<(heightViewPort/2)))||((Math.pow(Circles[k].r*10,2)+(Math.pow(widthViewPort,2)+Math.pow(heightViewPort,2)))>=(Math.pow((localPlayer.x-Circles[k].x),2)+Math.pow((localPlayer.x-Circles[k].x),2)))){
		if(true){
		// Draw the remote player
			//shadeRGBColor
			
			ctxViewPort.globalAlpha=Math.random()/4;
			ctxViewPort.beginPath();
			ctxViewPort.fillStyle = Circles[k].color;
			//xViewPort.arc((Circles[k].x-localPlayer.x)+widthViewPort/2, (Circles[k].y-localPlayer.y)+heightViewPort/2,Circles[k].r*7, Math.round(Math.random()*2), Math.PI*Math.round(Math.random()*1), false);
			//ctxViewPort.arc((Circles[k].x-localPlayer.x)+widthViewPort/2, (Circles[k].y-localPlayer.y)+heightViewPort/2,Circles[k].r*8, -Math.round(Math.random()*7), Math.PI*Math.round(Math.random()*1), false);
			//ctxViewPort.arc((Circles[k].x-localPlayer.x)+widthViewPort/2, (Circles[k].y-localPlayer.y)+heightViewPort/2,Circles[k].r*10, 0, 2*Math.PI, false);
			//ctxViewPort.arc((Circles[k].x-localPlayer.x)+widthViewPort/2, (Circles[k].y-localPlayer.y)+heightViewPort/2,Circles[k].r*10+Math.round(Math.random()*10), 0, 2*Math.PI, false);
			//ctxViewPort.arc((Circles[k].x-localPlayer.x)+widthViewPort/2, (Circles[k].y-localPlayer.y)+heightViewPort/2,Circles[k].r*10+Math.round(Math.random()*10), 0, 2*Math.Pi, false);
			
			if(Circles[k].r<0){
				Circles[k].r=0;
			}
			ctxViewPort.arc(((Circles[k].x-localPlayer.x)+(widthViewPort/2)), ((Circles[k].y-localPlayer.y)+(heightViewPort/2)),(Circles[k].r*10+(Math.round(Math.random()*10))), 0, 2*Math.PI, false);
			
			ctxViewPort.fill();
			ctxViewPort.closePath();
			ctxViewPort.globalAlpha=Math.random()/2;
			ctxViewPort.beginPath();
			ctxViewPort.strokeStyle = Circles[k].color;
			ctxViewPort.arc((Circles[k].x-localPlayer.x)+widthViewPort/2, (Circles[k].y-localPlayer.y)+heightViewPort/2,Circles[k].r*8, 0, 2*Math.PI, false);
			ctxViewPort.arc((Circles[k].x-localPlayer.x)+widthViewPort/2, (Circles[k].y-localPlayer.y)+heightViewPort/2,Circles[k].r*8, 0, Math.random()*2*Math.PI, false);
			ctxViewPort.globalAlpha=Math.random()/2;
			ctxViewPort.strokeStyle = Circles[k].color;
			ctxViewPort.arc((Circles[k].x-localPlayer.x)+widthViewPort/2, (Circles[k].y-localPlayer.y)+heightViewPort/2,Circles[k].r*7, 0, Math.random()*2*Math.PI, false);
			ctxViewPort.arc((Circles[k].x-localPlayer.x)+widthViewPort/2, (Circles[k].y-localPlayer.y)+heightViewPort/2,Circles[k].r*7, 0, 2*Math.PI, false);
			ctxViewPort.globalAlpha=Math.random()/2;
			ctxViewPort.arc((Circles[k].x-localPlayer.x)+widthViewPort/2, (Circles[k].y-localPlayer.y)+heightViewPort/2,Circles[k].r*10, 0, 2*Math.PI, false);
			ctxViewPort.strokeStyle = Circles[k].color;
			ctxViewPort.arc((Circles[k].x-localPlayer.x)+widthViewPort/2, (Circles[k].y-localPlayer.y)+heightViewPort/2,Circles[k].r*10, 0, Math.random()*2*Math.PI, false);
			ctxViewPort.arc((Circles[k].x-localPlayer.x)+widthViewPort/2, (Circles[k].y-localPlayer.y)+heightViewPort/2,Circles[k].r*10+2, 0, 2*Math.PI, false);
			ctxViewPort.stroke();
			ctxViewPort.closePath();
			ctxViewPort.globalAlpha=1;
 		}
    	
    }

    for(var k in Damage) {

 		//console.log(Circles[k]);
 		if((Math.abs(Damage[k].x-localPlayer.x)<(widthViewPort/2))&&(Math.abs(Damage[k].y-localPlayer.y)<(heightViewPort/2))){
 			ctxViewPort.fillStyle = getRandomColor();
 			var randomRozmiar = 20 + Math.round(Math.random()*(20)) -5;
 			var randomBold = (1+Math.round(Math.random()*(8)))*100;
			ctxViewPort.font = randomBold +" "+randomRozmiar+'px arial';
			ctxViewPort.textBaseline = 'bottom';
			var toShow = Damage[k].dmg;
			ctxViewPort.fillText(toShow, (Damage[k].x-localPlayer.x)+widthViewPort/2-5, (Damage[k].y-localPlayer.y)+heightViewPort/2-5);
 		}
    	
    }


   
	//Circles[key] = {r: msg.r, x: msg.x, y: msg.y, color: msg.color,czasStartu: czasWystartowania};

};

function emitPlayer(){
	socket.emit('player', localPlayer);
	//socket.emit('player', {nick: localPlayer.nick, x: localPlayer.x, y: localPlayer.y, sila: localPlayer.sila, predkosc: localPlayer.predkosc, r: localPlayer.r, ilosc: localPlayer.ilosc, color: localPlayer.color, bonusToShow: localPlayer.bonusToShow, party: localPlayer.party});
}

function deleteCircle (id){
    delete Circles[id];
}

function deleteDamage (id){
    delete Damage[id];
}

function update(){
	for(var m in vips) {
    	var czyJestOnline = new Boolean(false);
    	for(var k in allPlayers) {
    		if(k!=localPlayer.nick){
    			if(vips[m]!=null&&vips[m]!=undefined&&allPlayers[k]!=null&&allPlayers[k]!=undefined){
    				if(vips[m].nick==allPlayers[k].nick){
			            vips[m].status="on";
			            czyJestOnline=true;
			            break;
			        }
    			}
		    }
		}
		if(czyJestOnline==false){
		    var key = vips[m].nick;
		    if(vips[key]!=undefined){
		    	vips[key].status="off";
		    }
		}
	}

	localPlayer.color = colorPick.style.backgroundColor;
	var predkosc = 0;
	switch(localPlayer.klasa){
		case "a":
			predkosc=localPlayer.pda;
		break;
		case "b":
			predkosc=localPlayer.pdb;
		break;
		case "c":
			predkosc=localPlayer.pdc;
		break;
	}
	if(($('#msgInput').is(':focus')==false)&&($('#vip').is(':focus')==false)){
	  	if (((65 in keysDown)||(37 in keysDown))) {
	  	    localPlayer.x -= (predkosc/20)+5;
	  	    emitPlayer();
			if(localPlayer.x<0){
				localPlayer.x=0;
			}
	  	}  
	  	if (((83 in keysDown)||(40 in keysDown))) {
			localPlayer.y += (predkosc/20)+5;
			emitPlayer();
			if(localPlayer.y>10000){
				localPlayer.y=10000;
			}
	  	} 
	  	if (((68 in keysDown)||(39 in keysDown))) {
	   		localPlayer.x += (predkosc/20)+5;
	   		emitPlayer();
			if(localPlayer.x>10000){
				localPlayer.x=10000;
			}
	    }
	  	if (((87 in keysDown)||(38 in keysDown))) {
	  		localPlayer.y -= (predkosc/20)+5;
			emitPlayer();
			if(localPlayer.y<0){
				localPlayer.y=0;
			}
		}
	}
	/*
	if(13 in keysDown){
				sendChatMessage();
	}
	if(27 in keysDown){
		if(document.getElementById("tools").style.display=="block"){
			document.getElementById("tools").style.display="none";
			document.getElementById("chat").style.display="none";
			document.getElementById("stats").style.display="none";
			document.getElementById("shop").style.display="none";
		}
	}
	*/
	
	

	for(var k in Circles) {
		var currentTime = new Date();
		if((Circles[k].czasStartu+200)<=currentTime.getTime()){
            deleteCircle(k);
        }
    }

    for(var k in Damage) {
		var currentTime = new Date();
		if((Damage[k].czasStartu+300)<=currentTime.getTime()){
            deleteDamage(k);
        }
    }

    //var skillPoints = parseInt(parseInt(localPlayer.lvl-(localPlayer.r+localPlayer.ilosc+localPlayer.predkosc+localPlayer.sila))+parseInt(39));
//*************************************
//CHEAT

/*
    if((localPlayer.bonusToShow==3)||(localPlayer.bonusToShow==4)||(localPlayer.bonusToShow==5)||(localPlayer.bonusToShow==6)){
    	if((skillPoints+10)<0){
			alert("don't cheat!");
			localPlayer = {nick: localPlayer.nick, x: 0, y: 0, hp: 100, sila: 10, predkosc: 10, r: 10, ilosc: 10, color: "#ffffff", hits: 0, bonusToShow: "n"};
		}
	}else{
		if(skillPoints<0){
			alert("don't cheat!");
			localPlayer = {nick: localPlayer.nick, x: 0, y: 0, hp: 100, sila: 10, predkosc: 10, r: 10, ilosc: 10, color: "#ffffff", hits: 0, bonusToShow: "n"};
		}

    }
	*/

	var lvlToCounta= localPlayer.lvla+1;
	var xaToShow;
	var CurXPa=localPlayer.hitsa;
	xaToShow = ((50/3)*Math.pow(lvlToCounta,3))-(100*Math.pow(lvlToCounta,2))+((850/3)*lvlToCounta)-200-CurXPa;
	xaToShow = Math.floor(xaToShow);
	var lvlToCountb= localPlayer.lvlb+1;
	var xbToShow;
	var CurXPb=localPlayer.hitsb;
	xbToShow = ((50/3)*Math.pow(lvlToCountb,3))-(100*Math.pow(lvlToCountb,2))+((850/3)*lvlToCountb)-200-CurXPb;
	xbToShow = Math.floor(xbToShow);
	var lvlToCountc= localPlayer.lvlc+1;
	var xcToShow;
	var CurXPc=localPlayer.hitsc;
	xcToShow = ((50/3)*Math.pow(lvlToCountc,3))-(100*Math.pow(lvlToCountc,2))+((850/3)*lvlToCountc)-200-CurXPc;
	xcToShow = Math.floor(xcToShow);
	document.getElementById("toNextLvla").innerHTML= xaToShow+" hits to next level.";
	document.getElementById("toNextLvlb").innerHTML= xbToShow+" hits to next level.";
	document.getElementById("toNextLvlc").innerHTML= xcToShow+" hits to next level.";
	/*
	document.getElementById("toNextLvl").innerHTML= xToShow+" hits to next level.";
	document.getElementById("nickToShow").innerHTML= localPlayer.nick;
	document.getElementById("lvlToShowA").innerHTML= localPlayer.lvla;
	document.getElementById("hitsToShow").innerHTML= localPlayer.hits;
	document.getElementById("rToShow").innerHTML= localPlayer.r;
	document.getElementById("amountToShow").innerHTML= localPlayer.ilosc;
	document.getElementById("speedToShow").innerHTML= localPlayer.predkosc;
	document.getElementById("strengthToShow").innerHTML= localPlayer.sila;
	var tempSkillPoints = parseInt(parseInt(localPlayer.lvl-(localPlayer.r+localPlayer.ilosc+localPlayer.predkosc+localPlayer.sila))+parseInt(39));
	if(tempSkillPoints<0){	
		tempSkillPoints=0
	}
	document.getElementById("skillPointsToShow").innerHTML= tempSkillPoints;
	*/
	document.getElementById("nickToShow").innerHTML= localPlayer.nick;
	document.getElementById("lvlToShowA").innerHTML= localPlayer.lvla;
	document.getElementById("lvlToShowB").innerHTML= localPlayer.lvlb;
	document.getElementById("lvlToShowC").innerHTML= localPlayer.lvlc;
	document.getElementById("hitsToShowA").innerHTML= localPlayer.hitsa;
	document.getElementById("hitsToShowB").innerHTML= localPlayer.hitsb;
	document.getElementById("hitsToShowC").innerHTML= localPlayer.hitsc;
	document.getElementById("r1aToShow").innerHTML= localPlayer.r1a;
	document.getElementById("r1bToShow").innerHTML= localPlayer.r1b;
	document.getElementById("r1cToShow").innerHTML= localPlayer.r1c;
	document.getElementById("a1aToShow").innerHTML= localPlayer.a1a;
	document.getElementById("a1bToShow").innerHTML= localPlayer.a1b;
	document.getElementById("a1cToShow").innerHTML= localPlayer.a1c;
	document.getElementById("r2aToShow").innerHTML= localPlayer.r2a;
	document.getElementById("r2bToShow").innerHTML= localPlayer.r2b;
	document.getElementById("r2cToShow").innerHTML= localPlayer.r2c;
	document.getElementById("a2aToShow").innerHTML= localPlayer.a2a;
	document.getElementById("a2bToShow").innerHTML= localPlayer.a2b;
	document.getElementById("a2cToShow").innerHTML= localPlayer.a2c;
	document.getElementById("r3aToShow").innerHTML= localPlayer.r3a;
	document.getElementById("r3bToShow").innerHTML= localPlayer.r3b;
	document.getElementById("r3cToShow").innerHTML= localPlayer.r3c;
	document.getElementById("a3aToShow").innerHTML= localPlayer.a3a;
	document.getElementById("a3bToShow").innerHTML= localPlayer.a3b;
	document.getElementById("a3cToShow").innerHTML= localPlayer.a3c;

	document.getElementById("staToShow").innerHTML= localPlayer.sta;
	document.getElementById("deaToShow").innerHTML= localPlayer.dea;
	document.getElementById("pdaToShow").innerHTML= localPlayer.pda;
	document.getElementById("stbToShow").innerHTML= localPlayer.stb;
	document.getElementById("debToShow").innerHTML= localPlayer.deb;
	document.getElementById("pdbToShow").innerHTML= localPlayer.pdb;
	document.getElementById("stcToShow").innerHTML= localPlayer.stc;
	document.getElementById("decToShow").innerHTML= localPlayer.dec;
	document.getElementById("pdcToShow").innerHTML= localPlayer.pdc;

	var skillPointsA = parseInt(parseInt(localPlayer.lvla-(localPlayer.r1a+localPlayer.a1a+localPlayer.r2a+localPlayer.a2a+localPlayer.r3a+localPlayer.a3a))+parseInt(59));
	var skillPointsB = parseInt(parseInt(localPlayer.lvlb-(localPlayer.r1b+localPlayer.a1b+localPlayer.r2b+localPlayer.a2b+localPlayer.r3b+localPlayer.a3b))+parseInt(59));
	var skillPointsC = parseInt(parseInt(localPlayer.lvlc-(localPlayer.r1c+localPlayer.a1c+localPlayer.r2c+localPlayer.a2c+localPlayer.r3c+localPlayer.a3c))+parseInt(59));
	var statsPointsA = parseInt(parseInt(localPlayer.lvla-(localPlayer.sta+localPlayer.dea+localPlayer.pda))+parseInt(29)); 
	var statsPointsB = parseInt(parseInt(localPlayer.lvlb-(localPlayer.stb+localPlayer.deb+localPlayer.pdb))+parseInt(29)); 
	var statsPointsC = parseInt(parseInt(localPlayer.lvlc-(localPlayer.stc+localPlayer.dec+localPlayer.pdc))+parseInt(29)); 

	document.getElementById("skillpointsToShowA").innerHTML= skillPointsA;
	document.getElementById("skillpointsToShowB").innerHTML= skillPointsB;
	document.getElementById("skillpointsToShowC").innerHTML= skillPointsC;

	document.getElementById("statspointsToShowA").innerHTML= statsPointsA;
	document.getElementById("statspointsToShowB").innerHTML= statsPointsB;
	document.getElementById("statspointsToShowC").innerHTML= statsPointsC;
	if(localPlayer.bonusToShow=="n"||localPlayer.bonusToShow==1){

	    var xxx = document.getElementById("stats");
	    var yyy = xxx.getElementsByClassName("buttonDoStatsow");
	    var i;
	    for (i = 0; i < yyy.length; i++) {
	        yyy[i].onclick=function() {statsChanges(this.id)};
	    }
		/*
		document.getElementById("plus1").onclick=function() {rPlus()};
		document.getElementById("minus1").onclick=function() {rMinus()};
		document.getElementById("plus2").onclick=function() {amountPlus()};
		document.getElementById("minus2").onclick=function() {amountMinus()};
		document.getElementById("plus3").onclick=function() {speedPlus()};
		document.getElementById("minus3").onclick=function() {speedMinus()};
		document.getElementById("plus4").onclick=function() {strengthPlus()};
		document.getElementById("minus4").onclick=function() {strengthMinus()};
		*/
		document.getElementById("notifyB").style.display="none";
	}else{
		document.getElementById("notifyBonus").innerHTML="You can't manage skill points when you have a bonus.";

		document.getElementById("notifyB").style.display="block";

		var xxx = document.getElementById("stats");
	    var yyy = xxx.getElementsByClassName("buttonDoStatsow");
	    var i;
	    for (i = 0; i < yyy.length; i++) {
	        yyy[i].onclick=function() {};
	    }
/*
		document.getElementById("plus1").onclick=function(){};
		document.getElementById("minus1").onclick=function(){};
		document.getElementById("plus2").onclick=function(){};
		document.getElementById("minus2").onclick=function(){};
		document.getElementById("plus3").onclick=function(){};
		document.getElementById("minus3").onclick=function(){};
		document.getElementById("plus4").onclick=function(){};
		document.getElementById("minus4").onclick=function(){};
		*/	
	}

	//usunKola();
	if(prevLvla<localPlayer.lvla){
		prevLvla = localPlayer.lvla;
		var textToSend = "Congratulations <i>"+localPlayer.nick+"</i>! Class A LVL UP ["+localPlayer.lvla+"]";
		socket.emit('chatMessage', {nick: "Mockup.Gq", message: textToSend});
	}
	if(prevLvlb<localPlayer.lvlb){
		prevLvlb = localPlayer.lvlb;
		var textToSend = "Congratulations <i>"+localPlayer.nick+"</i>! Class B LVL UP ["+localPlayer.lvlb+"]";
		socket.emit('chatMessage', {nick: "Mockup.Gq", message: textToSend});
	}
	if(prevLvlc<localPlayer.lvlc){
		prevLvlc = localPlayer.lvlc;
		var textToSend = "Congratulations <i>"+localPlayer.nick+"</i>! Class C LVL UP ["+localPlayer.lvlc+"]";
		socket.emit('chatMessage', {nick: "Mockup.Gq", message: textToSend});
	}
	
	
	

	if(localPlayer.party!=""){
		document.getElementById("partyName").value=localPlayer.party;
		//document.getElementById("partyName").value=localPlayer.party;
	}else{

	}
	//document.getElementById("vipsToShow").innerHTML="";
	for(var k in vips) {
		if(vips[k].nick!=undefined){
			addVip(vips[k].nick, vips[k].status);
		}
	}
}
function writeToVip(id){
	console.log(id);
	var str = document.getElementById("msgInput").value;
	//usun *nick, jezeli jest
	var gwiazdka = str.indexOf("*");
	if(gwiazdka==0){
		var przecinek = str.indexOf(",");
		document.getElementById("msgInput").value = str.slice(przecinek+1);
	}
	document.getElementById("msgInput").value = "*"+id+", "+document.getElementById("msgInput").value;
	document.getElementById("msgInput").focus();
}
function addVip(nick,status){
	var istnieje = new Boolean (false);
	var xxx = document.getElementById("vipsToShow");
	var yyy = xxx.getElementsByClassName("vipShow");
	var i;
	for (i = 0; i < yyy.length; i++) {
	    if(nick==yyy[i].id){
	    	istnieje=true;
	    	break;
	    }
	}

	if(istnieje==false){
		var elementEnter = document.createElement("div");
		var element = document.createElement("span");
	    //Assign different attributes to the element. 
	    element.className ="vipShow";
	    element.innerHTML = nick;
	    element.id = nick;
		if(status=="on"){
			element.style.backgroundColor="green";
		}else{
			element.style.backgroundColor="red";
		}
		element.onclick=function() {writeToVip(this.id)};
		var foo = document.getElementById("vipsToShow");
		
	    foo.appendChild(element);
	    foo.appendChild(elementEnter);

	    var el = document.getElementById(nick);
	    el.onclick=function() {writeToVip(this.id)};
	}else{
		if(status=="on"){
			document.getElementById(nick).style.backgroundColor="green";
		}else{
			document.getElementById(nick).style.backgroundColor="red";
		}
	}
	
}

/* HEX
function shadeColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function blendColors(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
}
*/ //RGB
function shadeRGBColor(color, percent) {
    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}

function blendRGBColors(c0, c1, p) {
    var f=c0.split(","),t=c1.split(","),R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((parseInt(t[0].slice(4))-R)*p)+R)+","+(Math.round((parseInt(t[1])-G)*p)+G)+","+(Math.round((parseInt(t[2])-B)*p)+B)+")";
}
/*
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
*/