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

include_once 'imageUploaderAPI.php';



//$images[] = array('id'=>'8', 'path'=>'impath1', 'tags'=>array('tag1','tag2'));
//$images[] = array('id'=>'9', 'path'=>'impath2');
//[B1]!
//[B2] for comparison
//$pairs[] = array('pairId'=>'10', 'path1'=>'impath1','path2'=>'impath2','bSame'=>true);
//$pairs[] = array('pairId'=>'20', 'path1'=>'impath1','path2'=>'impath2','question'=>'q');
//[B2]!

//echo sendImagePairsForComparison('asd', 'asd', 'test', $pairs);
//echo sendImagesForAnnotation('asd', 'asd', 'test', $images);
echo sendImagesForAnnotation(
        'asd',
        'asd', 
        'test1', 
        createListFromPath(
                '../imageUpload/ims', 
                'localhost//SteamPilots\2\imageUpload\ims')); 