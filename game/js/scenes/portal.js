/**
 * Steam Pilots
 * moonsubmarine limited
 */

var img_to_load;
var img_name;
var showImage;
var notiTop;
var point_to_level;
var obj_to_level;
var this_lvl_points = 0;
var objects = 0;
var cleared = false;

var top_score, top_attempts;

top_notification = function(text) {

        if(notiTop) {
            notiTop.destroy();
        }

        notiTop = Crafty.e("2D,DOM,Text,Delay,Fader").attr({x:200,y:0,w:400,h:50}).text(text)
            .textColor("#000",1.0)
            .textFont({size:"25px","family":"Georgia"})
            .css({"text-align":"center"})
            .fade();
}

sendAnnotation = function() {

    top_notification("Synching with time servers...")

    $('#send_me').css("visibility","hidden");
    var user_text =  $('#annotation').val() ;
    Engine.api.sendAnnotation( user_text );
    $('#annotation').val('');

}

update_upper_ui = function() {

    top_score.text("<div class='top_ui_anno'>Time point: " + this_lvl_points + "/"  + point_to_level + "</div>");
    top_attempts.text("<div class='top_ui_anno'>Objects: " + objects + "/"  + obj_to_level + "</div>");

}


Crafty.scene("Portal", function() {

    Engine.UI.Hide();
    point_to_level = Engine.util.pointsByLevel(player.level);
    obj_to_level = Engine.util.objByLevel(player.level);

    Crafty.viewport.x=0;
    Crafty.viewport.y=0;

    Engine.UI.showMessage( "You cleared the level. You can now save our past by annoting the images our scientiets are recovering.<br>You need to score " + Engine.util.pointsByLevel(player.level) + " points to access the next level");

   Crafty.audio.add("gate", "assets/sound/a_gate.mp3");

   Crafty.e("2D,DOM,Image").attr({x:0,y:0}).image("assets/img/portal.jpg");

   //adding upper console texture
    Crafty.e("2D,DOM,Image").attr({x:0,y:-65}).image("assets/img/consolle_clear.jpg");   

   //top UI
   top_score = Crafty.e("2D,DOM,Text")
                .text("")
                .attr({x:20,y:5,w:250});

    top_attempts = Crafty.e("2D,DOM,Text")
                .text("")
                .attr({x:645,y:5,w:300});

    update_upper_ui();

   //image
   var img = Crafty.e("2D,DOM,SpriteAnimation").attr({x:211,y:48});

   var door_s = Crafty.e("2D,DOM,Image,Tween").attr({x:portal_x,y:portal_y}).image("assets/img/door_s.png");
        var w1 = Crafty.e("2D,DOM,Image,Tween").attr({x:228,y:355}).image("assets/img/door_gear_s.png")
        .attach(door_s)
        .origin("center");

   var door_d = Crafty.e("2D,DOM,Image,Tween").attr({x:374,y:48}).image("assets/img/door_d.png");
        var w2 = Crafty.e("2D,DOM,Image,Tween").attr({x:370,y:220}).image("assets/img/door_gear_d1.png")
        .origin("center");
        var w3 = Crafty.e("2D,DOM,Image,Tween").attr({x:470,y:340}).image("assets/img/door_gear_d2.png")
        .origin("center");

    //testarea
    var inputArea = Crafty.e("2D,DOM,Text").attr({x:200,y:480,w:300}).text("<input type='text' id='annotation' placeholder='What is this?' value=''>");
    var sendButton = Crafty.e("2D,DOM,Text,Mouse").attr({x:520,y:480}).text("<input type='button' id='send_me' style='visibility:hidden' class='button' onClick='sendAnnotation()' value='Send'>");
    
    top_notification("Retriving first time fragment...");


    openDoors = function () {

        $('#send_me').css("visibility","visible");

        top_notification("Encode complete.");
        Crafty.audio.play("gate",1,1);
        
        w1.tween({rotation:720},150);
        w1.tween({x:w1.x-178},150);

        w2.tween({rotation:-720},150);
        w3.tween({rotation:-360},150);
        door_d.tween({x:door_d.x+190},150);
        w2.tween({x:w2.x+190},150);
        w3.tween({x:w3.x+190},150);

    }

    closeDoors = function (mode) {

            top_notification("Retriving next time fragment.");

            Crafty.audio.play("gate",1,1);
            
            w1.tween({rotation:-720},150);
            w1.tween({x:w1.x+178},150);

            w2.tween({rotation:720},150);
            w3.tween({rotation:360},150);
            door_d.tween({x:door_d.x-190},150);
            w2.tween({x:w2.x-190},150);
            w3.tween({x:w3.x-190},150);

           if( mode ) {
                Crafty.e("Delay").delay(function() { showImage(img_to_load); },4000);
           }
    }

    
    /**
     * This function is called by the Engine method that gets the image to annotate from the server.
     * It takes the url, it converts it in an Image than it crops it.
     * After the image is loageg behind the doors calls the openDoor() function.
     */

    showImage = function(url) {

        if(cleared) {
            player.level ++;
            player.lives = max_lives;
            notiTop.destroy();
            Crafty.scene("Game");
        }

        img.x=portal_x;
        img.y=portal_y;

        var __coord;

        var _img = Crafty.asset(url);
        if (!_img) {
            _img = new Image();
            _img.src = url;
            Crafty.asset(url, _img);
            _img.onload = function () { 
                //repositioning
                if( _img.height<portal_h ) img.y = (portal_h - _img.height)/2 + portal_y;
                if( _img.width<portal_w ) img.x = (portal_w - _img.width)/2 + portal_x;
                openDoors();
            }
        } else {
            if( _img.height<portal_h ) img.y = (portal_h - _img.height)/2 + portal_y;
            if( _img.width<portal_w ) img.x = (portal_w - _img.width)/2 + portal_x;
            console.log("b"+_img);
            openDoors();
        }

        Crafty.c("image_to_annotate", {
                ready: false,
                __coord: [0, 0, portal_w, portal_h],

                init: function () {
                    this.requires("Sprite");
                    this.__trim = [0, 0, 0, 0];
                    this.__image = url;
                    this.__coord = [this.__coord[0], this.__coord[0], this.__coord[2], this.__coord[3]];
                    this.__tile = 0;
                    this.__tileh = 0;
                    this.__padding = [0, 0];
                    this.img = _img;

                    //draw now
                    if (this.img.complete && this.img.width > 0) {
                        this.ready = true;
                        this.trigger("Change");
                    }

                    //set the width and height to the sprite size
                    this.w = this.__coord[2];
                    this.h = this.__coord[3];
                }
        });
        
        img.addComponent("image_to_annotate");

    }

    //getting the first image
    Engine.api.requestImage(1);

});