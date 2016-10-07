var express  = require('express');
var app      = express();
//var port     = process.env.PORT || 8080;
var port = 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path = require('path'),
    fs = require('fs');
var http = require('http')
var server = http.createServer(app)


var configDB = require('./config/database.js');




var mongodb = require('mongodb');
var assert = require('assert');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://127.0.0.1:27017/playable';
const cluster = require('cluster');
var util = require('util');
var colors = require('colors');
var numCPUs = require('os').cpus().length;
var numCPUs = 2;

var toSendChat = new Array(100);

var Players = {};
var Parties = {};
var Invitations = {};
var Bonus = {};

var NickAndId = {};
var vips = {};

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10){
    dd='0'+dd
} 
if(mm<10){
    mm='0'+mm
} 

var day = dd+'/'+mm;
var odKiedyUp = today.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")+", "+day;
var rekord=0;
function makeRandomBonus(){
    for (var a=0;a<100;a++){
        var randomX = Math.round(Math.random()*(10000)),
            randomY = Math.round(Math.random()*(10000));
        var random = 7+Math.round(Math.random()*(8));
        Bonus[a] = {rodzaj: random%8,x: randomX,y: randomY};
        /*
        

*/
        
    }

}
/*
function findAndReplace(object, value, replacevalue){
  for(var x in object){
    if(typeof object[x] == 'object'){
      findAndReplace(object[x], value, replacevalue);
    }
    if(object[x] == value){ 
      object["name"] = replacevalue;
      // break; // uncomment to stop after first replacement
    }
  }
}
*/
function findPlayerAndReplaceStats(object,nick,x,y,hp,color){
  for(var loopCounter in object){
    if(typeof object[loopCounter] == 'object'){
      findPlayerAndReplaceStats(object[loopCounter],nick,x,y,hp,color);
    }
    if(object[loopCounter] == nick){ 
      object["x"] = x;
      object["y"] = y;
      object["hp"] = hp;
      object["color"] = color;
      ////console.log(Players);
      // break; // uncomment to stop after first replacement
    }
  }
}

function addPlayer(msg){
    var lastActionTime = new Date();
    var bonus = "n";
    var hpToSend = msg.hp;

    var lvlTempa = 1;
    var lvlTempb = 1;
    var lvlTempc = 1;

    if(msg.hitsa!=0){
         for(var getLvl = 1; getLvl<=100; getLvl++){
            //console.log(getLvl);
            //if((hits>(((50/3)*Math.pow(getLvl,3))-(100*Math.pow(getLvl,2))+((850/3)*getLvl)-200))&&(hits<(((50/3)*Math.pow((getLvl+1),3))-(100*Math.pow((getLvl+1),2))+((850/3)*((getLvl)+1))-200))){
            if((msg.hitsa>(((50/3)*Math.pow(getLvl,3))-(100*Math.pow(getLvl,2))+((850/3)*getLvl)-200))&&(msg.hitsa<(((50/3)*Math.pow((getLvl+1),3))-(100*Math.pow((getLvl+1),2))+((850/3)*(getLvl+1))-200))){
                lvlTempa=getLvl;
                break;
            }
        }
    }
    if(msg.hitsb!=0){
         for(var getLvl = 1; getLvl<=100; getLvl++){
            //console.log(getLvl);
            //if((hits>(((50/3)*Math.pow(getLvl,3))-(100*Math.pow(getLvl,2))+((850/3)*getLvl)-200))&&(hits<(((50/3)*Math.pow((getLvl+1),3))-(100*Math.pow((getLvl+1),2))+((850/3)*((getLvl)+1))-200))){
            if((msg.hitsb>(((50/3)*Math.pow(getLvl,3))-(100*Math.pow(getLvl,2))+((850/3)*getLvl)-200))&&(msg.hitsb<(((50/3)*Math.pow((getLvl+1),3))-(100*Math.pow((getLvl+1),2))+((850/3)*(getLvl+1))-200))){
                lvlTempb=getLvl;
                break;
            }
        }
    }
    if(msg.hitsc!=0){
         for(var getLvl = 1; getLvl<=100; getLvl++){
            //console.log(getLvl);
            //if((hits>(((50/3)*Math.pow(getLvl,3))-(100*Math.pow(getLvl,2))+((850/3)*getLvl)-200))&&(hits<(((50/3)*Math.pow((getLvl+1),3))-(100*Math.pow((getLvl+1),2))+((850/3)*((getLvl)+1))-200))){
            if((msg.hitsc>(((50/3)*Math.pow(getLvl,3))-(100*Math.pow(getLvl,2))+((850/3)*getLvl)-200))&&(msg.hitsc<(((50/3)*Math.pow((getLvl+1),3))-(100*Math.pow((getLvl+1),2))+((850/3)*(getLvl+1))-200))){
                lvlTempc=getLvl;
                break;
            }
        }
    }
    for(var k in Bonus){
        
        if(Math.abs(msg.x-Bonus[k].x)<=20&&Math.abs(msg.y-Bonus[k].y)<=20){
            bonus = Bonus[k].rodzaj;
            if(bonus==0){
                switch(msg.klasa){
                    case "a":
                        hpToSend = lvlTempa*100;
                    break;
                    case "b":
                        hpToSend = lvlTempb*100;
                    break;
                    case "c":
                        hpToSend = lvlTempc*100;
                    break;
                }
                
                //console.log("hp");
            }
        }
    }
    switch(msg.klasa){
        case "a":
            if(hpToSend>lvlTempa*100){
                hpToSend = lvlTempa*100;
            }
        break;
        case "b":
            if(hpToSend>lvlTempb*100){
                hpToSend = lvlTempb*100;
            }
        break;
        case "c":
            if(hpToSend>lvlTempc*100){
                hpToSend = lvlTempc*100;
            }
        break;
    }
    //Players[msg.nick] = {x: x, y: y, hp: hpToSend, lvl: lvlTemp, color: color, hits: hits, time: lastActionTime.getTime(), bonus: bonus, bonusToShow: bonusToShow, party: party};
    Players[msg.nick] = {
        nick: msg.nick, 
        x: msg.x, 
        y: msg.y, 
        hp: hpToSend, 
        lvla: lvlTempa,
        lvlb: lvlTempb, 
        lvlc: lvlTempc, 
        sta: msg.sta, 
        pda: msg.pda, 
        dea: msg.dea,
        r1a: msg.r1a, 
        a1a: msg.a1a, 
        r2a: msg.r2a, 
        a2a: msg.a2a, 
        r3a: msg.r3a, 
        a3a: msg.a3a, 
        stb: msg.stb, 
        pdb: msg.pdb, 
        deb: msg.deb,
        r1b: msg.r1b, 
        a1b: msg.a1b, 
        r2b: msg.r2b, 
        a2b: msg.a2b, 
        r3b: msg.r3b, 
        a3b: msg.a3b, 
        stc: msg.stc, 
        pdc: msg.pdc, 
        dec: msg.dec,
        r1c: msg.r1c, 
        a1c: msg.a1c, 
        r2c: msg.r2c, 
        a2c: msg.a2c, 
        r3c: msg.r3c, 
        a3c: msg.a3c, 
        klasa: msg.klasa,
        color: msg.color, 
        hitsa: msg.hitsa, 
        hitsb: msg.hitsb, 
        hitsc: msg.hitsc, 
        bonus: bonus,
        bonusToShow: msg.bonusToShow, 
        party: msg.party, 
        time: lastActionTime.getTime()};
        emitPlayers();
    
    
    ////console.log(Players);
};

function deletePlayer (nick){
    delete Players[nick];
}

function deleteCircle (id){
    delete Circles[id];
}
var Circles = {};
var prevR = 0;


function addCircle(nick,lvl,x,y,color,r,sila,ilosc,hp,xAtt,yAtt,typeAttack){
    if(hp>0){
        switch (typeAttack){
            case 1:
                for (var j = 0; j<=ilosc; j++){
                    var ktoreKolko = (ilosc-j);
                    if(ktoreKolko>0){
                        var rToSave = (r/ktoreKolko).toFixed();
                    }else{

                        var rToSave = r;
                    }
                    
                    var czasStartu = new Date();
                    var key = nick+""+ktoreKolko+czasStartu.getTime();

                    if(prevR == rToSave){
                        rToSave=rToSave-1;
                        if(rToSave<=0){
                            rToSave=rToSave+2;
                        }
                    }

                    var prevR = rToSave;
                    var czasWystartowania= czasStartu.getTime() + 200*j;
                    Circles[key] = {damage: lvl*sila, x: xAtt, y: yAtt, r: rToSave, color: color,czasStartu: czasWystartowania, nick: nick};
                }
            break;
            case 2:
                var prevX = x;
                var prevY = y;
                //oblicz srednia
                var startR = 0;
                for (var j = 1; j<ilosc; j++){
                    startR=startR+r/j;
                    //console.log(startR);
                }
                //console.log(startR);
                var rToSave = (startR/ilosc).toFixed();

                for (var j = 0; j<=ilosc; j++){
                    var ktoreKolko = (ilosc-j);
        
                    var czasStartu = new Date();
                    var key = nick+""+ktoreKolko+czasStartu.getTime();

                    //rToSave = ((rToSave + Math.round(Math.random()*(5)) - Math.round(Math.random()*(5))));
                    if(rToSave<=0){
                        rToSave=1;
                    }
                    var xToSend = prevX + ((xAtt-x)/ilosc);
                    var yToSend = prevY + ((yAtt-y)/ilosc);
                    prevX = xToSend;
                    prevY = yToSend;
                    var czasWystartowania= czasStartu.getTime() + 200*j;
                    Circles[key] = {damage: lvl*sila, x: xToSend, y: yToSend, r: rToSave, color: color,czasStartu: czasWystartowania, nick: nick};
                }
            break;
            case 3:
                var startR = 0;
                for (var j = 1; j<ilosc; j++){
                    startR=startR+r/j;
                    //console.log(startR);
                }
                //console.log(startR);
                var rToSave = (startR/ilosc/3).toFixed();
                if((x<xAtt&&y<yAtt)||(x>xAtt&&y>yAtt)){
                    var x2 = xAtt+startR*2;
                    var y2 = yAtt-startR*2;
                    var x3 = xAtt-startR*2;
                    var y3 = yAtt+startR*2;
                }else{
                    var x2 = xAtt-startR*2;
                    var y2 = yAtt-startR*2;
                    var x3 = xAtt+startR*2;
                    var y3 = yAtt+startR*2;
                }
                
                var prevX1 = x;
                var prevY1 = y;
                var prevX2 = x;//+rToSave;//+ Math.round(Math.random()*(3)) - Math.round(Math.random()*(3));
                var prevY2 = y;//-rToSave;//+ Math.round(Math.random()*(3)) - Math.round(Math.random()*(3));
                var prevX3 = x;//-rToSave;//+ Math.round(Math.random()*(3)) - Math.round(Math.random()*(3));
                var prevY3 = y;//+rToSave;//+ Math.round(Math.random()*(3)) - Math.round(Math.random()*(3));
                //oblicz srednia
                

                for (var j = 0; j<=ilosc; j=j+3){
                    var ktoreKolko = (ilosc-j);
        
                    var czasStartu = new Date();
                    var key = nick+""+ktoreKolko+czasStartu.getTime();
                    //var prevR = rToSave;
                    rToSave = ((rToSave + Math.round(Math.random()*(3)) - Math.round(Math.random()*(3))))/3;
                    //rToSave = prevR;
                    if(rToSave<=0){
                        rToSave=1;
                    }
                    var xToSend1 = prevX1 + ((xAtt-x)/ilosc);
                    var yToSend1 = prevY1 + ((yAtt-y)/ilosc);
                    prevX1 = xToSend1;
                    prevY1 = yToSend1;
                    var xToSend2 = prevX2 + ((x2-x)/ilosc);
                    var yToSend2 = prevY2 + ((y2-y)/ilosc);
                    prevX2 = xToSend2;
                    prevY2 = yToSend2;
                    var xToSend3 = prevX3 + ((x3-x)/ilosc);
                    var yToSend3 = prevY3 + ((y3-y)/ilosc);
                    prevX3 = xToSend3;
                    prevY3 = yToSend3;
                    var czasWystartowania= czasStartu.getTime() + 200*j;
                    Circles[key] = {damage: lvl*sila, x: xToSend1, y: yToSend1, r: rToSave, color: color,czasStartu: czasWystartowania, nick: nick};
                    Circles[key+"1"] = {damage: lvl*sila, x: xToSend2, y: yToSend2, r: rToSave, color: color,czasStartu: czasWystartowania, nick: nick};
                    Circles[key+"2"] = {damage: lvl*sila, x: xToSend3, y: yToSend3, r: rToSave, color: color,czasStartu: czasWystartowania, nick: nick};
                    //console.log(xToSend1,yToSend1,xToSend2,yToSend2, yToSend3, yToSend3);
                }
            break;
        }
        
    }
}

if (cluster.isMaster) {

    function upsertPlayerInDbOnConnect(player){
        var czyIstniejeWDb = new Boolean (false);
        var nickToUpsert = player.nick;
        var playerToEmit = {};
        //console.log(player, nickToUpsert);
        MongoClient.connect(url, function(err, db) {
            if (err) {
                        //console.log('1. Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = db.collection("players");
                collection.find().toArray(function(err, results) {
                    //console.dir(results);
                        // Let's close the db
                        
                    results.forEach(function(object) {
                            // console.dir(object["chain"][1]);
                            ////console.log(object);
                        if(object.nick==nickToUpsert){
                            //console.log(object);
                            czyIstniejeWDb=true;
                            var objectToSend = object;
                            switch(object.bonusToShow){
                                case 1:
                                    objectToSend.bonusToShow="n";
                                break;
                                case 3:
                                    objectToSend.sta = object.sta -10;
                                    objectToSend.stb = object.stb -10;
                                    objectToSend.stc = object.stc -10;
                                break;
                                case 4:
                                    objectToSend.r1a = object.r1a -10;
                                    objectToSend.r1b = object.r1b -10;
                                    objectToSend.r1c = object.r1c -10;
                                    objectToSend.r2a = object.r2a -10;
                                    objectToSend.r2b = object.r2b -10;
                                    objectToSend.r2c = object.r2c -10;
                                    objectToSend.r3a = object.r3a -10;
                                    objectToSend.r3b = object.r3b -10;
                                    objectToSend.r3c = object.r3c -10;
                                break;
                                case 5:
                                    objectToSend.a1a = object.a1a -10;
                                    objectToSend.a1b = object.a1b -10;
                                    objectToSend.a1c = object.a1c -10;
                                    objectToSend.a2a = object.a2a -10;
                                    objectToSend.a2b = object.a2b -10;
                                    objectToSend.a2c = object.a2c -10;
                                    objectToSend.a3a = object.a3a -10;
                                    objectToSend.a3b = object.a3b -10;
                                    objectToSend.a3c = object.a3c -10;
                                    emitPlayer();
                                break;
                                case 6:
                                    objectToSend.pda = object.pda -10;
                                    objectToSend.pdb = object.pdb -10;
                                    objectToSend.pdc = object.pdc -10;
                                break;
                                case 7:
                                    objectToSend.dea = object.dea -10;
                                    objectToSend.deb = object.deb -10;
                                    objectToSend.dec = object.dec -10;
                                break;
                            }
                            objectToSend.party="";
                            io.sockets.emit('newPlayerExisted', objectToSend);
                        }
                        //var toEmit = object;
                        
                    });
                    if(czyIstniejeWDb==false){
                        console.log("player doesn't exist");
                        playerToEmit = {
                            nick: player.nick, 
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
                            party: ""
                        };
                        io.sockets.emit('newPlayerExisted', playerToEmit);
                        updatePlayerDb(player);
                    }
                    db.close();
                });


    /*
                playerToEmit = collection.find({ "nick": nickToUpsert }, function(err, user) { 
                    if (user) { 
                        console.log("player exists");
                        czyIstniejeWDb = true;
                        //console.log(user);
                        //sendPlayerDataToClient();
                    } else { 
                        console.log("player doesn't exist");
                        playerToEmit = player;
                        updatePlayerDb(player);
                    }
                    db.close();
                });
              */  
                //if ((playerToEmit=={})||(playerToEmit=="")||(playerToEmit==undefined)) {
                   //updatePlayerDb(player);
                //}
                /*
                if(czyIstniejeWDb==false){
                    collection.update(
                        {nick: nickToUpsert},
                        player,
                        {upsert:true,safe:false},
                        function(err,data){
                            if (err){
                                console.log(err);
                            }else{
                                console.log("succeded");
                            }
                        }
                    );
                }else{
                    //wyslij do klienta dane gracza
                    io.sockets.emit('newPlayerExisted', playerToEmit);

                }
                */
                //Close connection
                //db.close();
            }
        });  
    }

    function updatePlayerDb(player){
        var nickToUpsert = player.nick;
        MongoClient.connect(url, function(err, db) {
            if (err) {
                        //console.log('1. Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = db.collection("players");
                //delete map._id;
                //map._id = new ObjectID.createFromHexString( map._id);
                collection.remove({ "nick" : nickToUpsert }, function(err, result) {
                    //callback(err);
                    db.close();
                });
            }
            //db.close();
        });  
        

        //console.log(nickToUpsert);
        //.remove([ { "key" : "name_key1" }, { "key" : "name_key2" }, { "key" : "name_key3" } )]
        MongoClient.connect(url, function(err, db) {
            if (err) {
                        //console.log('1. Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = db.collection("players");
                collection.findAndModify({nick: nickToUpsert}, {}, player, {upsert: true}, function(err, doc) {
                  if(err) { //throw err; 
                  }
                  // player updated or inserted
                  db.close();
                });
                /*
                collection.update({nick: nickToUpsert}, {$set: {
                    nick: player.nick,
                    x: player.x, 
                    y: player.y, 
                    hp: player.hp, 
                    lvla: player.lvla,
                    lvlb: player.lvlb, 
                    lvlc: player.lvlc, 
                    sta: player.sta, 
                    pda: player.pda, 
                    dea: player.dea,
                    r1a: player.r1a, 
                    a1a: player.a1a, 
                    r2a: player.r2a, 
                    a2a: player.a2a, 
                    r3a: player.r3a, 
                    a3a: player.a3a, 
                    stb: player.stb, 
                    pdb: player.pdb, 
                    deb: player.deb,
                    r1b: player.r1b, 
                    a1b: player.a1b, 
                    r2b: player.r2b, 
                    a2b: player.a2b, 
                    r3b: player.r3b, 
                    a3b: player.a3b, 
                    stc: player.stc, 
                    pdc: player.pdc, 
                    dec: player.dec,
                    r1c: player.r1c, 
                    a1c: player.a1c, 
                    r2c: player.r2c, 
                    a2c: player.a2c, 
                    r3c: player.r3c, 
                    a3c: player.a3c, 
                    klasa: player.klasa,
                    color: player.color, 
                    hitsa: player.hitsa, 
                    hitsb: player.hitsb, 
                    hitsc: player.hitsc, 
                    bonus: player.bonus,
                    bonusToShow: player.bonusToShow, 
                    party: player.party
                }}, function(err, updated) {
                  if( err || !updated ) console.log("User not updated");
                  else console.log("User updated");
                });
*/
                /*
                collection.save(
                    {nick: nickToUpsert},
                    player,
                    {upsert:true,safe:false},
                    function(err,data){
                        if (err){
                            console.log(err);
                        }else{
                            console.log("succeded");
                       }
                    }

                );
                */
                //Close connection
                 
            }

        });  
    }

    function updateVips(player,vip){
        var nickToUpsert = player;
        MongoClient.connect(url, function(err, db) {
            if (err) {
            } else {
                var collection = db.collection("vips");
                collection.remove({ "ownerList" : player }, function(err, result) {
                    db.close();
                });
            }
        });  
        MongoClient.connect(url, function(err, db) {
            if (err) {
            } else {
                var collection = db.collection("vips");
                collection.findAndModify({ownerList: nickToUpsert}, {}, {ownerList: nickToUpsert, vip: vip}, {upsert: true}, function(err, doc) {
                  if(err) { //throw err; 
                  }
                  db.close();
                });
            }
        });  
    }
    function getRecord(){
        var czyZnaleziono = new Boolean (false);
         MongoClient.connect(url, function(err, db) {
            if (err) {
                        //console.log('1. Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = db.collection("staty");
                collection.find().toArray(function(err, results) {
                    //console.dir(results);
                        // Let's close the db
                        
                    results.forEach(function(object) {
                            // console.dir(object["chain"][1]);
                            ////console.log(object);
                        if(object.stat=="record"){
                            czyZnaleziono=true;
                            rekord=object.record;
                        }
                        //var toEmit = object;
                        
                    });
                    db.close();
                });
            }
        }); 
         if(czyZnaleziono==false){
            rekord=0;
         }
    }

    function saveRecord(record){
        MongoClient.connect(url, function(err, db) {
            if (err) {
            } else {
                var collection = db.collection("staty");
                collection.remove({ "stat" : "record" }, function(err, result) {
                    db.close();
                });
            }
        });  
        MongoClient.connect(url, function(err, db) {
            if (err) {
            } else {
                var collection = db.collection("staty");
                collection.findAndModify({ "stat" : "record" }, {}, { "stat" : "record", "record" : record}, {upsert: true}, function(err, doc) {
                  if(err) { //throw err; 
                  }
                  db.close();
                });
            }
        });  
    }

    function sprawdzCzasAktywnosci(){
        for(var k in Players) {
            var currentTime = new Date();
            if((Players[k].time+100000)<currentTime.getTime()){
                deletePlayer(k);
                emitPlayers();
                //console.log(Players);
            }
        }
    }

    function zadajObrazenia(){
        for(var k in Circles) {
            var currentTime = new Date();
            if((Circles[k].czasStartu)<=currentTime.getTime()){
                if(Players[Circles[k].nick]!=null&&Players[Circles[k].nick]!=undefined){
                    io.sockets.emit('circleToSave', {r: Circles[k].r, x: Circles[k].x, y: Circles[k].y, color: Circles[k].color});
                    for(var m in Players) {
                        
                        if(((Math.pow((Players[m].x-Circles[k].x),2)+Math.pow((Players[m].y-Circles[k].y),2))<=Math.pow((Circles[k].r*10),2))&&(Circles[k].nick!=m)){
                               // console.log(Math.pow((Players[m].x-Circles[k].x),2),Math.pow((Players[m].y-Circles[k].y),2),Math.pow((Circles[k].r*10),2),Circles[k].nick,m);
                            var prevAmountHp = Players[m].hp;
                            var key = Circles[k].nick;
                            var lvl;
                            var lvlR;
                            var dexR;
                            switch(Players[key].klasa){
                                case "a":
                                    lvl=Players[key].lvla;
                                    str=Players[key].sta;
                                break;
                                case "b":
                                    lvl=Players[key].lvlb;
                                    str=Players[key].stb;
                                break;
                                case "c":
                                    lvl=Players[key].lvlc;
                                    str=Players[key].stc;
                                break;
                            }
                            switch(Players[m].klasa){
                                case "a":
                                    lvlR=Players[m].lvla;
                                    dexR=Players[m].dea;
                                break;
                                case "b":
                                    lvlR=Players[m].lvlb;
                                    dexR=Players[m].deb;
                                break;
                                case "c":
                                    lvlR=Players[m].lvlc;
                                    dexR=Players[m].dec;
                                break;
                            }
                            var wartoscBloku = lvlR*dexR;
                            var toDmg = Circles[k].damage + (Math.round(Math.random()*(10*lvlR))/wartoscBloku);
                                
                            if(toDmg<0){
                                toDmg=0;
                            }

                            if((Players[m].party!=Players[key].party)||(Players[m].party=="")){
                                Players[m].hp=Players[m].hp-toDmg;
                            }
                           

                            if(Players[m].hp<0){
                                Players[m].hp=0;
                                //process.send('emitPlayers');
                            }
                            if(prevAmountHp>0){
                                if((Players[m].party!=Players[key].party)||(Players[m].party=="")){
                                    emitDmg(Players[m].x,Players[m].y,toDmg);
                                    //Players[key].hits++;
                                    switch(Players[key].klasa){
                                        case "a":
                                            Players[key].hitsa++;
                                        break;
                                        case "b":
                                            Players[key].hitsb++;
                                        break;
                                        case "c":
                                            Players[key].hitsc++;
                                        break;
                                    }
                                }
                            }
                            emitPlayers();
                                //console.log(Circles[k].nick,m,key);
                        }

                        //console.log(Circles[k].nick,m);
                        //console.log(Players[m].x,Circles[k].x,Players[m].y,Circles[k].y,Circles[k].r,Circles[k].nick,m);
                        
                    }
                    deleteCircle(k);   
                }
                //console.log(Circles[k]);
                
            }
        }

    }
    function emitPlayers(){
        io.sockets.emit('players', Players);
        io.sockets.emit('parties', Parties);
    }

    function emitBonus(){
        io.sockets.emit('bonus', Bonus);
    }

    function emitDmg(x,y,dmg){
        io.sockets.emit('dmgToShow', {dmg: dmg, x: x, y: y});
    }

    function emitVipToClient(nick, id){
        //pobierz do vipToSend dane z DB
        var vipToSend = {};
        var czyIstniejeWDb = new Boolean (false);
        MongoClient.connect(url, function(err, db) {
            if (err) {
                        //console.log('1. Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = db.collection("vips");
                collection.find().toArray(function(err, results) {
                    //console.dir(results);
                        // Let's close the db
                        
                    results.forEach(function(object) {
                            // console.dir(object["chain"][1]);
                            ////console.log(object);
                        if(object.ownerList==nick){
                            
                            czyIstniejeWDb=true;
                            vipToSend = object.vip;
                            io.to(id).emit('vipsToSave', vipToSend);
                            //console.log(vipToSend);
                        }
                        //var toEmit = object;
                        
                    });
                    if(czyIstniejeWDb==false){
                        io.to(id).emit('vipsToSave', {});
                    }
                    db.close();
                });
            }
        });  
        
        
    }
    function emitPlayersToClient(id){
        //pobierz do vipToSend dane z DB
        var playersToSend = {};
        MongoClient.connect(url, function(err, db) {
            if (err) {
                        //console.log('1. Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = db.collection("players");
                collection.find().toArray(function(err, results) {
                    results.forEach(function(object) {
                            playersToSend[object.nick]= {
                                nick: object.nick, 
                                lvla: object.lvla,
                                lvlb: object.lvlb, 
                                lvlc: object.lvlc, 
                                color: object.color}; 
                    });
                    io.to(id).emit('playersFromDb', playersToSend);
                    db.close();
                });
            }
        });  
    }
    getRecord();
    mongoose.connect(configDB.url); 

	require('./config/passport')(passport); 

	app.configure(function() {
		app.use(express.cookieParser());
		app.use(express.bodyParser()); 

		app.use('/fonts',express.static(path.join(__dirname, 'fonts')));
		app.use(express.static(path.join(__dirname, 'public')));
		app.set('views', __dirname + '/views');

		app.engine('html', require('ejs').renderFile);
		app.use(express.session({ secret: 'mockup' })); 
		app.use(express.bodyParser({uploadDir:'/images'}));


		app.use(passport.initialize());
		app.use(passport.session()); 
		app.use(flash()); 
	});

	var io = require('socket.io')(server);
	require('./app/routes.js')(app, passport,server,io); 

	server.listen(port);
	console.log('Listening  to  port ' + port);

    io.on('connection', function(socket) {
        socket.on('newPlayer', function(msg) {
            //console.log('connected ' +socket.id);
            NickAndId[socket.id]=msg.nick;
            //console.log(msg);
            addPlayer(msg);
            upsertPlayerInDbOnConnect(msg);
            makeRandomBonus();
            emitBonus();
            emitVipToClient(msg.nick, socket.id);
        });
        socket.on('disconnect', function(){
            var key = NickAndId[socket.id];
            //console.log('disconnected ' + socket.id,NickAndId[socket.id]);
            //console.log(key, Players);
            if(Players[key]!=undefined){
                updatePlayerDb(Players[key]);
                deletePlayer(key);
            }
            delete NickAndId[socket.id];
        });
        socket.on('vipToSave', function(msg){
            vips[msg.nick]=msg.vip;
            //console.log(vips);
            updateVips(msg.nick, msg.vip);
        });
        socket.on('getPlayersFromDB', function(msg){
            emitPlayersToClient(socket.id);
        });
        
        socket.on('player', function(msg) {
            //console.log(msg.nick,Players[msg.nick]);
            if(Players[msg.nick]!=null||Players[msg.nick]!=undefined){
                
                //updatePlayerDb(msg);

                var tempHp = Players[msg.nick].hp;
                var tempHits = Players[msg.nick].hits;
                //var tempLvl = (tempHits/10).toFixed();
                deletePlayer(msg.nick);
                addPlayer(msg);
                
                //sprawdz czy cziter
//                var skillPoints = parseInt(parseInt(localPlayer.lvl-(localPlayer.r+localPlayer.ilosc+localPlayer.predkosc+localPlayer.sila))+parseInt(39));
/*
                if((msg.bonusToShow==3)||(msg.bonusToShow==4)||(msg.bonusToShow==5)||(msg.bonusToShow==6)){
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

            }else{
               // console.log("player didnt found");
                io.sockets.emit("warning", {nick: msg.nick});
            }
            
            ////console.log(Players);
            //findPlayerAndReplaceStats(Players,msg.nick,msg.x,msg.y,msg.hp,msg.color);
        });
        
		socket.on('playerToRememberPass', function(msg){
			//console.log(msg.email);
			var toSend ={};
			toSend["email"] = msg.email;
			MongoClient.connect(url, function(err, db) {
                if (err) {
                    //console.log('1. Unable to connect to the mongoDB server. Error:', err);
                } else {
                    //console.log('1. Connection established', url);
                    var collection = db.collection("passwordRequests");
                    if(toSend!=null&&toSend!=undefined){
                        collection.insert(toSend, function(err, result) {
                        if (err) {
                            //console.log(err);
                        } else {
                            //console.log('Inserted %d documents into the collection. The documents inserted with "_id" are:', result.length, result);
                        }
                        });
                    }else{
                        //console.log("null or undefined");
                    }
                    //Close connection
                    db.close();
                }
            });  
		});

        socket.on('circle', function(msg) {
            addCircle(msg.nick,msg.lvl,msg.x,msg.y,msg.color,msg.r,msg.sila,msg.ilosc,msg.hp,msg.xAtt,msg.yAtt,msg.typeAttack);
            //console.log(Circles);
            //findPlayerAndReplaceStats(Players,msg.nick,msg.x,msg.y,msg.hp,msg.color);
        });

        socket.on('deletePlayer', function(msg) {
            updatePlayerDb(msg);
            deletePlayer(msg.nick);
           // console.log(Players);
        });

        socket.on('joinToParty', function(msg) {
        	//var tempHp =Players[msg.nick].hp;
        	//var tempHits =Players[msg.nick].hits;
        	deletePlayer(msg.player.nick);
            addPlayer(msg.player);
        	for(var m in Invitations) {
        		if((Invitations[m].nick==msg.player.nick)&&(Invitations[m].party==msg.partyName)){
        			delete Invitations[m];
        			
        		}
            }
            io.sockets.emit("invitations", Invitations);
        });

        socket.on('dismissParty', function(msg) {
        	for(var m in Invitations) {
        		if((Invitations[m].nick==msg.player.nick)&&(Invitations[m].party==msg.partyName)){
        			delete Invitations[m];
        			
        		}
            }
            io.sockets.emit("invitations", Invitations);
        });

        socket.on('makeParty', function(msg) {
            //console.log(msg);
            var czyIstnieje = new Boolean (false);
            for(var k in Parties) {
                if (k==msg.partyName){
                    czyIstnieje=true;
                }
            }
            if(czyIstnieje==true){
                io.sockets.emit("partyExists", {partyName: msg.partyName, nick: msg.player.nick});
            }else{
                Parties[msg.partyName] = {color: msg.partyColor};
                //Players[msg.nick].party= msg.partyName;
                //console.log(Players[msg.player.nick].party);
                //var tempHp =Players[msg.player.nick].hp;
                //var tempHits =Players[msg.player.nick].hits;
                io.sockets.emit("partyDontExists", {partyName: msg.partyName, nick: msg.player.nick});
                //deletePlayer(msg.player.nick);
                //addPlayer(msg.player);
            }
        });

        socket.on('leaveParty', function(msg) {
        	//var tempHp =Players[msg.nick].hp;
        	//var tempHits =Players[msg.nick].hits;
        	deletePlayer(msg.nick);
            addPlayer(msg.player);
        });

        socket.on('inviteToParty', function(msg) {
        	var uniq = new Date();
            var key = uniq.getTime();
        	Invitations[key]={party: msg.partyName, nick: msg.nick};
        	io.sockets.emit("invitations", Invitations);
        });



        socket.on('checkNick', function(msg) {
            //console.log(msg);
            var iduniq = msg.iduniq;
            var isTaken = new Boolean(false);
            for(var m in Players) {
                if(m==msg.nick){
                    isTaken=true;
                    break;
                }
            }
            if(isTaken==false){
                io.sockets.emit("goodNick", {nick: msg.nick, iduniq: iduniq});
                //console.log("good",msg.iduniq,iduniq);
            }else{
                io.sockets.emit("badNick", {nick: msg.nick, iduniq: iduniq});
                //console.log("bad",msg.iduniq,iduniq);
            }
        });

        socket.on('chatMessage', function(msg) {
            //console.log(msg);
            var toSend ={};
            var nick = msg.nick;
            var messageToSend = msg.message;
            toSend["message"] = {nick: nick,message: messageToSend};
            /*
            switch (messageToSend.substring(0,1)){
                case "#":
                    var end = messageToSend.indexOf(",");
                    var party = messageToSend.substring(1,end);
                    //console.log("p", party);
                break;
                case "*":
                    var end = messageToSend.indexOf(",");
                    var nick = messageToSend.substring(1,end);
                    //console.log("n", nick);
                break;
            }
            */

            MongoClient.connect(url, function(err, db) {
                if (err) {
                    //console.log('1. Unable to connect to the mongoDB server. Error:', err);
                } else {
                    //console.log('1. Connection established', url);
                    var collection = db.collection("chat");
                    if(toSend!=null&&toSend!=undefined){
                        collection.insert(toSend, function(err, result) {
                        if (err) {
                            //console.log(err);
                        } else {
                            //console.log('Inserted %d documents into the collection. The documents inserted with "_id" are:', result.length, result);
                        }
                        });
                    }else{
                        //console.log("null or undefined");
                    }
                    //Close connection
                    db.close();
                }
            });   
        });
    });
	function sendChatMessagesAndStats (){
        var counterSend = 0;
        var counterMessages = 0;
        var toSend = new Array(100);
        MongoClient.connect(url, function(err, db) {
            if (err) {
                //    //console.log('getorders. Unable to connect to the mongoDB server. Error:', err);
            } else {
                //HURRAY!! We are connected. :)
                //    //console.log('getorders. Connection established to', url);
                // do some work here with the database.
                var messages = db.collection('chat');
                messages.find().toArray(function(err, results) {
                    //console.dir(results);
                    // Let's close the db
                    var ileJest = results.length;
                    results.forEach(function(object) {
                        // console.dir(object["chain"][1]);
                        ////console.log(object);
                        var toEmit = object["message"]["nick"] + " said: " + object["message"]["message"];
                        ////console.log(toEmit);
                        var ileDoKonca = ileJest - counterMessages;
                        if (ileDoKonca < 100) {
                            toSend[counterSend] = toEmit;
                            counterSend++;
                        }
                        counterMessages++;
                    });
                    //toSendChat = toSend;
                    //process.send('chatMessages');
                    //process.send({ cmd: 'chatMessages', data: toSend});
                    io.sockets.emit('chatMessages', {data: toSend});
                    db.close();
                });
                //Close connectection
            }
        });
        var length = 0;
        for(var m in Players) {
            length++;
        }
        if(length>rekord){
            rekord=length;
            saveRecord(rekord);
        }
        io.sockets.emit('stats', {odKiedyUp: odKiedyUp, playersAmount: length, rekord: rekord});
    }
    //setInterval(emitPlayers, 50);
    //setInterval(zapiszGraczyDoBazyDanych, 2000);
    setInterval(sendChatMessagesAndStats, 1000);
    setInterval(sprawdzCzasAktywnosci, 2000);
    setInterval(zadajObrazenia, 20);
    cluster.on('death', function(worker) {
        ////console.log('Worker ' + worker.pid + ' died.');
    });

    //WORKER
} else {


}