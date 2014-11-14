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

// ==============================================================================

//[A] define input and output JsonSerializable;
//[A1] input and outpu json for tagging
/*
//injson = {
//  "dataType": "tag",
//  "batchRef":"Limited to 100 chars. This is refrence to the sent batch which is returned by outjson and when an image from the batch is fully annotated",
//  "username":"un",
//  "password":"pw",
//  "tagsReadyNotificationAddress": "Limited to 500 chars. web path - post method",
//  "data": {
//    "images": [
//      {
//        "_comment": "image tag is optional that specifies if image is fully annotated with existig tags to test user trust",
//        "id": "Limited to 100 chars",
//        "path": "Limited to 500 chars. url/address",
//        "tags": [
//          "tag1",
//          "tag2"
//        ]
//      }
//    ]
//  }
//}
//outjson = {
//  "dataType": "tag",
//  "batchRef": "This is refrence to the sent batch which is returned by outjson and when an image from the batch is fully annotated",
//  "data": {
//    "nSuccess": "int",
//    "warnings": [
//      "str",
//      "str",
//      "str",
//      "..."
//    ]
//  }
//}
 */
//[A1]!
//[A2] input and output json for comparing
/*
//injson = {
//  "dataType": "comparison",
//  "username":"un",
//  "password":"pw",
//  "onReadyNotificationAddress": "web path - post method",
//  "data": {
//    "imagePairs": [
//      {
//        "_comment": "bSame tag is optional that specifies if the result of comparison is known already",
//        "pairId": "Limited to 100 chars",
//        "path1": "Limited to 500 chars",
//        "path2": "Limited to 500 chars",
//        "question":"Question to ask, Limited to 500 chars",
//        "bSame": "boolean that shows if the images are the same, if provided the pair is fully annotated"
//      }
//    ]
//  }
//}
//outson = {
//  "dataType": "compare",
//  "batchRef": "This is refrence to the sent batch which is returned by outjson and when an image from the batch is fully annotated",
//  "data": {
//    "nSuccess": "int",
//    "warnings": [
//      "str",
//      "str",
//      "str",
//      "..."
//    ]
//  }
//}
 */
//[A2]!
//[A]!

// [B] test input
if($localTest=0)
{

//[B1] for tagging
$image1 = array('id'=>'1', 'path'=>'impath1', 'tags'=>array('tag1','tag2'));
$image2 = array('id'=>'2', 'path'=>'impath2');

$jsonToSend1 =array(
            'dataType' =>'tag',
            'batchRef'=>'this is ref',
    'username'=>'asd',
    'password'=>'asd',
    'tagsReadyNotificationAddress'=>'url',
    'data'=>array('images' => array($image1,$image2)));

//[B1]!
//[B2] for comparison
$pair1 = array('pairId'=>'1', 'path1'=>'impath1','path2'=>'impath2','bSame'=>true);
$pair2 = array('pairId'=>'2', 'path1'=>'impath1','path2'=>'impath2','question'=>'q');
$jsonToSend2 = array(
    "dataType"=> "comparison",
    "username"=>"asd",
    "password"=>"asd",
    "onReadyNotificationAddress"=> "web path - post method",
    "data"=>array("imagePairs"=>array ($pair1, $pair2)));
//[B2]!
// OR
//$testJson = json_encode($jsonToSend1);
// OR
$testJson = json_encode($jsonToSend2);
}
//[B]!


include_once '../general/library/userAuthFunctions.php';
include_once '../general/library/dbfunctions.php';
include_once '../adminNext/constants.php';

//[0] constants, defines, initializations
//define("DEFAULT_THRESHOLD", 0.7);// defines a threshold that if the probability 
////of the unknown answer exceeds that answer is considered as correct
//define("DEFAULT_MODEL", 'MM');// The model that the server uses to evaluate the input
//define("DEFAULT_UI", 'u');//If no user input is provided this will be the default which produces 0 as an answer
$warnings = array();
//[0]!

//[1] Receive JSON, if the local test is true uses the local tes otherwise receives the data from post input
if ($localTest)
    $strInJson = $testJson;
else
    $strInJson = $_POST['strRequestJson'];
   
$inJson = json_decode($strInJson, true);
//[1]!

//TODO check json keys to see they exist


//[2] Authenticate the sender
if (!authenticate($cImUploaderTableName, $inJson['username'], $inJson['password'])){
    $warnings[]='You are not authenticated';
    $outJson = array('dataType'=>$inJson['dataType'], 'warnings'=>$warnings);
    sendJson($outJson);
    die();
}
$user = getUserInTable($cImUploaderTableName, $inJson['username']);

//[2]!

switch ($inJson['dataType']) {
	case 'tag':
            sendJson(addReceivedBatchToTagImTable($user['id'], $cTagImTableName, $cPlayerTagTableName, $inJson));          
            break;
        case 'comparison':
            sendJson(addReceivedBatchToComparisonImTable($user['id'],$cComparionImTableName,$cPlayerComparisonTableName,$inJson));
            break;
	default:
		echo 'Request not recognised';		
}

$dbg=1;

/**
 * Gets the input json iterates the json and adds the image-pairs to the tables
 * If enoug information are not provided mentions the missin information in the warning
 * If either pairid or path of an image is not provided adds the warning and skip the pair
 * If the image has comparison it is a fully annotated image and add it both to the comparionimtable and add the tags to playercomparisontable
 * otherwise only add it to the comparionimtable
 * @param type $uploaderId - The id of the uploader user
 * @param type $comparionImTableName - The name of the table that all the pairs for comparison go there
 * @param type $playerComparisonTableName - The name of the table that the player comparisons go there, this is for storing the comparison result of the fully annotated pairs that the uploader user sends along with non annotated pairs
 * @param type $inJson - the json that holds the pairs
 * @return string - returns a json in the format of outjson for comparison
 */
function addReceivedBatchToComparisonImTable($uploaderId, $comparionImTableName, $playerComparisonTableName, $inJson){
    $warnings= array();
    $sRet['dataType']=$inJson['dataType'];
    $sRet['data']['nSuccess']=1;
    if (isset($inJson['batchRef'])){
        $sRet['batchRef']=$inJson['batchRef'];
    } else $warnings[] = 'No batch refrence was provided';
    
    
    
    foreach ($inJson['data']['imagePairs'] as $key=>$pair) {
        // if either pairid or path of an image is not provided add the warning and skip the image
        if (!isset($pair['pairId']))   $pair['pairId'] = 'NOT PROVIDED';
        if (!isset($pair['path1']))   $pair['path1'] = 'NOT PROVIDED';
        if (!isset($pair['path2']))   $pair['path2'] = 'NOT PROVIDED';       
        if (
                !isset($pair['pairId']) 
                || !isset($pair['path1'])
                || !isset($pair['path2'])
            ){
            $warnings[] = 'For the'.$key.'th pair pairId = '.$pair['pairId'].'and path1 = '.$pair['path1'].' and path2 = '.$pair['path2'];
            $sRet['data']['nSuccess']=0;
            continue;
        }
        
        //If a question is not provided to ask from the playesrs it is replaced by the default question
        if (!isset($pair['question']) || empty($pair['question'])){
            $warnings = 'No question is provided for the '.$key
                    .'th pair with piarid='.$pair['pairId']
                    .' using the default question - Do these '
                    . 'images depict the same concept?';
            $pair['question'] = 'Do these images depict the same concept?';
        }     
        
        //If the bSame value is provided in the json file it shows that the pair is fully annotated
        //Update both comparispmimtable and playercomparisontable (the annotation) with the newly added images
        if (isset($pair['bSame']) && !empty($pair['bSame'])){
            //if fully annotated add to comparispmimtable and playercomparisontable
            unset($data);
            $data['uploaderPairId'] = $pair['pairId'];
            $data['imPath1'] = $pair['path1'];
            $data['imPath2'] = $pair['path2'];
            $data['question'] = $pair['question'];
            if (isset($inJson['batchRef']))
                $data['batchRef'] = $inJson['batchRef'];
            $data['uploaderId'] = $uploaderId;
            $data['onReadyNotificationAddress'] = $inJson['onReadyNotificationAddress'];
            $data['currentComparisonState'] = 'full';
            $data['numOfComparisons'] = 0;

            $sql = generateInsertSQL($comparionImTableName,$data);
            if (!$sql=mysql_query($sql))
            {
                $warnings[] = mysql_error ();
                $sRet['data']['nSuccess']=0;
            } else {
                unset($data);
                $data['pairId'] =  mysql_insert_id();
                $data['userId'] = 0;               
                $data['comparisonResult'] = !($pair['bSame'] == false);
                $data['stateWhenAppeared'] = '-';
                $data['correctnessProbabilty'] = 1;
                $data['usrSessionWhenAppeared'] = 0;
                $data['orderInSessionWhenAppeared'] = 0;

                $sql = generateInsertSQL($playerComparisonTableName,$data);
                if (!$sql=mysql_query($sql))
                {
                    $warnings[] = mysql_error();
                    $sRet['data']['nSuccess']=0;
                }
            }
        } else {
            //in not annotated add to comparispmimtable
            unset($data);
            $data['uploaderPairId'] = $pair['pairId'];
            $data['imPath1'] = $pair['path1'];
            $data['imPath2'] = $pair['path2'];
            $data['question'] = $pair['question'];
            if (isset($inJson['batchRef']))
                $data['batchRef'] = $inJson['batchRef'];
            $data['uploaderId'] = $uploaderId;
            $data['onReadyNotificationAddress'] = $inJson['onReadyNotificationAddress'];
            $data['currentComparisonState'] = 'non';
            $data['numOfComparisons'] = 0;

            $sql = generateInsertSQL($comparionImTableName,$data);
            if (!$sql=mysql_query($sql))
            {
                $warnings[] = mysql_error ();
                $sRet['data']['nSuccess']=0;
            }
        }
    }
    
    $sRet['warnings'] = $warnings;
    return $sRet;
}


/**
 * Gets the input json iterates the json and adds the images to the tables
 * If enoug information are not provided mentions the missin information in the warning
 * If either id or path of an image is not provided add the warning and skip the image
 * If the image has tags it is a fully annotated image and add it both to the tagimtable and add the tags to playertagtable
 * otherwise only add it to the tagimtable
 * @param type $uploaderId - The id of the uploader user
 * @param type $tagImTableName - The name of the table that all the images for tagging go there
 * @param type $playerTagTableName - The name of the table that the player tags go there, this is for storing the tags of the fully annotated images that the user sends along with non annotated images
 * @param type $inJson - the json that holds the images
 * @return string - returns a json in the format of outjson for tag
 */
function addReceivedBatchToTagImTable($uploaderId, $tagImTableName, $playerTagTableName, $inJson){
    $warnings= array();
    $sRet['dataType']=$inJson['dataType'];
    $sRet['data']['nSuccess']=1;
    if (isset($inJson['batchRef'])){
        $sRet['batchRef']=$inJson['batchRef'];
    } else $warnings[] = 'No batch refrence was provided';

    foreach ($inJson['data']['images'] as $key=>$image) {

        // if either id or path of an image is not provided add the warning and skip the image
        if (!isset($image['id']))   $image['id'] = 'NOT PROVIDED';
        if (!isset($image['path']))   $image['path'] = 'NOT PROVIDED';

        if (!isset($image['id']) || !isset($image['path'])){
            $warnings[] = 'For the'.$key.'th image id = '.$image['id'].'and path = '.$image['path'];
            $sRet['data']['nSuccess']=0;
            continue;
        }

        // If the image has tags it is a fully annotated image and add it both to the tagimtable and add the tags to playertagtable
        // otherwise only add it to the tagimtable
        if (isset($image['tags']) && count($image['tags'])>0){
            // it is a fully anotated image
            unset($data);
            $data['uploaderImId']=$image['id'];

            $data['imPath'] = $image['path'];
            if (isset($inJson['batchRef']))
                $data['batchRef'] = $inJson['batchRef'];
            $data['uploaderId'] = $uploaderId;
            $data['tagsReadyNotificationAddress'] = $inJson['tagsReadyNotificationAddress'];
            $data['currentTagState'] = 'full';       
            $data['numOfAnnotations'] = 0;

            $sql = generateInsertSQL($tagImTableName,$data);
            if (!$sql=mysql_query($sql))
            {
                $warnings[] = mysql_error ();
                $sRet['data']['nSuccess']=0;
            } else {
                $imid = mysql_insert_id();
                foreach($image['tags'] as $tag){
                    unset($data);
                    $data['imId'] =  $imid;
                    $data['userId'] = 0;
                    $data['tagString'] = $tag;
                    $data['tagStateWhenAppeared'] = '-';
                    $data['tagCorrectnessProbabilty'] = 1;
                    $data['usrSessionWhenAppeared'] = 0;
                    $data['orderInSessionWhenAppeared'] = 0;
                    $data['tagWasCorrect'] = 'c';

                    $sql = generateInsertSQL($playerTagTableName,$data);
                    if (!$sql=mysql_query($sql))
                    {
                        $warnings[] = mysql_error();
                        $sRet['data']['nSuccess']=0;
                    }
                }
            } 
        } else {
            // it is a non annotated image
            unset($data);
            $data['uploaderImId']=$image['id'];

            $data['imPath'] = $image['path'];
            if (isset($inJson['batchRef']))
                $data['batchRef'] = $inJson['batchRef'];
            $data['uploaderId'] = $uploaderId;
            $data['tagsReadyNotificationAddress'] = $inJson['tagsReadyNotificationAddress'];
            $data['currentTagState'] = 'non';       
            $data['numOfAnnotations'] = 0;

            $sql = generateInsertSQL($tagImTableName,$data);
            if (!$sql=mysql_query($sql))
            {
                $warnings[] = mysql_error ();
                $sRet['data']['nSuccess']=0;
            }
        }
        $dbg=1;
    }             
    $sRet['warnings'] = $warnings;
    return $sRet;
}

function sendJson($toSend)
{
    $jsonAns = json_encode($toSend,JSON_FORCE_OBJECT);
    echo $jsonAns;
//    die();
}