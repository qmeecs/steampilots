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

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function takeAction(reqType){

    if (reqType == 'onLoadAction') onLoadAction();
    if (reqType == 'action_1') action_1();
    
    if (reqType == 'reg_action') reg_action();
    if (reqType == 'auth_action') auth_action();
    if (reqType == 'start_action') start_action();
    if (reqType == 'end_action') end_action();
    if (reqType == 'imRequest_action') imRequest_action();
    if (reqType == 'tag_action') tag_action();

}

function onLoadAction(){
    
}

function isEmpty(val){
    if (val==null || val=="")
	{
		return true;
	}
    else
        return false;
}

function action_1 (){
    var f1 = document.getElementById("f1id").value;
    if (f1==null || f1=="")
	{
		return;
	}
    
    var f2=document.getElementById("f2id").value;
    if (f2==null || f2=="")
	{
		f2 = 'non';
	}
        
    var dataObj ={f1:f1, f2:f2};
    var obj2send ={dataType:"fields", data:dataObj}; 
    jsonReq = JSON.stringify(obj2send);
    callback = function (){
        //JSON format to receive: {dataType:'fields',data:{}}
                   obj = JSON.parse(recievedJson);
                   document.getElementById('receivedJSONID').innerHTML = recievedJson;
                };
                
    ajaxAsync(jsonReq, callback);
}
function reg_action(){
   var un = document.getElementById("reg_un").value;
   if (isEmpty(un)) return;
   
   var pw = document.getElementById("reg_pw").value;
   if (isEmpty(pw)) return;
   
   var email = document.getElementById("reg_email").value;
   if (isEmpty(email)) return;
   
   var sex = null; 
   var radios = document.getElementById('reg_male');
   if (radios.checked)
       sex = "Male";
   radios = document.getElementById('reg_femail');
   if (radios.checked)
       sex = "Female";
   if (isEmpty(sex)) return;
    
   var dob = document.getElementById("reg_age").value;
       
    function cbfun(ret){
        document.getElementById("reg_received").innerHTML = JSON.stringify(ret);
    }
    spa.register(cbfun, un,pw,email, sex,dob);
}
function auth_action(){
    var un = document.getElementById("auth_un").value;
   if (isEmpty(un)) return;
   
   var pw = document.getElementById("auth_pw").value;
   if (isEmpty(pw)) return;
    
   var rem = document.getElementById("auth_remember").checked;
    function cbfun(ret){
//        document.getElementById("auth_received").innerHTML = JSON.stringify(ret);
    }
    spa.authenticate(cbfun, un, pw, rem);
}
function start_action(){
    function cbfun(ret){
//        document.getElementById("se_received").innerHTML = JSON.stringify(ret);
    }
    spa.start(cbfun);
}
function end_action(){
    
    var finalScore = document.getElementById("se_fscore").value;
    function cbfun(ret){
//        document.getElementById("se_received").innerHTML = JSON.stringify(ret);
    }
    
    spa.end(cbfun, finalScore);
}

var shownImName;
function imRequest_action(){
    function cbfun(ret){
        
        var impath = ret.data.images.strImAddress;
        shownImName = ret.data.images.strImName;
        
        document.getElementById("an_im").innerHTML = "<img width=150px src='http://"+impath+"' >";       
//        document.getElementById("an_received").innerHTML = JSON.stringify(ret);
//        document.getElementById("globalReceived_ID").innerHTML = JSON.stringify(ret);

    }
    spa.imRequest(cbfun);
}
function tag_action(){
    var tag = document.getElementById("an_tag").value;
    if (isEmpty(tag)) return;
    
    function cbfun(ret){
        
        document.getElementById('recordsTitles_ID').innerHTML=tableCreate('Tag State','Image type', 'next Input Prob.', 'Next Image State');
        var records = document.getElementById('records_ID');
        records.innerHTML=  tableCreate(ret.storedInDb.tagWasCorrect,ret.storedInDb.tagStateWhenAppeared,ret.storedInDb.tagCorrectnessProbabilty, ret.nextType)+ records.innerHTML;
       
//        document.getElementById("globalReceived_ID").innerHTML = JSON.stringify(ret);
//        document.getElementById("an_received").innerHTML = JSON.stringify(ret);
    }
    
    var score = 1000;
    var im=shownImName;
    spa.tag(cbfun, im, tag, score);
    imRequest_action();
}


function tableCreate(tag, imState,prob, nextImState){//,score,imType,nextTagProb){
 strRet = " <table border='1' width='98.5%'>"+
                    "<tr>"+
                        "<th width='25%'>"+tag+"</th >"+                       
                        "<th width='25%'>"+imState+"</th>"+
                        "<th width='25%'>"+prob+"</th>"+
                        "<th width='25%'>"+nextImState+"</th>"
                   " </tr>"+
                   " </table>";
           
 return strRet;
}