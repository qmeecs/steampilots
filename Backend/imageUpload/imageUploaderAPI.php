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
//  "batchRef":"Limited to 100 chars. This is refrence to the sent batch which is returned by outjson and when an image from the batch is fully annotated",
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
/**
 * Sends the JSON file of the pairs of images for evaluation
 * @param type $username
 * @param type $password
 * @param type $onReadyNotificationAddress
 * @param type $pairs
 * @param type $url
 * @param type $batchRef
 * @return type
 */
function sendImagePairsForComparison($username, $password, $onReadyNotificationAddress, $pairs ,$url = 'http://localhost/SteamPilots/2/imageUpload/imageUploaderService.php', $batchRef=''){
    $jsonToSend = array(
        "dataType"=> "comparison",
        'batchRef'=>$batchRef,
        "username"=>$username,
        "password"=>$password,
        "onReadyNotificationAddress"=> $onReadyNotificationAddress,
        "data"=>array('imagePairs'=>$pairs));
    
    $jsonToSend = json_encode($jsonToSend);
    $toSend = array(
                'strRequestJson' => $jsonToSend
            );

    return postArrayGetJSON($url, $toSend); 
}

/**
 * Sends list of images for annotation
 * @param type $username
 * @param type $password
 * @param type $tagsReadyNotificationAddress
 * @param type $images
 * @param type $url
 * @param type $batchRef
 * @return type
 */
function sendImagesForAnnotation($username, $password, $tagsReadyNotificationAddress, $images ,$url = 'http://localhost/SteamPilots/2/imageUpload/imageUploaderService.php', $batchRef=''){
    
    $jsonToSend =array(
        'dataType' =>'tag',
        'batchRef'=>$batchRef,
        'username'=>$username,
        'password'=>$password,
        'tagsReadyNotificationAddress'=>$tagsReadyNotificationAddress,
        'data'=>array('images'=>$images));
    
    $jsonToSend = json_encode($jsonToSend);
    $toSend = array(
                'strRequestJson' => $jsonToSend
            );

    return postArrayGetJSON($url, $toSend);   
}

function postArrayGetJSON($url, $toSend){

//url-ify the data for the POST
$field_string = http_build_query($toSend);

//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, 1);
curl_setopt($ch,CURLOPT_POSTFIELDS, $field_string);
curl_setopt($ch,CURLOPT_RETURNTRANSFER , true);// if there was an echo return it

//execute post
$result = curl_exec($ch);

//close connection
curl_close($ch);

return $result;
}


/**
 * gets the path to directory finds all the images in the directory, 
 * finds their tags in the textfiles with the same name, creats a json to be sent to the game server
 * @param type $path - directory that holds the images
 * @param type $webloc - the url that is prepended to the name of all images to make a full address link for the image accessible via web
 * @return type
 */
function createListFromPath($path, $webloc){
    
    $pathlength = strlen($path);    
    $fimlist = recursivelyIterateDirForImages($path, array('jpg','png', 'gif', 'giff', 'tif', 'tiff'));
    $ftaglist = recursivelyIterateDirForImages($path, array('txt'));
    
    $id = 0;
    foreach ($fimlist as $value){
        $fextension = end(explode(".", $value['file']));
        $fbname = basename($value['file'], '.'.$fextension);
        
        $tagsFile = array();
        foreach ($ftaglist as $ftagfile){
            if (in_array($fbname.'.txt', $ftagfile) && in_array($value['dir'], $ftagfile)){
                $tagsFile = $ftagfile;
                break;
            }
        }
        
        if (!$value['dir'] = substr($value['dir'], $pathlength))
                $value['dir'] = $webloc;
        else 
            $dvalue['dir'] = $webloc.$value['dir'];
        
        if (!empty($tagsFile)){
            
            $images[] = array('id'=>$id, 'path'=>$value['dir'].'/'.$value['file'], 'tags'=>getTagsFromFile($tagsFile['dir'].'/'.$tagsFile['file']));
        }
        else
            $images[] = array('id'=>$id, 'path'=>$value['dir'].'/'.$value['file']);
         
        
        
        $id = $id+1;
    }
    return($images);
}



function getTagsFromFile($path){
    $ret = array();
    $handle = fopen($path, "r");
    if ($handle) {
        while (($line = fgets($handle)) !== false) {
            // process the line read.
            $ret[]=$line;
        }
    } else {
        // error opening the file.
    } 
    fclose($handle);
    
    return $ret;
}


function recursivelyIterateDirForImages($dir, $ftypes){
    $regexp = '/';
    foreach ($ftypes as $value) {
        $regexp = $regexp.'.'.$value.'|';  
    }
    $regexp =rtrim($regexp, "|");
    $regexp = $regexp.'/i';
            
    $fileList=array();
    $dirHandle = opendir($dir); 

    while ($file = readdir($dirHandle)) {

            if ($file!='..' && $file!='.'){
                    if (is_dir($dir.'/'.$file)){
                            $childDir=$dir.'/'.$file;
                            $tmp_fileList=recursivelyIterateDirForImages($childDir, $ftypes);
                            $fileList=array_merge($fileList,$tmp_fileList);
                    }elseif(preg_match($regexp, $file)){
                            $fileList[]=array("dir"=>$dir,"file"=>$file );
                    }
            }	

    }
    closedir($dirHandle);
    return $fileList;
}