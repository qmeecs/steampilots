/**
 * Steam Pilots
 * moonsubmarine limited
 */
var player_ship;

var scene_elements=Array();

var mainTimer;

var parallax01;

var level_data = new Object();
var golden_key_sprite, silver_key_sprite, golden_gate, final_gate;


/* buildings assets
* those are the assets that are used as buildings
*/
var B = Array("b01","b02","b03","b03","b04","b05","b06","b07","b08","b09","b010","b011","b012","b013","b014","b015","b016","b017","b018","b019","fan");
var H = Array("enemy01","enemy02");
var E = Array("");
var F = Array("door");


Crafty.scene("Game", function() {

    if(player.level==1) player.reset();

    $("#player_name").html("Pilot:"+player.name);

    //setting the timer
    Engine.util.StartTimer();

    //alpha on the keys
    Engine.UI.alphaElement("gold_key",0.2);
    Engine.UI.alphaElement("silver_key",0.2);

    player.golden_key = false;
    player.silver_key = false;

    /*
    *   i generate the tile on which to position the silver and golde key.
    *   the silver key must be on tile 2,3,4 and the golden on 4 or 5
    */
    level_data.golden_key = Math.floor(Math.random() * 3) + 1;
    level_data.silver_key = Math.floor(Math.random() * 2) + 4;
    //setting UI
    Engine.UI.Setup();
    Engine.UI.Show();

    //setting viewport
    Crafty.viewport.init(800,600);


    //main engine listener
    Crafty.e("2D,DOM")
    .bind("lost_a_ship", function() { 

        this.timeout( function() {
                Engine.util.StartTimer();
                //resetting player position
                Engine.resetPlayerPosition();
            
                player.lives--;

                //remove a life from the UI
                if(player.lives==2) { $("#life3").hide(); }
                if(player.lives==1) { $("#life2").hide(); }
                //trigger the gameover event
                if(player.lives<=0) { 
                    $("#life1").hide();
                    mainTimer.stopRepeating();
                    Crafty.trigger("game_over");
                }
        },2000);

    })
    .bind("game_over", function() {
        //gameover code here
        Crafty.scene("GameOver");
    })
    .bind("times_up", function() {
        Crafty.trigger("lost_a_ship");
    })
    .bind("refreshUI", function() {
        $("#p_score").html("# "+player.score);
        $("#p_level").html("Lvl "+player.level);
    })
    ;

    //background
    Crafty.e("2D, DOM, Image").image("assets/img/sky1.jpg","repeat")
    .attr({x:0, y:0, w:Engine.util.lengthByLevel(player.level), h:600});
    //parallax01
    parallax01 = Crafty.e("2D, DOM, Image").image("assets/img/parallax01.png","repeat")
    .attr({x:0, y:300, w:Engine.util.lengthByLevel(player.level) + 180, h:200, alpha:1});

    //boundary setup
    Crafty.e("2D, DOM, Color, Bottom, Border").attr({x:0,y:500,w:Engine.util.lengthByLevel(player.level),h:1}).color('rgba(0,0,0,0)'); //floor
    Crafty.e("2D, DOM, Color, Top, Border").attr({x:0,y:0,w:Engine.util.lengthByLevel(player.level),h:1}).color('rgba(0,0,0,0)'); //ceiling
    Crafty.e("2D, DOM, Color, Border").attr({x:30,y:0,w:1,h:600}).color('rgba(0,0,0,0)'); //lx wall
    Crafty.e("2D, DOM, Color, Border").attr({x:Engine.util.lengthByLevel(player.level)-30,y:0,w:1,h:600}).color('rgba(0,0,0,0)'); //dx wall

    //setting airship;
    player.sprite = Crafty.e("2D, DOM, SpriteAnimation, Tweener, Tween, Ship, Renderer").attr({x:airship_start_x,y:airship_start_y,alpha:0,_z:2000}).tween({alpha:1},50)
    //the player.sprite entity holds the rendere bases
    //now we render the tile 0 with the renderer obj
    player.sprite.render(0);
    if(player.shield!=undefined) player.sprite.attach( player.shield );
    //calling the ticker
    Engine.util.tick();

    Crafty.trigger("refreshUI");

    Crafty.viewport.follow(player.sprite,0 ,20 );

    if(player.level==1) {
        Engine.api.gameStart();
        Engine.UI.showMessage("Welcome to Steam Pilots,<br>Use your arrow keys to move the airship. The goal is to unlock the final door and save the past by annotating the images.<br>Good Luck");
    }

});