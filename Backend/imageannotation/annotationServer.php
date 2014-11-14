<?php

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

//==============================================================================

//[A] define input and output JsonSerializable;
//[A]!

//[B] Test input
if($localTest=0)
{
    //0- registration
    //1- authentication
    //2- gamestart
    //3- gameover
    //4- imRequest
    //5- annotation
    $tmpReqType = 5;
    switch ($tmpReqType){
        case 0: 
            $testJson = array(
                'dataType'=>'registration', 
                'data'=>array(
                    'strUn'=>'asdun1', 
                    'strPw'=>'asdun', 
                    'strEmailAddress'=>'asdemail', 
                    'strGender'=>'m', 
                    'strDateOfBirth'=>'asdDOB'));
            break;
        case 1:
            $testJson = array(
                'dataType'=>'authentication', 
                'data'=>array(
                    'strUn'=>'asdun1',
                    'strPw'=>'asdun', 
                    'bRememberme'=>true));
            break;
        case 2:
            $testJson = array(
                'dataType'=>'gamestart');
            break;
        case 3:
            $testJson = array(
                'dataType'=>'gameover',
                'data'=>array('nFinalScore'=>1000)
            );
            break;
        case 4:
            $testJson = array(
                'dataType'=>'imRequest');
            break;
        case 5:
            $testJson = array(
                'dataType'=>'annotation',
                'data'=>array(
                    'strTaggedImName'=>'localhost//SteamPilots\2\imageUpload\ims/23.jpg',
                    'strTag'=>'asdtag',
                    'nCurrentScore'=>1000));
            break;
    }
    $testJson = json_encode($testJson);
}
//[B]!
include_once dirname(dirname(dirname(__FILE__))).'/general/library/userAuthFunctions.php';
include_once dirname(dirname(dirname(__FILE__))).'/general/library/dbfunctions.php';
include_once dirname(dirname(dirname(__FILE__))).'/adminNext/constants.php';
include_once dirname(dirname(dirname(__FILE__))).'/general/library/checkSessionAuthenticated.php';
include_once dirname(dirname(dirname(__FILE__))).'/trust/findTrustLevelAPI.php';



session_start();
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



//header("Content-Type: application/json");

$_SESSION['errors'] = array();


//[1] Receive JSON, if the local test is true uses the local tes otherwise receives the data from post input
if ($localTest)
    $strInJson = $testJson;
else
    $strInJson = file_get_contents('php://input');//The received json from the client is saved inside the php://input
   
$inJson = json_decode($strInJson, true);
$_SESSION['request'] = $inJson;
if (isset($_SESSION['request']['user'] )) unset ($_SESSION['request']['user'] );
//[1]!

//[2] Registration - register the user, aftersending the reply json dies
$jRet=array();
if ($inJson['dataType'] == "registration"){    
    $insData['username'] = $inJson['data']['strUn'];
    $insData['password'] = $inJson['data']['strPw'];
    $insData['emailAddress'] = $inJson['data']['strEmailAddress'];
    $insData['gender'] = $inJson['data']['strGender'];
    $insData['birthYear'] = $inJson['data']['strDateOfBirth'];  
    
    if(addUser2TableIfNotExist($cRegisteredPlayersTableName, $insData)){
        $jRet["data"]["nSuccess"] = 1;
        $_SESSION['un'] = $insData['username'];
        $_SESSION['pw'] = $insData['password'];
        
    }else{
        $jRet["data"]["nSuccess"] = 0;
        $_SESSION['errors'][]="User Exists";
    }
    
    $jRet['dataType']='registration';
    sendJson($jRet);
}
//[2]!

//[3] Authentication - Set the session un and pw, authenticate the sessions un and pw, dies after reply
$jRet=array();
if ($inJson['dataType'] == "authentication"){
    
    $_SESSION['un'] = $inJson['data']["strUn"];
    $_SESSION['pw'] = $inJson['data']["strPw"];
    
    if (sessionAuthenticated('un', 'pw', $cRegisteredPlayersTableName)){
        $jRet['data']['nSuccess'] =1;
        $_SESSION['user'] = getUserInTable($cRegisteredPlayersTableName, $_SESSION['un']);
    }
    else{
        $jRet['data']['nSuccess'] =0;
    }

    $jRet['dataType'] = 'authentication';
    sendJson($jRet);
}
 
$jRet=array();
if(!sessionAuthenticated('un', 'pw', $cRegisteredPlayersTableName)){
   
    $jRet['dataType'] = $inJson['dataType'];
    $_SESSION['errors'] = 'You are not authenticated';
    sendJson($jRet);
}
    
 //[3]!      
  
//[4] All other requests//2- gamestart//3- gameover//4- imRequest//5- annotation

switch ($inJson ['dataType']) {
	case 'gamestart':
//            startGame($inJson);
            sendJson(startGame($inJson));
            break;
        case 'gameover':
            gameOver($jsonReceived);
            break;
        case 'imRequest':
            sendJson(imRequest($jsonReceived));
            break;
        case 'annotation':
            sendJson(annotation($inJson));
            break;
	default:
		echo 'Request not recognised';		
}

function sendJson($toSend)
{
    $toSend['requestJSON'] = $_SESSION['request'];
    $toSend['errors'] = $_SESSION['errors'];
    unset($_SESSION['errors']);
    $jsonAns = json_encode($toSend,JSON_FORCE_OBJECT);
    echo $jsonAns;
    die();
}

function startGame($inJson){
    global $cRegisteredPlayersTableName;
    
    $_SESSION['thisGame']['gameStartTime']=time();
    $_SESSION['thisGame']['userInputState'] = array(); //C or I    
    $_SESSION['thisGame']['shownIms']= array();
    $_SESSION['numberOfNonShown']=0;
    
    // Increment number of played games and update the database
    $_SESSION['user']['numOfPlayedGames'] = $_SESSION['user']['numOfPlayedGames']+1;
    if (!updateUserField($cRegisteredPlayersTableName, 'numOfPlayedGames', $_SESSION['user']['numOfPlayedGames'], $_SESSION['user']['username']))
            $_SESSION['errors'] = 'could not increment the session number';
    
    return array('dataType'=>"gamestart",'data'=>array('startTime'=>$_SESSION['thisGame']['gameStartTime'], 'sessionnum'=>$_SESSION['user']['numOfPlayedGames']));
}

function gameOver($inJson){
    
}

function imRequest($inJson){
    global $cNumOfFullImsAtStart;
    
    if (
            count($_SESSION['thisGame']['shownIms']) < $cNumOfFullImsAtStart 
            || (isset($_SESSION['nextImtype']) && $_SESSION['nextImtype'] == 'full') 
            || !(isset($_SESSION['nextImtype']))
            ){
        $_SESSION['thisGame']['shownIms'][] = fetchNextIm('full');
        $_SESSION['numberOfNonShown']=0;// Holds number of shown 'non' Ims from the last shown 'full' Im
    }
    else
        $_SESSION['thisGame']['shownIms'][] = fetchNextIm($_SESSION['nextImtype']);
    
    
    // If the im state is 'full' also get the im tags, so they can be used for evaluation
    $tmpim=end($_SESSION['thisGame']['shownIms']);
    if (imState($tmpim['id']) == 'full'){
         if($tags= fetchImTags($tmpim['id'], 'c')){
//            $_SESSION['thisGame']['shownIms'][count($_SESSION['thisGame']['shownIms'])-1]['tags']=$tags;
             
             // Get the key to the last element of the array
            end($_SESSION['thisGame']['shownIms']);//set the array pointer to the last element
            $a= key($_SESSION['thisGame']['shownIms']);//get the key to the last element
            
            
            $_SESSION['thisGame']['shownIms'][$a]['tags']=$tags;
         }
                 
    }
    
    $str_path = str_replace('\\', '/', end($_SESSION['thisGame']['shownIms'])['imPath']);

    return array('dataType'=>'imRequest', 'data'=>array('images'=>array('strImAddress'=>$str_path, 'strImName'=>$str_path)));
}

function annotation($inJson){
    global $cPlayerTagTableName;
    
    // If no image is sent yet return with error
    if(!isset($_SESSION['thisGame']['shownIms']) || empty($_SESSION['thisGame']['shownIms'])){
        $_SESSION['errors'][]='No Image has been requested yet';
        return array('dataType'=>'annotation');
    }
    $dbg =1;
    // get the image name cand find the image with the same name
    $taggedIm = $inJson['data']['strTaggedImName'];
    
    $dbIm = array();
    $orderInSession = 0;
    foreach ($_SESSION['thisGame']['shownIms'] as $tmpIm){
        $tmpIm['imPath'] = str_replace('\\', '/', $tmpIm['imPath']);
        if (in_array($taggedIm, $tmpIm)){
            $dbIm = $tmpIm;
            break;
        }
        $orderInSession = $orderInSession+1;
    }
    if(empty($dbIm)){
        $_SESSION['errors'][]='This image has not been sent';
        return array('dataType'=>'annotation');
    }
    
    //If the imgage is fully annotated compare the given tag and define C,I
    if(isset($dbIm['tags']) && !empty($dbIm['tags'])){
        $producedTag = $inJson['data']['strTag'];
        $imTags = $dbIm['tags'];
        if (in_array($producedTag, $imTags)){
            $_SESSION['thisGame']['userInputState'][]='c';
        } else {
            $_SESSION['thisGame']['userInputState'][]='i';
        }
        $tagState = 'full';
    } else {
        $_SESSION['thisGame']['userInputState'][]='u';
        $tagState = 'non';
    }
                
    
    // send the C,I sequence to the trust model using the api
    $trustResult = findTrustLevel($_SESSION['thisGame']['userInputState'], 'This is my ref');
    $trustResult = json_decode($trustResult, true);
// get the result, set the score from probability, assign the type of next image
    if ($trustResult['data']['probabilityOfNextInput']<0.7){
        $_SESSION['nextImtype'] = 'full';
        $_SESSION['numberOfNonShown']=0;
    }
    elseif($trustResult['data']['probabilityOfNextInput']>0.9 && $_SESSION['numberOfNonShown']>6) {
        $_SESSION['nextImtype'] = 'full';
        $_SESSION['numberOfNonShown']=0;
    }
    elseif($trustResult['data']['probabilityOfNextInput']>0.8 && $_SESSION['numberOfNonShown']>5) {
        $_SESSION['nextImtype'] = 'full';
        $_SESSION['numberOfNonShown']=0;
    }
    elseif($trustResult['data']['probabilityOfNextInput']>0.7 && $_SESSION['numberOfNonShown']>4) {
        $_SESSION['nextImtype'] = 'full';
        $_SESSION['numberOfNonShown']=0;
    }
//    elseif ($_SESSION['numberOfNonShown']==0){// numberOfNonShown shows that the previous shown image was full, this elseif makes sures there are at least two 'full' images are shown after each other
//        $_SESSION['nextImtype'] = 'full';
//        $_SESSION['numberOfNonShown']=1;
//    }
    else{
        $_SESSION['nextImtype'] = 'non';
        $_SESSION['numberOfNonShown'] = $_SESSION['numberOfNonShown']+1;   
    }
                
     //update database
    $data['imId'] =  $dbIm['id'];
    $data['userId'] = $_SESSION['user']['id'];
    $data['tagString'] = $inJson['data']['strTag'];
    $data['tagStateWhenAppeared'] = $tagState;
    $data['tagCorrectnessProbabilty'] = $trustResult['data']['probabilityOfNextInput'];
    $data['usrSessionWhenAppeared'] = $_SESSION['user']['numOfPlayedGames'];
    $data['orderInSessionWhenAppeared'] = $orderInSession;
    $data['tagWasCorrect'] = end($_SESSION['thisGame']['userInputState']);
    
    $sql = generateInsertSQL($cPlayerTagTableName,$data);
    if (!$sql=mysql_query($sql))
    {
        $_SESSION['errors'] = mysql_error();
    } 
    // send the answer json
    
    return array('dataType'=>'annotation','nextType' => $_SESSION['nextImtype'], 'storedInDb'=>$data, 'data'=>array('nNewScore'=>$trustResult['data']['probabilityOfNextInput']*100));
}

//[I] Helper functions
//[I-1] FETCH IMAGE
/**
 * Selects one image if type $imtype='non','semi','full'. Also Checks if SESSION['uploader'] is set, 
 * only selects images that belong to the uploader
 * @param string $imtype
 * @return type
 */
function fetchNextIm( $imtype){
    global $cTagImTableName;
    if (isset($_SESSION['uploader_id']) && !empty($_SESSION['uploader_id']))
        $sql= "SELECT * from $cTagImTableName WHERE currentTagState= '$imtype' AND uploaderId = '".$_SESSION['uploader_id']."' ORDER BY RAND() LIMIT 1";
    else 
        $sql= "SELECT * from $cTagImTableName WHERE currentTagState= '$imtype' ORDER BY RAND() LIMIT 1";

    
    
    if ($myquery=mysql_query($sql)){
            $array_result= mysql_fetch_array($myquery);//Nav

                if (!empty($array_result)){
                     return $array_result;
                }
                else
                    $_SESSION['errors']='The uploader does not exist in=>fetchNextIm()';
         }
        else{
            $_SESSION['errors']=mysql_error();
        }
        
        return false;
}
//[I-1]!

//[I-2] Update field for user

/**
 * Int the table name with $tn, updates the field in the field name with the val in the $val for the user with username
 * @param type $tn - table name
 * @param type $filedname
 * @param type $val
 * @param type $un - user name
 */
function updateUserField($tn, $filedname, $val, $un){
    $sql= "UPDATE $tn SET $filedname='$val' WHERE username= '$un'";
    $myquery=mysql_query($sql);
    return $myquery;
}
//[I-2]!


//[I-3] get all the tags related to the image
function fetchImTags($imid, $tagCorrectness){
    
    global $cPlayerTagTableName;
    
    $sql= "SELECT tagString from $cPlayerTagTableName WHERE imId= '$imid' AND tagWasCorrect='$tagCorrectness' ";
   
    if ($myquery=mysql_query($sql)){
            while ($tmpTag= mysql_fetch_assoc($myquery)){
                $array_result[] = $tmpTag['tagString'];
            }

            if (!empty($array_result)){
                 return $array_result;
            }
            else
                return false;
    }
    else
       $_SESSION['errors']=mysql_error().'in=>fetchImTags()';

}
//[I-3]!

//[I-4] Check if an image is 'non', 'full', 'semi'
function imState($imid){
    global $cTagImTableName;   
    $sql= "SELECT currentTagState from $cTagImTableName WHERE id= '$imid'";
    
    if ($myquery=mysql_query($sql)){
            $array_result= mysql_fetch_array($myquery);

                if (!empty($array_result)){
                     return $array_result[0];
                }
                else
                    return false;
    }
    else
       $_SESSION['errors']=mysql_error().'in=>imState()';
}

//[I-4]!


//[I]!

