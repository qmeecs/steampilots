/**
 * Steam Pilots
 * moonsubmarine limited
 */
/**
 * Cursor
 * this component when applied will give the entity the Hand Cursor 
 * the button sound when tapped
 */
Crafty.c("Cursor", {
    init: function() {
        this.css({"cursor": "pointer"})
        .bind("Click", function( callback ) {
            Crafty.audio.play("button",1,1);
        });
    }
});
/**
 * Highlighter
 * this component highlights the entity
 * ensize = enlarge the entity
 * unsize = return the entity to its former dimensione
 */
Crafty.c("Airship_intro", {
   
    selectMe: function() {
        this.oldx=this.x;
        this.oldy=this.y;
        if( this.has("Tween")==false ) this.addComponent("Tween");
        this.tween({x:400-this.w/2,y:350},50);
    },
    unSelectMe: function() {
        if( isNaN(this.oldx) ) return;
        if( this.has("Tween")==false ) this.addComponent("Tween");
        this.tween({x:this.oldx,y:this.oldy},50);
    }   

});

/**
 * Mover
 * this component will give the 4way component
 */
 Crafty.c("Ship", {

    init: function() {
        this.xdir = 1;
        this.falling=true;
        this.raising=false;
        this.heavy=false;
        this.requires("Multiway, Collision, Delay, Keyboard, PlayerShip");
        this.collision( [21,39], [40,24], [61,18], [87,18], [108,24], [130,39], [108,57], [87,71], [61,71], [54,60], [34,51], [40,24] );
        //adding sprite
        this.addComponent(player.ship + "_dx");
        this.animate("right",0,0,4);
        this.animate("left",5,0,-4);

        if( player.ship == 'a2' || player.ship == 'a4' ) {
            player.immune = true;
            player.shield = Crafty.e("2D,DOM,Tween,Delay,Blink, SpriteAnimation").origin(0,0);
            if(player.ship=='a2') player.shield.addComponent("shield02").attr({x:airship_start_x-10 ,y:airship_start_y-30 ,_z:2001});
            if(player.ship=='a4') player.shield.addComponent("shield04").attr({x:airship_start_x-30 ,y:airship_start_y-20 ,_z:2001});
        }

        //gravity
        this.bind("EnterFrame", function() { 
            if(this.falling && !player.inReset) this.y++;                                          //applying gravity
            if(this.raising && this.hit("Top")==false && !player.inReset) this.y-=2;               //applying float
            if(this.heavy && this.hit("Bottom")==false && !player.inReset) this.y+=3;
            this.falling = !this.hit("Bottom");                                 //if the ship is not touching a border i set the moving var as true.
            this.raising = this.hit("AntiGravity");
            this.heavy = this.hit("Heavy")
        } );
        //boundary
        this.onHit("Bottom", function() {  
            this.falling=false;
        } );
        //fan
        this.onHit("AntiGravity", function() {  
            this.falling=false;
            this.raising=true;
        } );
        this.onHit("Mortal", function() {
            if(!player.inReset && !player.immune) {
                player.inReset = true;
                this.blink();
                this.addComponent("esplosione");
                Crafty.trigger("lost_a_ship");
            }
            if(player.shield!=undefined && player.immune) {
                //manage the shield delay
                player.shield.requires("Blink");
                player.shield.startBlinking();
                player.shield.delay( function() { this.alpha=0; player.immune = false; },1000 );
                player.shield.delay( function() { this.alpha=1;player.shield.stopBlinking(); player.immune = true; },5000 );
            }
        } );
        //keys hit
        this.onHit("GoldenKey", function() {
            //assigning the key to the player obj
            player.golden_key = true;
            //removing the sprite
            golden_key_sprite.destroy();
            //set alpha in the UI
            Engine.UI.alphaElement("gold_key",1.0);
            //removing the final gate
            final_gate.destroy();
        });
        this.onHit("SilverKey", function() {
            //assigning the key to the palyer obj
            player.silver_key = true;
            //removing the sprite
            silver_key_sprite.destroy();
            //remove the gate
            golden_gate.destroy();
            //set alpha in the UI
            Engine.UI.alphaElement("silver_key",1.0);
        });
        //time bonus
        this.onHit("Time_bonus", function(e) {
            e[0].obj.destroy();
            Engine.time+=10;
        });
        //portal
        this.onHit("Portal", function() {
            if( player.golden_key==true ) {
                //recording the time not used in seconds
                player.total_time += Engine.time;
                Crafty.scene("Portal");
            }
        });
        //key binding
        if(Engine.util.shipCanShoot()) {
            this.bind("KeyDown", function() {
                if(this.isDown('SPACE')) {
                    if(!this.cooldown) {
                        this.cooldown = true;
                        var parent = this;
                        var b = Crafty.e("2D,DOM,Collision,Delay,bullet3")
                        .attr({x:(parent.x+parent.w/2), y:parent.y + parent.h/2 + 5, w:30, h:10, _z:1900, dir: parent.xdir})
                        .bind("EnterFrame",function() {
                            this.x+=(bulletSpeed*this.dir);
                        })
                        .onHit("Border", function() {
                            this.destroy();
                        });
                        b.addComponent("Bullet");
                        b.delay(function() { this.destroy() },5000);
                        if(b.dir>0) b.flip("X");
                        scene_elements.push(b);
                        this.delay(function() { this.cooldown = false; },500);
                    }
                }
            });
        }

        //multyway
        this.multiway(Engine.util.speedByType(), {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
        //changing the sprite 
        this.bind("NewDirection", function(direction) {

            if(direction.x<0 && this.xdir == 1) {
                this.animate("right",10,0);
                this.xdir = -1;
            }
            if(direction.x>0 && this.xdir == -1) {
                this.animate("left",10,0);
                this.xdir = 1;
            }


        });
        //stop when hitting an hurdles
        this.bind("Moved", function(from) {
            if( player.inReset==true ) {
                this.x = from.x;
                this.y = from.y;
            }
            if( this.hit('Border') ) {
                this.attr( { x: from.x , y: from.y } );
            }
        });


    },
    getTile: function() {
        return  parseInt(Math.ceil(this.x / sceneWidth));
    },
    blink: function() {
        this.requires("Blink");
        this.startBlinking();
        this.timeout( function() { this.stopBlinking(); }, 2000 );
    }

 });

/**
 * Notificator
 * this component will create a text in the middle of the screen that will disappear in 3 seconds with fade.
 */
 Crafty.c("EnemyShip", {

    init: function() { 
        this.requires("Collision, Repeater, Mortal");

        this.onHit("Border", function() {
            if(this.start!=0) {
                this.attr({x:this.start});
                this.start=0;
            } else {
                this.destroy();
            }
        });
        
        this.repeat(function() {
            if( Crafty.math.randomInt(0,100)<90 && player.level>3 ) {
                //bullet
                var parent = this;
                var b = Crafty.e("2D,DOM,Collision,Mortal,bullet1")
                .attr({x:parent.x, y:parent.y + parent.h/2 + 5, w:30, h:10, _z:700})
                .bind("EnterFrame",function() {
                    this.x-=bulletSpeed;
                })
                .onHit("Border", function() {
                    this.destroy();
                })
                .onHit("Bullet", function() {
                    this.destroy();
                });
                scene_elements.push(b);
            }
        },2000,-1);
        
        return this;
    },

    setVelocity: function(vel) {
        this.bind("EnterFrame", function() {
            this.x-=vel;
        })
        return this;
    }


});


/**
 * Notificator
 * this component will create a text in the middle of the screen that will disappear in 3 seconds with fade.
 */
 Crafty.c("Notificator", {

    init: function() {
        this.requires("Text");
    },

    show: function() {

    }

 });


/**
 * Renderer
 * this component will create the game world based on the position of the airship.
 */
 Crafty.c("Renderer", {

    init: function() {

        this.xdir=1;

        this.renderedTile=0;
        this.renderedHardles=0;
        this.bind("Move", function(from) {
            if (this._x == from._x) return;
            if ( Crafty.math.abs(Crafty.viewport.x) > parallax01.x) {
                parallax01.x -= this.xdir*0.2;
            }
            if(this.renderedTile<this.getTile()) {
                this.render( this.getTile() );
                this.renderedTile++;
            }
            if(this.renderedHardles<this.getTile()) {
                this.renderHardles( this.getTile() );
                this.renderedHardles++;
            }
        });
        //adding the final door
        Crafty.e("2D,DOM,SpriteAnimation,wall_01,Border").attr({ x:Engine.util.lengthByLevel(player.level)-30, y:0 ,rotation:90, _z:201 });
        final_gate = Crafty.e("2D,DOM,SpriteAnimation,door_golden_key,Border").attr({ x:Engine.util.lengthByLevel(player.level)-68, y:188, _z:202 });
        Crafty.e("2D,DOM,SpriteAnimation,wall_01,Border").attr({ x:Engine.util.lengthByLevel(player.level)-30, y:376 ,rotation:90, _z:200 });
        //final level area
        Crafty.e("2D,DOM,Color,Portal").attr({x:Engine.util.lengthByLevel(player.level)-80,y:0,h:600,w:10});

    },
    render: function(tile) {
        //basic buildings skyline
        var skyline_x=0;
        var tile_starting_x = tile * sceneWidth; 
        while(skyline_x < sceneWidth) {
            //creating building
            var sprite = this.B();
            var thisBulding = Crafty.e("2D,DOM,SpriteAnimation").attr({x: tile_starting_x + skyline_x,y:500, _z:2})
            .addComponent(sprite);
            if(sprite=="fan" && tile!=level_data.golden_key && tile!=level_data.silver_key) {
                if( Crafty.math.randomInt(0,100)>50 && player.level>=3 ) {
                    thisBulding.addComponent("Flip");
                    thisBulding.attr({y:45}).flipY(true);
                    //create collider
                    Crafty.e("2D, DOM, Color, Heavy").attr({x:thisBulding.x,y:0,w:thisBulding.w,h:600}).color('rgba(0,0,255,0)');
                    //adding spikes
                    Crafty.e("2D, DOM, spikes, Mortal, Flip").attr({x:thisBulding.x,y:470}).flipY(true);
                } else {
                    //create collider
                    Crafty.e("2D, DOM, Color, AntiGravity").attr({x:thisBulding.x,y:0,w:thisBulding.w,h:600}).color('rgba(0,0,255,0)');
                    //adding spikes
                    Crafty.e("2D, DOM, spikes, Mortal").attr({x:thisBulding.x,y:0});
                }
                thisBulding.animate("spin",0,0,3);
                thisBulding.animate("spin",3,-1);
            }

            //incrementing the variable
            skyline_x += thisBulding.w;
            //fixing the y accordingly to the h of the entity
            thisBulding.y -= thisBulding.h;
            //remove the building if is over the limit
            if( thisBulding.x + thisBulding.w > Engine.util.lengthByLevel(player.level) ) thisBulding.destroy()

        } 
        //key positioning*************************************************************************************
        if(tile == level_data.golden_key) { //golden key
            var holder1 = Crafty.e("2D,DOM,wall_01,Border,Collision").attr({x:tile_starting_x+100,y:-30,rotation:90});
            var holder2 = Crafty.e("2D,DOM,wall_01,Border, Bottom,Collision").attr({x:tile_starting_x+70,y:125});
            //key
            golden_key_sprite = Crafty.e("2D, DOM, key_gold, GoldenKey").attr({x:holder1.x + 10, y:40});
            //golden gate
            golden_gate = Crafty.e("2D,DOM,wall_01_silver,Border,Collision").attr({x:tile_starting_x+215,y:-30});

        }
        if(tile == level_data.silver_key) { //silver key
            var holder3 = Crafty.e("2D,DOM,wall_02,Border,Collision").attr({x:tile_starting_x+100,y:0,rotation:90});
            var holder4 = Crafty.e("2D,DOM,wall_02,Border, Bottom, Collision").attr({x:tile_starting_x+80,y:120});
            //key
            silver_key_sprite = Crafty.e("2D, DOM, key_silver, SilverKey").attr({x:holder3.x + 10, y:30});
        }
        //key positioning*************************************************************************************

        //Bonus positioning**************************
        if(tile!=level_data.golden_key && tile!=level_data.silver_key) {
            var rnd = Crafty.math.randomInt(0,100);
            if( rnd>0 && rnd <30 ) {
                var time = Crafty.e("2D, DOM, SpriteAnimation, Time_bonus, Image, Collision").image("assets/img/time.png").attr({x:tile_starting_x+100,y:100})
                    .collision([0,0],[50,0],[50,50],[0,50])
                    .bind("EnterFrame", function() {
                        this.y -= 0.1;
                    });
            } else if ( rnd>30 && rnd<40 ) {
                var bomb = Crafty.e("2D, DOM, Mortal, Image, Collision").image("assets/img/bomb.png").attr({x:tile_starting_x+100,y:50})
                    .collision([0,0],[50,0],[40,101],[11,101])
                    .bind("EnterFrame", function() {
                        this.y += 0.1;
                    });
            }
        }
        //Bonus positioning**************************

    },
    renderHardles: function(tile) {
        //get the level OBJ
        var lvl = levels(player.level - 1);
        var elements = lvl["tile"+tile];
        //enemies and hurdles********************************************************************************
        for(var elem in elements) {
            //generate the position within the tile
            // first i calculate the starting x of the tile , after that i add a random number from 0 to sceneWidth (800px)
            var thisEntity = this[elements[elem]](tile);
            //adding to scene elements
            scene_elements.push(thisEntity);
        }
    },
    B: function() {
            var sprite = B[ Math.floor(Math.random()*B.length) ]; 
            return sprite;
    },
    E: function(tile) {
            var _x = sceneWidth * tile + sceneWidth * Math.random();
            var _y = Crafty.math.randomInt(50,450);
            var sprite = Crafty.math.randomElementOfArray(H);
            var thisEntity = Crafty.e("2D, DOM, Collision, EnemyShip, SpriteAnimation").attr({x:_x, y:_y, _z:400, start:_x}).setVelocity(3)
            .onHit("Bullet", function() {
                //adding points to player
                player.addScore(100);
                player.killed++;
                this.destroy();
            });
            thisEntity.addComponent("Mortal");
            thisEntity.addComponent(sprite);
            return thisEntity;
    },
    H: function(tile) {
        
        var luckyNumber = Crafty.math.randomInt(0,100);
        if(luckyNumber<100) {       //spinning gear
            var _x = sceneWidth * tile + sceneWidth * Math.random();
            var _y = 100;
            var thisEntity = Crafty.e("2D,DOM,Mortal, SpriteAnimation, Collision, gear_yellow").attr({x:_x, y:_y, direction: 1, _z:501})
            .origin("center")
            .bind("EnterFrame", function() {
                this.y += this.direction*3;
                this.rotation += 3;
                if(this.rotation>360) this.rotation=0;
            })
            .onHit("Border", function() {
                this.y -= this.direction*10;
                this.direction = this.direction * -1;
            })
            ;
            return thisEntity;
        }

    }

 });


/**
 * Blink
 * this components make the entity blink
 */
Crafty.c('Blink',
{
    init: function()
    {
      this
          .attr({blinkRate: 5, blinkActive: false})
          .bind('EnterFrame', function()
          {
              if (this.blinkActive && (Crafty.frame() % this.blinkRate === 0) )
              {
                  //toggling the visibility is what gives
                  //the bliniking effect
                  this.visible = !this.visible;
              }
          });
    },
    //some functions for easier control:
    startBlinking: function()
    {
        this.blinkActive = true;
        return this;
    },
    stopBlinking: function()
    {
        this.blinkActive = false;
        this.visible = true;        
        return this;
    }
});

Crafty.c("Fader",{

    fade: function()
    {
        this.requires("Delay,Tween");
        this.delay(
            function() {
                this.tween({alpha:0,y:this.y-100},50)
            },2000);
        this.delay( 
            function() { 
                this.destroy();
            },2500 );
        return this;
    }

});



/**
 * Real delay component
 */
Crafty.c("Repeater", {
    init : function() {
        this._realDelays = [];
        this.bind("EnterFrame", function() {
            var now = new Date().getTime();
            for(var index in this._realDelays) {
                var item = this._realDelays[index];
                if(!item.triggered && item.start + item.delay + item.pause < now) {
                    item.triggered=true;
                    item.func.call(this);
                    if( item.rep==-1 || item.rep>0 || item.cleared!=true ) {
                        if( item.rep > 0 ) item.rep--;

                        this._realDelays.push({
                            start : new Date().getTime(),
                            func : item.func,
                            rep : item.rep,
                            delay : item.delay,
                            triggered : false,
                            pauseBuffer: 0,
                            pause: 0
                        });
                    }
                    //remove if cleared
                    if(item.cleared == true) this._realDelays=null;
                }
            }
        });
        this.bind("Pause", function() {
            var now = new Date().getTime();
            for(var index in this._realDelays) {
                var item = this._realDelays[index];
                item.pauseBuffer = now;
            }
        });
        this.bind("Unpause", function() {
            var now = new Date().getTime();
            for(var index in this._realDelays) {
                var item = this._realDelays[index];
                item.pause += now-item.pauseBuffer;
            }
        });
    },
    /**@
     * Set a new repeater.
     * @param func the callback function
     * @param delay the delay in ms
     * @param repeat the number of repetition, -1 for infinite loop
     */
    repeat : function(func, delay, repeat) {
        return this._realDelays.push({
            start : new Date().getTime(),
            func : func,
            rep : repeat,
            delay : delay,
            triggered : false,
            pauseBuffer: 0,
            pause: 0,
            cleared: false
        });
    },
    stopRepeating : function() {
        for(var index in this._realDelays) {
            var item = this._realDelays[index];
            item.cleared = true;
        }
    }
});



/**
 * Text Styler
 */
 Crafty.c("TextStyler", {

    init: function() {},
    GameOverText: function() {
        this.css({"font-famyly":"Georgia"});
        this.css({"font-size":"20px"});
        this.css({"color":"#FFFFFF"});
        return this;
    },
    StatsText: function() {
        this.css({"font-famyly":"Georgia"});
        this.css({"font-size":"20px"});
        this.css({"color":"#FF0"});
        return this;
    },
    TotalText: function() {
        this.css({"font-size":"40px"});
        this.css({"font-famyly":"Georgia"});
        this.css({"color":"#F00"});
        return this;
    },
    renderAsClass: function(_class) {
        this.text("<div class='"+_class+"'>"+this.text()+"</div>");
        return this;
    }

 });






























//********************************************************************

Crafty.c("Flip", {
    init: function() {
        this.requires("2D");
    },
    flipX: function(flipped) {
        this["_flipX"] = flipped;
        this.trigger("Changed");
    },
    flipY: function(flipped) {
        this["_flipY"] = flipped;
        this.trigger("Changed");
    }
});

Crafty.c("MovePlayer", {
    _speed: 3,
    _up: false,
    init: function () {
        this.requires("Fourway, Keyboard");
    },
    move: function (speed, jump) {
        this.multiway(speed, {
            RIGHT_ARROW: 0, 
            LEFT_ARROW: 180
        });
        if (speed) this._speed = speed;
        jump = jump || this._speed * 2;
        this.bind("EnterFrame", function () {
            if (this.disableControls) return;
            if (mario.spring) jump = 12;
            if (koopa.reached) jump = 5;
            if (this._up) {
                this.y -= jump;
                this._falling = true;
                mario.spring = false;
            }
        }).bind("KeyDown", function () {
            if (this.isDown("UP_ARROW")){
                if (!mario.spring) jump = 5;
                this._up = true;
            }
        });
        return this;
    }
});

Crafty.c("Tela", {
    init: function(){
        this.requires("2D, Canvas, Tween");
        this.attr({gameOver:false,timeGameOver:0,infos:{life:$('.life'), score:$('.score')}});
        this.bind("EnterFrame", function(){
            var life = " x "+mario.life;
            var score = mario.points+" x";
            
            if(mario.life >= 0){
                if(life != this.infos.life.html())
                    this.infos.life.html(life);

                if(score != this.infos.score.html())
                    this.infos.score.html(score);

                if(mario.points >= 10 && koopa.speedPlayer == 1){
                    spring = Crafty.e("Items").attr({x: 650, y: 0, z:0, w: 20, h: 20, animation: "spring"});
                    koopa.speedPlayer = 1.5;
                    koopa.totalEnemies = 3;
                }

                if(mario.points >= 20 && koopa.speedPlayer == 1.5){
                    spring = Crafty.e("Items").attr({x: 650, y: 0, z:0, w: 20, h: 20, animation: "spring"});
                    koopa.speedPlayer = 2;
                    koopa.totalEnemies = 4;
                }

                if(mario.points >= 30 && koopa.speedPlayer == 2){
                    koopa.speedPlayer = 2.5;
                    koopa.totalEnemies = 5;
                }
                
                if(mario.points >= 35 && koopa.speedPlayer == 2.5){
                    spring = Crafty.e("Items").attr({x: 650, y: 0, z:0, w: 20, h: 20, animation: "spring"});
                    koopa.speedPlayer = 2.7;
                }
            }
            
            if(this.gameOver){
                koopa.tween({alpha: 0.0}, 50);
                if(this.timeGameOver++ >= 300) Crafty.scene("GameOver");
                if(this.timeGameOver == 1){
                    soundPlay("dead");
                    soundStop("boss");
                }
            }
            
            if(koopa.dead){
                $("#interface").hide();
                setTimeout(function () { Crafty.scene("Credits"); }, 7000);
            }
        });
    }
});

Crafty.c("Mario", {
    init: function(){
        this.requires("2D, Canvas, Keyboard, SpriteAnimation, Collision, Gravity, Flip, SpriteMario, MovePlayer");
        this.attr({
            speedPlayer:2, 
            timeFalling:0, 
            jumper:false,
            spring:false,
            points:0,
            life:3
        });
        this.gravity("Floor").gravityConst(0.3);
        this.origin(0,33);
        this.move(this.speedPlayer,5);
        this.animate("wins", 0, 1, 0);
        this.animate("idle", 0, 0, 0);
        this.animate("walk", 0, 0, 3);
        this.animate("down", 1, 1, 1);
        this.animate("jump_up", 2, 1, 2);
        this.animate("jump_down", 3, 1, 3);
        this.bind("EnterFrame", function(e) {
            if(!koopa.dead){
                if(this.isDown(Crafty.keys.UP_ARROW)){
                    if(!this.jumper && this._falling) Crafty.audio.play("jump",1,0.5);
                    this.jumper = true;
                }

                if(this._falling){
                    if(this.timeFalling++ <= 20 && this.jumper) this.animate("jump_up", 20, -1);
                    else this.animate("jump_down", 20, -1);
                }else{
                    if(this.isDown(Crafty.keys.DOWN_ARROW)){
                        this.animate("down", 20, -1);
                        if(this.isDown("LEFT_ARROW"))
                            this.x += this.speedPlayer;

                        if(this.isDown("RIGHT_ARROW"))
                            this.x -= this.speedPlayer;
                    }else{
                        if(this.isDown(Crafty.keys.RIGHT_ARROW)){
                            this.animate("walk", 20, -1);
                            this.flipX(false);
                        }else if(this.isDown(Crafty.keys.LEFT_ARROW)){
                            this.animate("walk", 20, -1);
                            this.flipX(true);
                        }else
                            this.animate("idle", 20, 0);
                    }

                    this.jumper = false;
                    this.timeFalling = 0;
                }
            }else{
                this.disableControls = true;
                this.animate("wins", 20, -1);
            }
        });
        this.collision([7,4], [7,32], [22,32], [22,4]);
        this.onHit("Wall", function() {
            this.stop();
            if(this.isDown("LEFT_ARROW"))
                this.x += this.speedPlayer;
            if(this.isDown("RIGHT_ARROW"))
                this.x -= this.speedPlayer;
        });
        this.bind("KeyUp", function(e) {
            this.stop();
        });
    },
    remove: function(){
        this.destroy();
    }
});


Crafty.c("Koopa", {
    init: function(){
        this.requires("2D, Canvas, Keyboard, SpriteAnimation, Flip, Tween, Collision, SpriteKoopa");
        this.attr({
            speedPlayer: 1, 
            clockwise: true,
            countEnemies: 0,
            totalEnemies: 2,
            timeCreateEnemy: 100,
            timeReached:0,
            reached: false,
            dead:false,
            life:3
        });
        this.animate("move", 0, 0, 2);
        this.animate("reached", 0, 1, 1);
        this.bind("EnterFrame", function(e) {
            if(!this.reached){
                this.animate("move", 20, 0);
                if(this.clockwise){
                    if(this.x <= 550) this.x += this.speedPlayer;
                    else this.clockwise = false;
                    this.flipX(false);
                }else{
                    if(this.x >= 80) this.x -= this.speedPlayer;  
                    else this.clockwise = true;
                    this.flipX(true);
                }

                if(!tela.gameOver){
                    if(this.timeCreateEnemy++ >= 100){
                        this.timeCreateEnemy = 0;
                        if(this.countEnemies < this.totalEnemies){
                            this.countEnemies++;
                            switch(Math.floor((Math.random()*3)+1)){
                                case 0: Crafty.e("Enemy").attr({x: this.x, y: 100, z:0, w: 30, h: 30, animation: "blueEnemy", clockwise: this.clockwise}); break;
                                case 1: Crafty.e("Enemy").attr({x: this.x, y: 100, z:0, w: 30, h: 30, animation: "greenEnemy", clockwise: this.clockwise}); break;
                                case 2: Crafty.e("Enemy").attr({x: this.x, y: 100, z:0, w: 30, h: 30, animation: "greenEvilEnemy", clockwise: this.clockwise}); break;
                                default: Crafty.e("Enemy").attr({x: this.x, y: 100, z:0, w: 30, h: 30, animation: "blueEnemy", clockwise: this.clockwise}); break;
                            }
                        }
                    }
                }
            }else{
                this.animate("reached", 5, 0);
                if(this.life <= 0){
                    if(this.timeReached++ >= 200){
                        this.dead = true;
                        this.remove();
                    }
                }else{
                    if(this.timeReached++ >= 100){
                        this.timeReached = 0;
                        this.reached = false;
                    }
                }
            }
        });
        this.collision();
        this.onHit("Mario", function(e) {
            if(!this.reached){
                var distance = (this.y - mario.y);
                if((distance >= 10)){
                    spring.destroy();
                    Crafty.audio.play("kick",1,0.5);
                    mario._up = true;
                    mario._falling = false;
                    this.reached = true;
                    this.life--;
                }
            }
        });
    },
    remove: function(){
        soundStop("boss");
        Crafty.audio.play("wins",1,0.5);
        this.destroy();
    }
});

Crafty.c("Enemy", {
    init: function(){
        this.requires("2D, Canvas, Keyboard, SpriteAnimation, Collision, Gravity, Flip, Tween, SpriteEnemy");
        this.attr({
            speedPlayer: 0.5, 
            clockwise: true,
            animation: "blueEnemy",
            timeDead:10,
            life:10
        });
        this.gravity("Floor").gravityConst(0.3);
        this.origin(0,33);
        this.animate("blueEnemy", 0, 1, 2);
        this.animate("greenEnemy", 0, 2, 2);
        this.animate("greenEvilEnemy", 0, 3, 2);
        this.bind("EnterFrame", function(e) {
            if(koopa.dead) this.remove();
            if(tela.gameOver) this.tween({alpha: 0.0}, 50);
            this.animate(this.animation, 20, 0);
            
            if(this.clockwise){
                this.x += this.speedPlayer; 
                this.flipX(false);
            }else{
                this.x -= this.speedPlayer;
                this.flipX(true);
            }
        });
        this.collision([5,5],[25,5],[25,25],[5,25]);
        this.onHit("Wall", function() {
            if(this.clockwise) this.clockwise = false;
            else this.clockwise = true;
                
        });
        this.onHit("Mario", function(e) {
            var distance = (this.y - mario.y);
            
            if((distance >= 10)){
                Crafty.audio.play("kick",1,0.5);
                mario._up = true;
                mario._falling = false;
                this.remove();
            }else{
                Crafty.audio.play("stun",1,0.5);
                mario.life--;
                if(mario.life >= 0){
                    mario.x = 10;
                    mario.y = 35;
                }else{
                    mario.remove();
                    tela.gameOver = true;
                }
            }
        });
    },
    remove: function(){
        Crafty.e("Blood").attr({x:this.x, y:this.y});
        koopa.countEnemies--;
        this.destroy();  
    }
});

Crafty.c("Blood", {
    init: function(){
        this.requires("2D, Canvas, SpriteAnimation, SpriteEnemy");
        this.attr({w: 33, h: 33, time: 0});
        this.animate("blood", 0, 4, 2);
        this.bind("EnterFrame", function(){
            this.animate("blood", 20, 1);
            if(this.time++ >= 25){
                Crafty.e("Items").attr({x: this.x, y: ( this.y - 100 ), z:0, w: 20, h: 20});
                this.destroy();
            }
        });
    }
});

Crafty.c("Items", {
    init: function(){
        this.requires("2D, Canvas, SpriteAnimation, Collision, Gravity, SpriteItems");
        this.attr({w: 33, h: 33, time: 0, animation: "coins"});
        this.gravity("Floor").gravityConst(0.3);
        this.origin(0,33);
        this.animate("coins", 0, 1, 5);
        this.animate("spring1", 4, 0, 4);
        this.animate("spring2", 4, 0, 6);
        this.bind("EnterFrame", function(){
            switch(this.animation){
                case "coins" : this.animate("coins", 20, 1); break;
                case "spring" : this.animate("spring1", 10, 1); break;
            }
        });
        this.collision();
        this.onHit("Mario", function() {
            switch(this.animation){
                case "coins" : 
                    Crafty.audio.play("coin",1,0.5);
                    mario.points++;
                    this.destroy();
                    break;
                case "spring" : 
                    Crafty.audio.play("spring",1,0.5);
                    this.animate("spring2", 10, 1);
                    mario.spring = true;
                    mario._up = true;
                    mario._falling = false;
                    break;
            }
        });
    }
});

Crafty.c("Wall", {
    init: function() {
        this.requires("2D, Canvas");
    }
});

Crafty.c("Floor", {
    init: function() {
        this.requires("2D, Canvas");
    }
});

/*
Crafty.c("Button", {
    init: function() {
        this.requires("2D, DOM, Text, SpriteAnimation, "+this.buttonType+", Mouse");
        this._w = 180;
        this._h = 50;
        this.bind("Click", function( callback ) {
            this.animate('press',0,this.by,1);
            this.animate('press',1,1);
        });
    }

    buttonType: function ( b ) {
        this.buttonType = b;
    }
})
*/