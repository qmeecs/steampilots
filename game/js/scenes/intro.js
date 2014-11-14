/**
 * Steam Pilots
 * moonsubmarine limited
 */

var showButtonArea, btn_credits, player_lbl, debug_console;            //declaring variables i will use in the JS side
 
Crafty.scene("Intro", function() {

    Crafty.viewport.init(800,600);
    Crafty.viewport.x=0;
    Crafty.viewport.y=0;
    //hiding UI
    Engine.UI.Hide();
    Engine.UI.LoginFormVisibility(false);

    Crafty.audio.add("button", "assets/sound/a_button.mp3");

    var btn_back, intro_play_btn;
    var a1,a2,a3,a4;

    function animateCloud() {
        cloud.y=150;
        cloud.alpha=1.0;
        cloud.addTween({x:380,y:100}, 'easeInOutQuad', 300)
        .addTween({alpha:0},'linear',300,animateCloud);
    }

    function gotoSetup() {

        city.tween({x:0,y:200},100);
        btn_credits.tween({x:1000,y:230},100);

        cloud.visible=false;

        btn_back = Crafty.e("2D, DOM, SpriteAnimation, back, Mouse, Tween, Cursor")
        .attr({x:540,y:-100})
        .bind("MouseUp", function( callback ) {
            this.animate('press',0,4,0);
            this.animate('press',1,1);
        })
        .bind("MouseDown", function( callback ) {
            this.animate('press2',1,4,1);
            this.animate('press2',1,1);
            exitSetup();
        })
        .tween({x:540,y:60},50);

        //airships
        a1 = Crafty.e("2D, DOM, SpriteAnimation, a1_dx, Tweener, Tween, Mouse, Cursor, Airship_intro").attr({x:60,y:airship_setup_y, alpha:0}).tween({alpha:1},100)
        .bind('MouseOver', function(e) { Engine.tooltipFactory(a1,1) }  )
        .bind('MouseOut', function(e) { Engine.tooltipFactory(null,0) } )
        .bind('Click',function() { 
            this.selectMe();
            a2.unSelectMe();
            a3.unSelectMe();
            a4.unSelectMe();
            shipSelected("a1");
        });
        a2 = Crafty.e("2D, DOM, SpriteAnimation, a2_dx, Tweener, Tween, Mouse, Cursor, Airship_intro").attr({x:240,y:airship_setup_y, alpha:0}).tween({alpha:1},100)
        .bind('MouseOver', function(e) { Engine.tooltipFactory(a2,2) }  )
        .bind('MouseOut', function(e) { Engine.tooltipFactory(null,0) } )
        .bind('Click',function() { 
            this.selectMe();
            a1.unSelectMe();
            a3.unSelectMe();
            a4.unSelectMe();
            shipSelected("a2");
        });
        a3 = Crafty.e("2D, DOM, SpriteAnimation, a3_dx, Tweener, Tween, Mouse, Cursor, Airship_intro").attr({x:420,y:airship_setup_y, alpha:0})
        .bind('MouseOver', function(e) { Engine.tooltipFactory(a3, 3) }  )
        .bind('MouseOut', function(e) { Engine.tooltipFactory(null,0) } )
        .bind('Click',function() { 
            if(player.level<5) return;
            this.selectMe();
            a1.unSelectMe();
            a2.unSelectMe();
            a4.unSelectMe();
            shipSelected("a3");
        });
        if( player.level<5 ) a3.tween({alpha:0.3},100);
        else { a3.tween({alpha:1},100) }
        a4 = Crafty.e("2D, DOM, SpriteAnimation, a4_dx, Tweener, Tween, Mouse, Cursor, Airship_intro").attr({x:600,y:airship_setup_y, alpha:0})
        .bind('MouseOver', function(e) { Engine.tooltipFactory(a4, 4) }  )
        .bind('MouseOut', function(e) { Engine.tooltipFactory(null,0) } )
        .bind('Click',function() { 
            if(player.level<10) return;
            this.selectMe();
            a2.unSelectMe();
            a3.unSelectMe();
            a1.unSelectMe();
            shipSelected("a4"); 
        });
        if( player.level<10 ) a4.tween({alpha:0.3},100);
        else { a4.tween({alpha:1},100) }


    }

    function exitSetup() {
        cloud.visible=true;
        city.tween({x:0,y:0},100);
        btn_credits.tween({x:540,y:230},100);
        btn_back.tween({x:540,y:-100},100);

        if( intro_play_btn ) {
            intro_play_btn.addTween({alpha:0},"linear",50, function(e) { intro_play_btn.destroy(); } );
        }

        a1.addTween({alpha:0},"linear",50, function(e) { a1.destroy(); } );
        a2.addTween({alpha:0},"linear",50, function(e) { a2.destroy(); } );
        a3.addTween({alpha:0},"linear",50, function(e) { a3.destroy(); } );
        a4.addTween({alpha:0},"linear",50, function(e) { a4.destroy(); } );
    }


    function shipSelected(type) {
        //setting player ship
        player.ship=type;
        if(intro_play_btn) if(intro_play_btn.alpha==1) return;
        //diplay Button
        intro_play_btn=Crafty.e("2D, DOM, SpriteAnimation, Button, play, Tweener, Tween, Cursor, Mouse")
        .bind("Click", function( callback ) {
            goToGame();
        })
        .attr({x:1000,y:370, alpha:1})
        .tween({x:500,y:370},50);
    }

    function goToGame() {
        Crafty.scene("Game");
    }

    /*
    *   function called to show the button is the
    *   user is logged in
    */
    showButtonArea = function() {
        btn_credits.tween({x:540,y:230},100);
    }


    var gear01=Crafty.e("2D, DOM, SpriteAnimation, Gear01, Tweener")
        .origin("center")
        .attr({x:28, y:253+200,})
        .addTween({rotation:359},'linear',-1);            

    var gear02=Crafty.e("2D, DOM, SpriteAnimation, Gear02, Tweener")
        .origin("center")
        .attr({x:615, y:500+200})
        .addTween({rotation:359},'linear',-1);       

    var btn_logout = Crafty.e("2D, DOM, SpriteAnimation, logout, Mouse, Cursor")
        .attr({x:1000,y:285})
        .bind("MouseUp", function( callback ) {
            this.animate('press',0,6,0);
            this.animate('press',1,1);
        })
        .bind("MouseDown", function( callback ) {
            this.animate('press',1,6,1);
            this.animate('press',1,1);
            Engine.util.logout();
        });     

    var btn_play = Crafty.e("2D, DOM, SpriteAnimation, play, Mouse, Cursor")
        .attr({x:1000,y:65})
        .attach(btn_logout)
        .bind("MouseUp", function( callback ) {

            this.animate('press',0,0,0);
            this.animate('press',1,1);
        })
        .bind("MouseDown", function( callback ) {
            this.animate('press2',1,0,1);
            this.animate('press2',1,1);
            gotoSetup();
        });

    var btn_profile = Crafty.e("2D, DOM, SpriteAnimation, profile, Mouse, Cursor")
        .attr({x:1000,y:120})
        .attach(btn_play)
        .bind("MouseUp", function( callback ) {
            this.animate('press',0,1,0);
            this.animate('press',1,1);
        })
        .bind("MouseDown", function( callback ) {
            this.animate('press',1,1,1);
            this.animate('press',1,1);
        });

    var btn_leaderboard = Crafty.e("2D, DOM, SpriteAnimation, leaderboard, Mouse, Cursor")
        .attr({x:1000,y:175})
        .attach(btn_profile)
        .bind("MouseUp", function( callback ) {
            this.animate('press',0,3,0);
            this.animate('press',1,1);
        })
        .bind("MouseDown", function( callback ) {
            this.animate('press',1,3,1);
            this.animate('press',1,1);
        });

    player_lbl = Crafty.e("2D, DOM, Text, Tween").attr({x:550, y:35, w:180, h:40})
    .textFont({ size: '20px', family: 'Georgia', align: 'center' })
    .textColor('#000000', 0.9);
 

    btn_credits = Crafty.e("2D, DOM, SpriteAnimation, credits, Mouse, Tween, Cursor")
        .attr({x:1000,y:230})
        .attach(btn_leaderboard)
        .bind("MouseUp", function( callback ) {
            this.animate('press',0,2,0);
            this.animate('press',1,1);
        })
        .bind("MouseDown", function( callback ) {
            this.animate('press',1,2,1);
            this.animate('press',1,1);
        });
        

    //cloud
    var cloud = Crafty.e("2D, DOM, SpriteAnimation, Cloud01, Tweener")
                .attr({x:380, y: 150+200});

    Crafty.e("2D, Canvas, Image").image("assets/img/sky.jpg", "no-repeat").attr({h:documentHeight, w:documentWidth, x:0, y:0 });
    var city=Crafty.e("2D, Canvas, Image, Tween").image("assets/img/city.png", "no-repeat").attr({h:documentHeight, w:documentWidth, x:0, y:200 })
    .attach(gear01)
    .attach(gear02)
    .attach(cloud)
    .tween({x:0,y:0},100, animateCloud());

    //keyboard console responder
    Crafty.e("2D,DOM,Keyboard")
    .bind("KeyDown", function() {
                if(this.isDown('CTRL') && this.isDown('SHIFT') && this.isDown('C') ) {
                    Engine.util.showConsole();
                }
    });

        //logo
    var logo_intro=Crafty.e("2D, Canvas, Image, Tweener").image("assets/img/logo.png")
        .attr({x:-450, y:20, _globalZ:2000})
        .addTween({x: 20, y: 20}, 'easeInOutQuad', 50);

    //check whether to show the button area
    if( Engine.util.getCookie("sp_player")!=undefined && Engine.util.getCookie("sp_player")!='' || Engine.offline)  {
        Engine.UI.LoginFormVisibility(false);
        player.name = Engine.util.getCookie("sp_player");
        player.obj = Engine.util.getCookie("sp_obj");
        Engine.UI.setPilotName();
        showButtonArea();
    } else {
        Engine.UI.LoginFormVisibility(true);
    }

    if(!isChrome()) {
        Engine.UI.showMessage("This game has been designed to be used with <a href='https://www.google.com/intl/it/chrome/browser/'>Chrome Browser</a>.<br>Performaces on any other browser may not be optimal.");
    }

});