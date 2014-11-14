// The MIT License (MIT)

// Copyright (c) 2014 Queen Mary University of London

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// ==============================================================================


<?php session_start();?>





<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title>CubriK</title>
        
        <style type="text/css">
            #reg_ID{
                float: left;
                width: 500px;
                height:350px;               
                border: 1px solid black;
                overflow: hidden; 
            }
            #auth_ID{
                float: left;
                width: 500px;
                height:350px;
                border: 1px solid black;
                overflow: hidden;
            }
            #se_ID{
                float: left;
                width: 500px;
                height:350px;
                border: 1px solid black;
                overflow: hidden;
            }
            #an_ID{
                float: left;
                width: 500px;
                height:350px;
                border: 1px solid black;
                overflow: hidden;
            }
        </style>
        <!--1-->
        <style type="text/css">
        body
        {
           text-align: center;
           margin: 0;
           background-color: #FFFFFF;
           color: #000000;
        }
        </style>
        <style type="text/css">
        div#container
        {
           width: 800px;
           position: relative;
           margin-top: 0px;
           margin-left: auto;
           margin-right: auto;
           text-align: left;
        }
        </style>
        <!--1!-->
        
        <script type="text/javascript" src="./js/annotationAPI.js"></script>
        <script type="text/javascript" src="./js/annotationExample.js"></script>
    </head>
    <body onload="takeAction('onLoadAction')">
        
        
                <!--2 Your Banner Goes here + your content go here-->
        <div id="container">
        <img src="images/bv01002.jpg" id="Banner2" alt="GWAP Framework Portal" style="position:absolute;left:1px;top:3px;width:802px;height:89px;border-width:0;z-index:0">
        <div id="bv_Image2" style="margin:0;padding:0;position:absolute;left:6px;top:7px;width:118px;height:76px;text-align:left;z-index:1;">
        <img src="images/bv_img1.jpg" id="Image2" alt="" align="top" border="0" style="width:118px;height:76px;"></div>
        </div>
        <!--2!-->
        
        
        <!--3 Your content goes here-->
        <!--<div id="bv_Text1" style="margin:0;padding:0;position:absolute;left:15px;top:110px;width:150px;height:16px;text-align:left;z-index:2;">-->
        <div id="bv_Text1" style="margin:0;padding:0;position:absolute;left:15px;top:110px;text-align:left;z-index:2;">
        
<!--        <div id ="receivedJSONID"></div>
        <div id="action_1_ID">
                field1:<input type='text' name='f1' id="f1id">
                field2:<input type='text' name='f2' id="f2id">

                <button type="button" onclick="takeAction('action_1')">action_1</button>

                <br/>        
        </div> -->
        
        
        <!---------------------------------------------------->
<!--Registeration - all ids and names are prefixed with reg_-->
        <div id="reg_ID">
            Register: <br>
                <table style="width:300px">
                <tr>
                    <td>User Name* </td><td> <input type='text' name='reg_username' id="reg_un"> </input></td>
                </tr>
                <tr>
                    <td>Password* </td><td> <input type='password' name='reg_password' id="reg_pw">  </input> </td>
                </tr>
                <tr>
                    <td>Repeat Password* </td><td> <input type='password' name='reg_passwordRepeat' id="reg_pwr">  </input></td>
                </tr>
                <tr>
                    <td>email* </td><td> <input type='text' name='reg_email' id="reg_email"></input></td>
                </tr>
                <tr>
                    <td>Gender*: </td><td>  
                    <input type="radio" name="reg_sex" value="Male" id="reg_male">Male
                    <input type="radio" name="reg_sex" value="Female" id="reg_femail">Female
                    </td>
                </tr>
                <tr>
                    <td>Birth year </td><td> <input type="number" name="reg_age" id="reg_age" min="1950" max="2050"></td>
                </tr>
                <tr>
                    <td> <button type="button" onclick="takeAction('reg_action')">Register</button></td><td></td>
                </tr>    
                </table><br>
		 Received:
                 <div id="reg_received"></div><br>
	</div>
<!--Authentication - all ids and names are prefixed with auth-->
        
        <div id="auth_ID">
            Authentication:<br>
            <table style="width:300px">
                <tr>
                    <td>User Name </td><td><input type='text' name='auth_username' id="auth_un"> </input></td>
                </tr>
                    
                <tr>
                    <td>Password </td><td><input type='password' name='auth_password' id="auth_pw"></input> </td>
                </tr>
                
                <tr>
                    <td><input type="checkbox" name="auth_remember" id="auth_remember" >Remember me<br></td>
                </tr>
                
                <tr>
                    <td> <button type="button" onclick="takeAction('auth_action')">Login</button></td><td></td>
                </tr>
            </table><br>
            Received:
            <div id="auth_received"></div><br>
        </div>       
 <!--Start and End - all ids and names are prefixed with se-->       
        <div id="se_ID">
            <button type="button" onclick="takeAction('start_action')">Start Game!</button>
            <button type="button" onclick="takeAction('end_action')">End Game!</button>
            <br>
            Final Score:  <input type="number" name="se_fscore" id="se_fscore">

            <br>
            Received:
            <div id="se_received"></div><br>
        </div>   

 <!--Annotate - all ids and names are prefixed with an, this also requests for next image to show-->       
        <div id="an_ID">
            Request Image:<br>
            <button type="button" onclick="takeAction('imRequest_action')">Request</button> <br>
             
            Annotate:<br>
            <table style="width:300px">
                <tr>
                    <td>TAG </td><td><input type='text' name='an_tag' id="an_tag"> </input></td>
                </tr>
                <tr>
                    <td> <button type="button" onclick="takeAction('tag_action')">Submit</button></td><td></td>
                </tr>
            </table><br>
            Image:
            <div id="an_im"></div><br>
            Received:
            <div id="an_received"></div><br>
        </div>
         <br>
         
        <!--Received:-->
        <!--<div id="globalReceived_ID"> </div>-->
         <br>
        <div id="recordsTitles_ID"> </div>
        <div id="records_ID"> </div>
 
        
         <!--4-->
        <br><br>
        <font style="font-size:13px" color="#000000" face="Arial">© 2013 Queen Mary University of London. Server and client software are released under the MIT license.</font>
        <br>
        <img src="images/bv_img3.jpg" id="Image1" alt="" align="top" border="0" style="width:175px;height:52px;">
        <!--4!-->
        
        </div>
        <!--3!-->
        
        
    </body>
</html>