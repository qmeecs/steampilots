/**
 * Steam Pilots
 * moonsubmarine limited
 */

Crafty.sprite(180, 50, "assets/img/s_buttons.jpg",  {
    play:           [0,0],
    profile:        [0,1],
    credits:        [0,2],
    leaderboard:    [0,3],
    back:           [0,4],
    send:           [0,5],
    logout:         [0,6]
});

Crafty.sprite(100, "assets/img/gears.png",  {
    Gear01: [0,0],
    Gear02: [0,1],
});

Crafty.sprite(97,200, "assets/img/cloud.png",  {
    Cloud01: [0,0],
});

Crafty.sprite(150,100, "assets/img/airship_1.png",  {
    a1_dx: [0,0],
    a1_sx: [1,0]
});

Crafty.sprite(150,100, "assets/img/airship_2.png",  {
    a2_dx: [0,0],
    a2_sx: [1,0]
});

Crafty.sprite(150,100, "assets/img/airship_3.png",  {
    a3_dx: [0,0],
    a3_sx: [1,0]
});

Crafty.sprite(150,100, "assets/img/airship_4.png",  {
    a4_dx: [0,0],
    a4_sx: [1,0]
});

//fan sprites
Crafty.sprite(100,50, "assets/img/fan.png",  {
    fan: [0,0],
    fan1: [0,1],
    fan2: [0,2],
    fan3: [0,3]
});



Crafty.batchSprite("assets/img/main_sprite.png", {

b01: [492,229,70,223],

b02: [117,0,134,225],

b03: [499,0,42,223],

b04: [749,0,76,217],

b05: [637,0,62,221],

b06: [223,472,82,185],

b07: [307,499,164,219],

b08: [0,472,221,153],

b09: [701,0,46,219],

b10: [847,0,90,203],

b11: [543,0,92,221],

b12: [338,227,54,225],

b13: [394,229,96,227],

b14: [335,0,58,225],

b15: [680,479,142,189],

b16: [939,0,56,201],

b17: [253,0,80,225],

b18: [395,0,102,227],

b19: [0,312,223,158],

border01: [425,786,99,112],

bullet1: [225,450,30,10],

bullet2: [257,450,30,10],

bullet3: [338,478,30,10],

bullet4: [494,454,30,10],

c01: [307,227,29,270],

c02: [827,0,18,216],

door_golden_key: [0,777,50,188],

element01: [260,260,27,30],

enemy01: [52,919,130,60],

enemy02: [766,376,135,74],

enemy3: [716,221,120,153],

esplosione: [218,743,150,110],

gear_assembly: [473,640,152,144],

gear_assembly2: [52,777,130,140],

gear_blue: [670,383,94,94],

gear_blue2: [225,366,59,58],

gear_brown: [627,670,121,121],

gear_cyan: [564,383,104,104],

gear_pink: [225,301,63,63],

gear_red: [219,260,39,39],

gear_red2: [314,855,54,54],

gear_yellow: [184,855,128,127],

gear_yellow2: [218,659,81,82],

key_gold: [117,260,100,43],

key_gold_m: [338,454,50,22],

key_silver: [903,370,100,43],

key_silver_m: [225,426,50,22],

pole: [0,0,115,310],

shield01: [564,223,150,158],

shield02: [838,218,160,150],

shield03: [0,627,216,148],

shield04: [473,492,205,146],

spikes: [390,458,102,32],

wall_01: [117,227,188,31],

wall_01_silver: [370,720,53,188],

wall_02: [0,981,122,22],

wall_03: [766,452,156,23]

});

/*
Crafty.audio.add("jump", "assets/sound/jump.mp3");
Crafty.audio.add("coin", "assets/sound/coin.mp3");
Crafty.audio.add("kick", "assets/sound/kick.mp3");
Crafty.audio.add("stun", "assets/sound/stun.mp3");
Crafty.audio.add("wins", "assets/sound/wins.mp3");
Crafty.audio.add("spring", "assets/sound/spring.mp3");
*/

/*soundManager.setup({
    preferFlash: true,
    flashVersion: 9,
    url: 'soundmanager/swf/',
    useHighPerformance: true,
    wmode: 'transparent',
    debugMode: false
});

soundManager.onready(function(){
    soundManager.createSound({
        id:'boss',
        url:'assets/sound/boss-loop.mp3',
        multiShot: true,
        autoLoad: true,
        loops: 100,
        volume: 40
    });
    soundManager.createSound({
        id:'dead',
        url:'assets/sound/dead.mp3',
        autoLoad: true,
        volume: 40
    });
    soundManager.createSound({
        id:'game_over',
        url:'assets/sound/game_over.mp3',
        autoLoad: true,
        volume: 40
    });
});

function soundPlay(sound){
    soundManager.onready(function() {
        soundManager.play(sound);
    });
}

function soundStop(sound){
    soundManager.onready(function() {
        soundManager.stop(sound);
    });
}*/