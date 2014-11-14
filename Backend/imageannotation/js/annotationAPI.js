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

function ajaxAsync(requestObj,callBackFunction)
{
	
  var xmlhttp;
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
		// recievedJson='hi1234';
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
        recievedJson=xmlhttp.responseText;
        //Uncomment to see the received json
        //document.getElementById('errorDisplayID').innerHTML = recievedJson;
        callBackFunction();		
      }
    }
   
//  xmlhttp.open("POST","annotationServer.php",true);
  xmlhttp.open("POST","http://steampilots.com/steampilots/steampilots/imageannotation/annotationServer.php",true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send(requestObj);
}

var user=null;

var spa ={
    
    request: function(data, cbfun){
        callback = function (){
                   jObj = JSON.parse(recievedJson);
                   if (jObj.hasOwnProperty(user)){
                       user = jObj.user;
                       delete jObj.user;
                   }
                    cbfun(jObj);
                };
        if (!user === null){
            data.user = user;
        }
        ajaxAsync(JSON.stringify(data), callback);
    },
    
    register: function(cbfun, un, pw, email, gender, dob){
        var tosend = {
            dataType:"registration",
            data:{strUn:un, strPw:pw, strEmailAddress:email, strDateOfBirth:dob, strGender:gender}
            
        };      
        spa.request(tosend, cbfun);
    },
    
    authenticate: function(cbfun, un, pw, remember){
        var tosend = {
            dataType:"authentication",
            data:{strUn:un, strPw:pw, bRememberme:remember}
            
        };
        spa.request(tosend, cbfun);
    },
    
    start: function(cbfun){
        var tosend = {
            dataType:"gamestart",
        };      
        spa.request(tosend, cbfun);
    },
    
    end: function(cbfun, score){
        var tosend = {
            dataType:"gameover",
            data:{nFinalScore:score}
        };      
        spa.request(tosend, cbfun);
    },
    
    imRequest: function (cbfun){
        var tosend = {
            dataType:"imRequest",
        };      
        spa.request(tosend, cbfun);
    },
    
    tag: function(cbfun, imid, tag, score){
        var tosend = {
            dataType:"annotation",
            data:{strTaggedImName:imid, strTag:tag, nCurrentScore:score }
        };      
        spa.request(tosend, cbfun);
    }
}