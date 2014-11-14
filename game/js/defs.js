/**
 * Steam Pilots
 * moonsubmarine limited
 */

//game conf
var bulletSpeed = 8;

//main vars
var documentWidth = 800;
var documentHeight = 600;
var sceneWidth = 800;

//setup scene defs
var airship_setup_y=200;

//Game vars
var airship_start_x = 60;
var airship_start_y = 150;
var max_lives = 3;

//setup
//var api_endpoint = "http://www.instronix.com/cubrik/ajaxtest/cubriksteampilotsserver.php";
var api_endpoint = "http://www.steampilots.com/steampilots/imageannotation/annotationServer.php";

//portal vars
var portal_h = 418;
var portal_w = 380;
var portal_x = 211;
var portal_y = 48;

/* LVL 01 
* each level is devided in tiles of 800px each. Since the scene di 4800px we have 6 tiles.
* At any given time the renderer needs to render the actual tile and the following one.
* Once the player moves to the next the renderer will render the following one.
* Each tile has hurdles and animies defined as follow
* B = a random building taken from the buildings array
* H = a random hurdles taken from the hurdles array
* E = a random enemy taken from the enemy array
* F = final door
*/
//variable holding the levels descriptors

var levels = function() {

    var lvl_descr = Array(
                        {
                            tile1 : ["E","H"],
                            tile2 : ["E"],
                            tile3 : ["E","E"],
                            tile4 : ["E","E","E"],
                            tile5 : ["E"],
                            tile6 : ["E","E"]
                        });
    return lvl_descr[0];
}


var isChrome = function() {
    var nAgt = navigator.userAgent;
    if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
        return true;
    } else {
        return false;
    }

}