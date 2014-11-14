var loading_text,gameOverComplete;



Crafty.scene("GameOver", function() {

    Engine.UI.Hide();

    Crafty.viewport.x=0;
    Crafty.viewport.y=0;

    Crafty.e("2D, DOM, Image").image("assets/img/sky.jpg", "no-repeat").attr({h:documentHeight, w:documentWidth, x:0, y:0 });

    //bg
    Crafty.e("2D, DOM, Image").attr({x:100,y:90,w:600,h:330,_z:0}).image("assets/img/black_70.png","repeat")
    .css({"border-radius": "10px"});
    //leaderboard bg
    Crafty.e("2D, DOM, Color").attr({x:420,y:380,w:340,h:200,_z:0}).color("rgba(0,0,0,1)")
    .css({"border-radius": "5px"});

    //total
    Crafty.e("2D, DOM, Text").attr({ x: 0, y: 30, w:800 }).text("<div class='gameOverText bigText'>Game Statistics:</div>")
    .css({"text-align":"center","font-size":"30px","color":"#EEE"});

    Crafty.e("2D, DOM, Text").attr({ x: 440, y: 310, w:300, h:30 }).text("<div class='gameOverText bigText'>Leaderboard:</div>")
    .css({"text-align":"center","font-size":"30px","color":"#EEE"});

    //ship
    Crafty.e("2D, DOM, SpriteAnimation").attr({x:40,y:50}).addComponent( player.ship+"_dx" );
    //.addComponent(player.sprite);
    loading_text = Crafty.e("2D,DOM,Text,TextStyler").text("Loading...").attr({x:250,y:250,w:300}).renderAsClass("gameOverText");
    
    player.score = Engine.util.TotalPlayerScore();

    //back button    
    var back_profile = Crafty.e("2D, DOM, back, Mouse, Cursor, SpriteAnimation")
        .attr({x:50,y:510})
        .bind("MouseUp", function( callback ) {
            this.animate('press',0,1,0);
            this.animate('press',1,1);
        })
        .bind("MouseDown", function( callback ) {
            this.animate('press',1,1,1);
            this.animate('press',1,1);

            Crafty.scene("Intro");
        });

    gameOverComplete = function(e) {

            loading_text.destroy();
            
            Crafty.e("2D, DOM, Text").attr({x:150,y:180,w:200}).text("<div class='gameOverText'>Score:</div>");
            Crafty.e("2D, DOM, Text, TextStyler").attr({x:450,y:180,w:200}).text("<div class='gameOverText statsScore'>"+e.data.nYourScore+"</div>");
            
            Crafty.e("2D, DOM, Text, TextStyler").attr({x:150,y:220,w:200}).text("<div class='gameOverText'>Highest Score:</div>");
            Crafty.e("2D, DOM, Text, TextStyler").attr({x:450,y:220,w:200}).text("<div class='gameOverText statsScore'>"+e.data.nYourHighScore+"</div>");
            //Stats
            var statCounter = 0;
            for(singleStat in e.data.stats.stats) {
                var thisStats = e.data.stats.stats[singleStat];
            
                if( thisStats.type=='str' ) {
                    Crafty.e("2D, DOM, Text, TextStyler").attr({x:150,y:(230+statCounter*30),w:200}).text("<div class='statsText'>"+ thisStats.name +"</div>");
                    Crafty.e("2D, DOM, Text, TextStyler").attr({x:450,y:(230+statCounter*30),w:200}).text("<div class='statsText'>"+ thisStats.value +"</div>");
                }
                statCounter++;
            }

            statCounter = 0;
            for(singleBoard in e.data.leaderboard.leaderboard) {
                var thisBoard = e.data.leaderboard.leaderboard[singleBoard];
                console.log(thisBoard);
                Crafty.e("2D, DOM, Text, TextStyler").attr({x:450,y:(420+statCounter*30),w:200}).text("<div class='leaderBoardText'>"+ thisBoard.strUsername +"</div>");
                Crafty.e("2D, DOM, Text, TextStyler").attr({x:640,y:(420+statCounter*30),w:200}).text("<div class='leaderBoardText'>"+ thisBoard.nScore +"</div>");
                statCounter++;
            }

    }

    //calling gameover WS
    Engine.api.gameEnd();
    //reset the player
    player.reset();
});

