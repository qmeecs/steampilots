/**
 * Steam Pilots
 * moonsubmarine limited
 */

var tooltipView;
//ajax related vars
var xmlhttp;
var xmlHttpTimeout;

(function game($, Crafty) {
    $(document).ready(function documentReady() {

        Crafty.init(documentWidth, documentHeight);
        Crafty.canvas.init();

        Engine.UI.Hide();
        Engine.UI.LoginFormVisibility(false);
        
        Crafty.scene("Loading", function() {
            //$("#interface").hide();
            Crafty.load(["assets/img/bg_home.jpg",
                         "assets/img/sky.jpg",
                         "assets/img/s_buttons.png",
                         "assets/img/city.png",
                         "assets/img/airship_1.png",
                         "assets/img/airship_2.png",
                         "assets/img/airship_3.png",
                         "assets/img/airship_4.png",
                         "assets/img/alert.jpg",
                         "assets/img/black_70.png",
                         "assets/img/logo.png",
                         "assets/sound/a_button.mp3",
                         "assets/sound/a_gate.mp3",
                         "assets/img/sky1.jpg",
                         "assets/img/parallax01.png",
                         "assets/img/portal.jpg",
                         "assets/img/door_d.png",
                         "assets/img/door_s.png",
                         "assets/img/door_gear_s.png",
                         "assets/img/door_gear_d1.png",
                         "assets/img/door_gear_d2.png",
                         "assets/img/consolle_clear.jpg",
                         "assets/img/lifes.png"
                ], function() { 
                    Crafty.scene("Intro"); 
                });
            Crafty.e("2D, DOM, Text")
                .attr({w: 100, h: 20, x: (documentWidth-100)/2, y: (documentHeight-20)/2, z:0})
                .text("Loading...")
                .css({"text-align": "center"});
        });
        Crafty.scene("Loading");

    });
})(jQuery, Crafty);


//player class *******************************
var player = new Player("",1)

function Player(_name,lvl) {
    this.name=_name;                //player's name from cookie or login
    this.score=0;                   //actual score
    this.level=lvl;                   //actual level
    this.ship="";                   //not used
    this.lives=max_lives;                   //number of lives
    this.obj = '';                  //cookied auth obj as returned from the API
    this.killed = 0;                //how many enemies the played killed
    this.total_time = 0;            //the total game time
    this.saved = 0;                 //how many imaged the player annotated with at least 100pt of score
    this.shield = undefined;

    this.addScore = function(points) {
        player.score += points;
        if( Crafty._current=='Game' ) Crafty.trigger("refreshUI");
    }

    this.reset = function() {
        this.score = 0;
        this.lives = max_lives;
        this.killed = 0;
        this.total_time = 0;
        this.shield = undefined;
        this.saved = 0;
        this.level = 1;
    }
}



//player class


//Engine Class *******************************
var Engine=new Object();
Engine.offline = false;
Engine.UI=new Object();
Engine.util = new Object();
Engine.api = new Object();
/**
 * method to show tooltips
 * o = the object that triggered the toolti
 * type = the type of tooltip used to generate the text
 */
Engine.tooltipFactory = function(o, type) {
    if( tooltipView ) tooltipView.destroy();

    if(type==0) {    
        return;
    }

    alert_timer = Crafty.e("2D, Delay").delay(function() { tooltipView.destroy(); },3000);

    tooltipView = Crafty.e("2D, DOM, Text, Image, Delay").attr({x: o.x + (o.w-100)/2, y: o.y + o.h + 10, w:100, h:50}).image("assets/img/black_70.png","repeat")
    .text( "<div style='font-family:Verdana; font-size:14px; color:#FFF; text-align:center; margin-top:5px'>"+Engine.textFactory(type) +"</div>");
    
}

Engine.textFactory = function(id) {
    switch(id)
    {
        case 1:
        return "Fast<br>Airship";
        break;

        case 2:
        return "Shielded<br>Airship";
        break;

        case 3:
        if(player.level<5) {
            return "Reach LVL 5 to unlock";
        } else {
            return "Fast and with missiles";
        }
        break;

        case 4:
        if(player.level<10) {
            return "Reach LVL 10 to unlock";
        } else {
            return "Fast, tough and lethal";
        }
        break;

        default:
        return "##no str##";
        break;
    }
}

Engine.UI.Setup = function() {
    $(".life").empty();
    for(var i=1;i<=player.lives;i++) {
        $(".life").append("<div id='life"+i+"' class='ship'></div>");
    }
}

Engine.UI.LoginFormVisibility = function(mode) {
    if(mode==true) {
        $("#login_form").css("visibility", "visible");
    } else {
        $("#login_form").css("visibility", "hidden");
    }
}

Engine.UI.SignupFormVisibility = function(mode) {
    if(mode==true) {
        $("#signup_form").css("visibility", "visible");
    } else {
        $("#signup_form").css("visibility", "hidden");
    }
}

Engine.resetPlayerPosition = function() {

    player.sprite.removeComponent("esplosione");
    player.sprite.addComponent(player.ship+'_dx');

    //remove the enemy in the scene
    for(var ent in scene_elements) {
        scene_elements[ent].destroy();
    }
    scene_elements = [];

    //reset the hardles counter
    player.sprite.renderedHardles = 0;

    player.sprite.x = airship_start_x;
    player.sprite.y = airship_start_y;
    parallax01.x=0;
    player.inReset = false;
}

Engine.UI.Hide = function() {
    $("#interface").hide();
    $("#lowerUI").visibility="hidden";
    $("#upperUI").visibility="hidden";
}
Engine.UI.Show = function() {
    $("#interface").show();
    $("#lowerUI").visibility="visible";
    $("#upperUI").visibility="visible";
}
Engine.UI.setPilotName = function() {
    player_lbl.text("Pilot: "+player.name);
}

Engine.util.tick = function() {
    Engine.time--;

    //format string
    var minutes = Math.floor(Engine.time / 60);
    var seconds = Engine.time - minutes * 60;
    if( seconds < 10 ) seconds = "0"+seconds;

    //update label
    $("#timer").html(minutes+":"+seconds);
    //
    if(Engine.time==0) {
        mainTimer.stopRepeating();
        //
        Crafty.trigger("times_up");
    }
}
/**
 * method to get the level lenght ( width ) given the level
 * level = integer of the level
 */
Engine.util.lengthByLevel = function( level ) {
    return 4800;
}

/**
 * method to get the time ( seconds ) given the level
 * level = integer of the level
 */
Engine.util.timeByLevel = function( level ) {
    return 90;
}


Engine.util.StartTimer = function() {
    if(mainTimer) mainTimer.stopRepeating();
    Engine.time = Engine.util.timeByLevel();
    mainTimer = Crafty.e("Repeater");
    mainTimer.repeat(function() { Engine.util.tick(); },1000,-1);
}

/**
 * method to get the number of point needed to pass the annotation level given the level
 * level = integer of the level
 */
Engine.util.pointsByLevel = function( level ) {
    return 250;
}


/**
 * method to get the number of images showed to the user durign the annotation level 
 * level = integer of the level
 */
Engine.util.objByLevel = function( level ) {
    return 5;
}

/**
 * method to call to logout, it will reset the cookies and reload the intro view
 */

Engine.util.logout = function() {

        Engine.util.setCookie("sp_player","",1);
        Engine.util.setCookie("sp_obj","",1);
        $("#login_form").show();
        Crafty.scene("Intro");
}

/**
 * this method return if the ship type can shoot
 */
Engine.util.shipCanShoot = function() {
    if(player.ship == "a3" || player.ship == "a4") {
        return true;
    } else {
        return false;
    }
}


/**
 * method to return the speed of the ship based on the type 
 * level = integer of the level
 */
Engine.util.speedByType = function() {
    switch (player.ship) {
        case "a1":
        return 4;
        break;

        case "a2":
        return 3;
        break;

        case "a3":
        return 5;
        break;

        case "a4":
        return 5;
        break;

        default:
        return 4;
        break;
    }
}

/**
 * method to set the alpha of a UI element by the ID and alpha
 * ex: Engine.UI.alphaElement("pippo",0.5);
 */
Engine.UI.alphaElement = function( name, alpha ) {
    $("#"+name).css({ opacity: alpha });
}

/**
 * method to show a big text as interlude
 */
Engine.UI.bigText = function(text, callback, delay) {

    if(delay==undefined) delay=500;
 
    var bt = Crafty.e("2D,DOM,Text,Tween,Color").attr({x:0,y:200,h:200,w:800})
    .text("<div class='bigText'>"+text+"</div>")

    Crafty.e("Delay").delay( function() { 
        bt.tween({alpha:0,y:100},50); 
    }, delay);

    Crafty.e("Delay").delay( function() { bt.destroy() },delay+1200 );

}

/**
 * method to show an interlude message
 */
Engine.UI.showMessage = function(text,autoclosedelay,callback) {

    Crafty.pause();
    $("#message_box").css("visibility", "visible");
    $("#message").html("<p>"+text+"</p><p><a href='javascript:Engine.UI.closeMessage("+callback+")'>Close</a>");

    if( autoclosedelay!=null ) {
        Crafty.e("Delay").delay(function() { Engine.UI.closeMessage() },2000);
    }

}


/**
 * method to close an interlude message
 */
Engine.UI.closeMessage = function(fnc) {
    $("#message_box").css("visibility", "hidden");
    if( Crafty.isPaused ) Crafty.pause();

    if(fnc) { fnc(); }  
    
}


/**
 * method trigger the login from the API
 */
Engine.util.tryLogin = function() {
    var un = $("#un").val();
    var pw = $("#pw").val();
    if( Engine.util.validate("notempty",un)!=true || Engine.util.validate("notempty",pw)!=true )  {
        Engine.util.alert("Please fill all the fields to login or register");
    }

    Engine.api.login(un,pw,true);
}

/**
 * method trigger the register the user
 */
Engine.util.trySignUp = function() {

    var un = $('#s_un').val();
    var pw = $('#s_pw').val();
    var email = $('#s_email').val();
    var b_day = $('#s_day').val();
    var b_month = $('#s_month').val(); 
    var b_year = $('#s_year').val();
    var gender = $('#s_gender:checked').val();

    //validation
    var birth = b_month + "/" + b_day + "/" + b_year;

    if( Engine.util.validate("notempty",un)!=true || Engine.util.validate("notempty",pw)!=true || Engine.util.validate("ischecked",gender)!=true ) {
        Engine.UI.showMessage("Plese fill all the field in the form");
        return false;  
    }
    if( Engine.util.validate("ismail",email) ) {
        Engine.UI.showMessage("Invalid email");
        return false;   
    }
    if( Engine.util.validate("isdate",birth) ) {
        Engine.UI.showMessage("Birth date is invalid");
        return false;
    }
    Engine.api.signup(un,pw,email,birth,gender);

}

/**
 * method to show the sign up form
 */
Engine.util.registerUser = function() {
    $("#login_form").hide();
    $("#signup_form").show();
}

/**
 * method to show the login form
 */
Engine.util.backToLogin = function() {
    $("#login_form").show();
    $("#signup_form").hide();
}

/**
 * validation layer
 */
Engine.util.validate = function(type, value) {
    if(type=="notempty") {
        return (value=='') ? "Please fill the field" : true;
    }
    if(type=="isdate") {
        var timestamp=Date.parse(value);
        return isNaN(timestamp);
    }
    if(type=="ismail") {
        var re = /\S+@\S+\.\S+/;
        return !re.test(value);
    }
    if(type=='ischecked') {
        return (value==undefined) ? false : true;
    }
}


Engine.util.alert = function(txt) {
    Engine.UI.showMessage(txt);
}

Engine.util.backToMenu = function() { Crafty.scene("Intro"); }

Engine.util.pause = function() { 
    Engine.UI.showMessage("Game Paused");
}

Engine.util.TotalPlayerScore = function() {
    return player.score + player.killed * 10 + player.total_time + player.saved * 5;
}

/**
*   method to login the user via ajax
*   @username : str
*   @password : str
*   @rememberme : bool
*/
Engine.api.login = function( un, pw, rememberme) {

    var dataObj ={strUn:un, strPw:pw};
    var obj2send ={dataType:"authentication", data:dataObj};

    var str_json = JSON.stringify(obj2send)
    //document.getElementById("myDiv").innerHTML=ajaxSync(str_json);
    Engine.util.ajaxAsync(str_json, function(e) { 

        var result = e.data.nSucess;
        var error = e.data.errors["0"];
        if(result==true) {

            player = new Player(un,1);
            player.name = un;
            player.lives = max_lives;
            player.level = 1;
            player.obj = e.user;

            Engine.UI.setPilotName();

            Engine.util.setCookie("sp_player",un,1);
            Engine.util.setCookie("sp_obj",e.user,1);
            Engine.UI.LoginFormVisibility(false);

            showButtonArea();
        } else {
            Engine.util.alert(error);
        }

    } );
}

/**
*   method to register the user via ajax
*   @username : str
*   @password : str
*   @email : str
*   @birth : str
*   @gender : str
*/
Engine.api.signup = function( un, pw, email, birth, gender) {

    var obj2send ={dataType:"registration", data:{ "strUn":un,"strPw":pw,"strEmailAddress":email,"strDateOfBirth":birth,"strGender":gender}};

    var str_json = JSON.stringify(obj2send)
    //document.getElementById("myDiv").innerHTML=ajaxSync(str_json);
    Engine.util.ajaxAsync(str_json, function(e) { 
        if( e.data.nSucess==true) {
            $("#signup_form").hide();
            $("#login_form").hide();
            Engine.api.login(un,pw,true);

        $('#s_un').val('');
        $('#s_pw').val('');
        $('#s_email').val('');
        $('#s_day').val('');
        $('#s_month').val(''); 
        $('#s_year').val('');
        $('#s_gender:checked').val('');

        } else {
            Engine.util.alert("Signup Error");
        }
    } );
}

/**
*   method to request the first image
*   "dataType":"imRequest"
*   "data":nNumOfImages int
*   "user":{OBJ}
*/
Engine.api.requestImage = function( number ) {

    if( Engine.offline ) {
            img_to_load = "assets/img/stub_img01.jpg";
            img_name = "stub_img01.jpg";
            showImage(img_to_load);
    }
    

    var obj2send ={dataType:"imRequest", data:{"nNumOfImages":1}, user: player.obj};

    var str_json = JSON.stringify(obj2send)
    //document.getElementById("myDiv").innerHTML=ajaxSync(str_json);
    Engine.util.ajaxAsync(str_json, function(e) { 
        img_to_load = e.data.images[0].strImAddress;
        img_name = e.data.images[0].strImName;

        showImage(img_to_load);

    } );
}

/**
*   method called to start the game
*/
Engine.api.gameStart = function() {

    var obj2send ={dataType:"gamestart", user: player.obj};

    var str_json = JSON.stringify(obj2send)
    //document.getElementById("myDiv").innerHTML=ajaxSync(str_json);
    Engine.util.ajaxAsync(str_json, function(e) { } );
}

/**
*   method called to end the game
*/
Engine.api.gameEnd = function() {

    if( Engine.offline ) {
        var e = new Object();
        e.data = new Object();
        e.data.nYourScore = 1000;
        e.data.nYourHighScore = 1200;
        gameOverComplete(e);
        return false;
    }

    var obj2send ={dataType:"gameover", data:{"nFinalScore": player.score }, user: player.obj};

    var str_json = JSON.stringify(obj2send)
    //document.getElementById("myDiv").innerHTML=ajaxSync(str_json);
    Engine.util.ajaxAsync(str_json, function(e) {
        gameOverComplete(e);
    } );

}


/**
*   method to send the annotation about the image
*   "dataType":"imRequest"
*   "data":nNumOfImages int
*   "user":{OBJ}
*/
Engine.api.sendAnnotation = function( annotation ) {

    if( Engine.offline ) {
        var e = new Object();
        e.data = new Object();
        e.data.nNewScore = player.score + 100;
        e.data.strNextImToShowAddress = "assets/img/stub_img01.jpg";
        e.data.strNextImToShowName = "stub_img01.png";
        e.data.demoText = "";
        Engine.api.processAnnotationResponse(e);
        return false;
    }

    var obj2send ={dataType:"annotation", data:{"strTaggedImName":img_name,"strTag":annotation,"nCurrentScore":player.score}, user: player.obj};

    var str_json = JSON.stringify(obj2send)
    //document.getElementById("myDiv").innerHTML=ajaxSync(str_json);
    Engine.util.ajaxAsync(str_json, function(e) { 
        Engine.api.processAnnotationResponse(e);
    } );
}

/**
*   method to process the annotation about the image
*   "e":json object as from the WS
*/
Engine.api.processAnnotationResponse = function(e) {
    if( e.data.errors != null ) {
            //no tag accepted
            Engine.UI.bigText("0 Pts");
        } else {
            var score = e.data.nNewScore - player.score;
            player.score = e.data.nNewScore;
            img_to_load = e.data.strNextImToShowAddress;
            img_name = e.data.strNextImToShowName;

            demoText = e.data.demoText;
            if(demoText!='' && demoText!=undefined) {
                 Engine.UI.showMessage(demoText);
            }

            Engine.UI.bigText(score+" Pts");

            //update user info
            player.score+=score;
            //if score > 100 set saved ++
            if( score>100 ) player.saved++;
            //update UI
            objects++;
            this_lvl_points+=score;
            update_upper_ui();

            if( this_lvl_points >= point_to_level) {
                Crafty.e("Delay").delay( function() {
                    Engine.UI.bigText("Cleared!!",3000);
                }, 1000);
                //setting stage as cleared
                cleared=true;

            }
            if( this_lvl_points < point_to_level && objects>=obj_to_level ) {
                Engine.UI.bigText("Game Over");
            }
            closeDoors(true);
        }
}

/*
*   method to SET the cookie
*/
Engine.util.setCookie = function(c_name,value,exdays) {
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie=c_name + "=" + c_value;
}

/*
*   method to GET the cookie
*/
Engine.util.getCookie = function(c_name) {
        var i,x,y,ARRcookies=document.cookie.split(";");
        for (i=0;i<ARRcookies.length;i++)
        {
          x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
          y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
          x=x.replace(/^\s+|\s+$/g,"");
            if (x==c_name)
            {
            return unescape(y);
            }
        }
}

/**
 * method to show the debug console
 */
Engine.util.showConsole = function() {
    debug_console = Crafty.e("2D,DOM,Text").attr({x:0,y:0,w:800,h:50}).text("<input type='text' style='width:250px' id='console'><input type='button' onClick='Engine.util.execCommand()' placeholder='command:param' value='Exec'>");
}

Engine.util.execCommand = function() {
    var command = $("#console").val();
    debug_console.destroy();
    var commands = command.split(":");
    //setting levels
    if( commands[0] == "level") {
        player.level = commands[1];
    }
    //setting name
    if( commands[0] == "name") {
        player.name = commands[1];
    }
    //setting offline game
    if( commands[0] == "offline" ) {
        Engine.offline = commands[1];
        Crafty.scene("Intro");
    }

}


/*
*   method to call asyncrously a remote resource
*/
Engine.util.ajaxAsync = function(requestObj,callback)
{
      
      if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
        }
      else
        {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }

      xmlhttp.onreadystatechange=function()
        {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
          {
            clearTimeout(xmlHttpTimeout);
            var recievedJson=xmlhttp.responseText;

            if(recievedJson!="Request not recognised" && recievedJson!='') {
                var d=JSON.parse(recievedJson);
                callback(d);
            } else {
                console.log(recievedJson);
            }
          }
        }
       
      xmlhttp.open("POST",api_endpoint,true);
      
      //~ xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xmlhttp.send(requestObj);

      //xmlHttpTimeout=setTimeout(ajaxTimeout,20000);
}

ajaxTimeout = function() {
        xmlhttp.abort();
        if(Crafty._current=='Portal') {
            Engine.UI.showMessage("Sorry, we have some issue connection to the time server.<br>Try again.",2000,function() { Crafty.scene("Portal"); });
        } else {
            Engine.UI.showMessage("Sorry we have some connection issues",2000, function() { Crafty.scene("Intro"); });
        }

}


//Engine Class∞

