/*

The MIT License (MIT)

Copyright (c) Sat Jan 27 2018 Benjamin Karic, Jens Seifert, Jasper Buß, Eric Thieme-Garmann, Jan Speckamp

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORTOR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/** Dynamisch erzeugtes HTML für die Datasets!*/

/**
 * Creates results from the search
 *Also loeds from the permalink
 *@param res Result of the Search-request
 *@param pagetoview pagenumber that is to view
 *@param expanded For permalink: Is a dataset expanded?
 *@param band For permalink: which band is selected?
 *@param btn For permalink: Which radiobutton is selected?
 *@param bandValues For permalink: which values are entered for the band?
 *@param vis For permalink: which dataset is shown?
 *@param opacity For permalink: Whats the opacity level of the shown dataset?
 */

function createHTML(result, pagetoview, expanded, band, btn, bandValues, vis, opacity){
	//clear
	$('#resultpanel').html("");
	//loads all datasets, commits all values for permalink
	createInnerHTML(result, pagetoview, expanded, band, btn, bandValues, vis, opacity);
}

/**
 * creates a visualize option for results from the search request as an accordion
 *@param lenght number of results from search request
 *@param res Result of the Search-request
 *@param pagetoview pagenumber that is to view
 *@param expanded For permalink: Is a dataset expanded?
 *@param band For permalink: which band is selected?
 *@param btn For permalink: Which radiobutton is selected?
 *@param bandValues For permalink: which values are entered for the band?
 *@return HTML element with dataset accordion
 */
function createInnerHTML(result, pagetoview, expanded, band, btn, bandValues, vis, opacity){
	var length = result.L1C.length;
	var length2 = result.L2A.length;
    var reslength = result.L1C.length + result.L2A.length;
	
	if(opacity == undefined){
		opacity = [];
		for(var i = 0; i<(length+length2);i++){
			opacity.push(100);
		}
	}
    if(vis == undefined){
		vis = [];
		for(var i = 0; i<reslength;i++){
			vis.push("false");
		}
	}

	var k = 0;
	var l = 0;
	// Used for permalinks
	jsonForDatasets = [];

	for(i=0; i < length+length2; i++)
	{		
			if((result.L1C[l] != undefined) && (result.L2A[k] == undefined || toString(result.L1C[l].PRODUCT_URI).slice(11,26) >= toString(result.L2A[k].PRODUCT_URI_2A).slice(11,26)))
			{
				createL1CAccordion(result, pagetoview, expanded, band, btn, bandValues, i+1, l);
				//fill array for permalinks
				jsonForDatasets.push(result.L1C[l]);
				createL1CSubmitHandler(result.L1C, i+1, opacity[i], l);
				createTCISubmitHandler(result.L1C, i+1, l, false, opacity[i]);
                if(vis[i] == "true"){
                    if(btn[i][1] == "false" && btn[i][0]== "false"){
                        $('#showTCI'+(i+1)).click();
                    }else{
                        $('#showData'+(i+1)).submit();
                    }
                }
				l++;
			}
			else if(result.L1C[l] == undefined || toString(result.L1C[l].PRODUCT_URI).slice(11,26) < toString(result.L2A[k].PRODUCT_URI_2A).slice(11,26))
			{
				createL2AAccordion(result, pagetoview, expanded, band, btn, bandValues, i+1, k);
				//fill array for permalinks
				jsonForDatasets.push(result.L2A[k]);
                //create select values for S2A datasets:
				createOptions(result.L2A, i+1, k, band);
				createL2ASubmitHandler(result.L2A, i+1, opacity[i], k);
				createTCISubmitHandler(result.L2A, i+1, k, true, opacity[i]);
                if(vis[i] == "true"){
                    if(btn[i][1] == "false" && btn[i][0]== "false"){
                        $('#showTCI'+(i+1)).click();
                    }else{
                        $('#showL2AData'+(i+1)).submit();
                    }
                }
				k++;
			}
		
	}
}

function createL1CAccordion(result, pagetoview, expanded, band, btn, bandValues, i, l){
	
		var length = result.L1C.length;
		var length2 = result.L2A.length;

		//sets band to default values, if not explicitly given
		if (band == undefined || band.length == 0 || band.length < length+length2) {
			band = [];
			zerArr = ["0","0","0","0"];
			for (var j = 0; j < length+length2; j++) {
				band[j] = [];
				band[j].push(zerArr);
			}
		}
		//changes arrays for bands, so the correct is selected
		var constArray = ["0","B1","B2","B3","B4","B5","B6","B7","B8","B8a","B9","B10","B11","B12"];
		var redBand = constArray;
		var redNumber = findArray(redBand,band[i-1][1]);
		redBand[redNumber] = redBand[redNumber] + '" selected="selected';
		constArray = ["0","B1","B2","B3","B4","B5","B6","B7","B8","B8a","B9","B10","B11","B12"];
		var greenBand = constArray;
		var greenNumber = findArray(greenBand,band[i-1][2]);
		greenBand[greenNumber] = greenBand[greenNumber] + '" selected="selected';
		constArray = ["0","B1","B2","B3","B4","B5","B6","B7","B8","B8a","B9","B10","B11","B12"];
		var blueBand = constArray;
		var blueNumber = findArray(blueBand,band[i-1][3]);
		blueBand[blueNumber] = blueBand[blueNumber] + '" selected="selected';
		constArray = ["0","B1","B2","B3","B4","B5","B6","B7","B8","B8a","B9","B10","B11","B12"];
		var greyBand = constArray;
		var greyNumber = findArray(greyBand,band[i-1][0]);
		greyBand[greyNumber] = greyBand[greyNumber] + '" selected="selected';
		//sets btn to default values, if not explicitly given
		var rgbChecked = "";
		var greyChecked = "";
		if(btn != undefined && btn.length != 0){
			if (btn[i-1][0] =="true"){
				rgbChecked = "checked";
			}else if(btn[i-1][1] =="true"){
				greyChecked = "checked";
			}
		}else{
			btn = [];
			for (var j = 0; j < length+length2; j++) {
				btn.push(["false","false"]);
			}
		}
		//Sets expanded to default values, if not explicitly given
		if(expanded == undefined){
			expanded = [];
			expanded[i-1] = "out";
		}
		//Sets bandvalues to default, if not explicitly given
		if(bandValues == undefined || bandValues.length == 0){
			bandValues = [];
			for(k=0; k < length+length2; k++){
				bandValues[k] = [];
				bandValues[k][0] = [];
				bandValues[k][1] = [];
				for (var j = 0; j < 4; j++) {
					bandValues[k][0][j] = 0;
					bandValues[k][1][j] = 65536;
				}
			}
		} 

		//Sytling of accordion titles (color of badges and adding manual breaks)
		var productUri = result.L1C[l].PRODUCT_URI;
		var slicedUri = productUri.slice(0,40) +'<br>' + productUri.slice(40);

		var spacecraftname = result.L1C[l].PRODUCT_URI.slice(0, 3);
		var spacecraftbadge;
		switch(spacecraftname){
			case "S2A":
				spacecraftbadge = ' <span class="badge" style="background-color:#c67605;"> Spacecraft: ' + spacecraftname + '</span>';
				break;
			case "S2B":
				spacecraftbadge = ' <span class="badge" style="background-color:#3a87ad;"> Spacecraft: ' + spacecraftname + '</span>';
				break;
		}	

		var levelname = result.L1C[l].PRODUCT_URI.slice(7, 10);
		var levelbadge = '<span class="badge" style="background-color:#b94a48;"> Level: ' +  levelname + '</span>';

		//creates accordion with a name,  Erstellst ein Akkordion mit Namen, possibly expanded
		$('#resultpanel').append( '<div id="div'+i+'" class="panel panel-default"> <a class="text-muted" data-toggle="collapse" data-target="#dataset' + i + '"><div class="panel-heading">'+ spacecraftbadge + levelbadge +'<br/> <span style="white-space: nowrap;"> <span class="glyphicon glyphicon-open" aria-hidden="true"/> '+ slicedUri +'</span></div></a><span class="panel-body panel-collapse collapse '+expanded[i-1]+'" id="dataset'+i+'" style="padding:0;border:0px;height:450px;overflow-y:auto"> <p id="quality" style="padding: 15px; padding-bottom:0px"/> <p style="line-height: 1.5;margin-left:4%" id="l1cdatasetButton'+l+'" style="padding: 15px; padding-top: 0px"></p> '
										//creates radiobuttons,possibly selected, with corresponding bandvalues, one might have been chosen before
										+ ' <form class="colorform" id="showData' + i + '" method="POST"> <div> <button id="showTCI'+ i +'"> <span class="glyphicon glyphicon-camera" aria-hidden="true"/> Show True Color Image  </button> <br/> <br/> </div> <container> <input id="rgb'+i+'" type="radio" name="rgbbool" value="true" '+rgbChecked+' onclick="toggleDrop('+(i*2)+','+((i*2)+1)+')"/> RGB<br/> <label for="rgb" class="dropd" id="dropd'+(i*2)+'"> '
										+ ' Red band:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <select name="rcn" id="rgbselect' + ((i*3)-2)+ '"> <option disabled="disabled" value="'+redBand[0]+'">Pick a band</option> <option value="'+redBand[1]+'">Band 1</option> <option value="'+redBand[2]+'">Band 2</option> <option value="'+redBand[3]+'">Band 3</option> <option value="'+redBand[4]+'">Band 4</option> <option value="'+redBand[5]+'">Band 5</option> <option value="'+redBand[6]+'">Band 6</option> <option value="'+redBand[7]+'">Band 7</option> <option value="'+redBand[8]+'">Band 8</option> <option value="'+redBand[9]+'">Band 8a</option> <option value="'+redBand[10]+'">Band 9</option> <option value="'+redBand[11]+'">Band 10</option> <option value="'+redBand[12]+'">Band 11</option> <option value="'+redBand[13]+'">Band 12</option> </select> <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										//creates bandvalues
										+ ' Min-Value:&nbsp; <input type="number" name="rcmin" id="minRed'+i+'" placeholder="0" value="'+(bandValues[i-1][0][1])+'"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Max-Value: <input type="number" name="rcmax"  id="maxRed'+i+'" maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][1])+'"/><br/><br/> '
										+ ' Green band:&nbsp;&nbsp; <select name="gcn" id="rgbselect' + ((i*3)-1)+ '" value="0"> <option disabled="disabled" value="'+greenBand[0]+'">Pick a band</option> <option value="'+greenBand[1]+'">Band 1</option> <option value="'+greenBand[2]+'">Band 2</option> <option value="'+greenBand[3]+'">Band 3</option> <option value="'+greenBand[4]+'">Band 4</option> <option value="'+greenBand[5]+'">Band 5</option> <option value="'+greenBand[6]+'">Band 6</option> <option value="'+greenBand[7]+'">Band 7</option> <option value="'+greenBand[8]+'">Band 8</option> <option value="'+greenBand[9]+'">Band 8a</option> <option value="'+greenBand[10]+'">Band 9</option> <option value="'+greenBand[11]+'">Band 10</option> <option value="'+greenBand[12]+'">Band 11</option> <option value="'+greenBand[13]+'">Band 12</option> </select> <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Min-Value:&nbsp; <input type="number" name="gcmin" id="minGreen'+i+'" maxlength="5" placeholder="'+(bandValues[i-1][0][2])+'" value="0"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Max-Value: <input type="number" name="gcmax" id="maxGreen'+i+'" maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][2])+'"/><br/><br/> '
										+ ' Blue band:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <select name="bcn" id="rgbselect' + (i*3)+ '" value="0"> <option selected="selected" disabled="disabled" value="'+blueBand[0]+'">Pick a band</option> <option value="'+blueBand[1]+'">Band 1</option> <option value="'+blueBand[2]+'">Band 2</option> <option value="'+blueBand[3]+'">Band 3</option> <option value="'+blueBand[4]+'">Band 4</option> <option value="'+blueBand[5]+'">Band 5</option> <option value="'+blueBand[6]+'">Band 6</option> <option value="'+blueBand[7]+'">Band 7</option> <option value="'+blueBand[8]+'">Band 8</option> <option value="'+blueBand[9]+'">Band 8a</option> <option value="'+blueBand[10]+'">Band 9</option> <option value="'+blueNumber[11]+'">Band 10</option> <option value="'+blueBand[12]+'">Band 11</option> <option value="'+blueBand[13]+'">Band 12</option> </select> <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Min-Value:&nbsp; <input type="number" name="bcmin" id="minBlue'+i+'" maxlength="5" placeholder="0" value="'+(bandValues[i-1][0][3])+'"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Max-Value: <input type="number" name="bcmax" id="maxBlue'+i+'" maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][3])+'"/><br/> </label><br/> '
										+ ' <input id="grey'+i+'" type="radio" name="rgbbool" value="false" '+greyChecked+' onclick="toggleDrop('+((i*2)+1)+','+(i*2)+')"/> Greyscale<br/> <label for="grey" class="dropd" id="dropd'+((i*2)+1)+'"> '
										+ ' Choose a band:&nbsp;&nbsp; <select name="gsc" id="greyselect'+i+'" value="'+2+'"> <option selected="selected" disabled="disabled" value="'+greyBand[0]+'">Pick a band</option> <option value="'+greyBand[1]+'">Band 1</option> <option value="'+greyBand[2]+'">Band 2</option> <option value="'+greyBand[3]+'">Band 3</option> <option value="'+greyBand[4]+'">Band 4</option> <option value="'+greyBand[5]+'">Band 5</option> <option value="'+greyBand[6]+'">Band 6</option> <option value="'+greyBand[7]+'">Band 7</option> <option value="'+greyBand[8]+'">Band 8</option> <option value="'+greyBand[9]+'">Band 8a</option> <option value="'+greyBand[10]+'">Band 9</option> <option value="'+greyBand[11]+'">Band 10</option> <option value="'+greyBand[12]+'">Band 11</option> <option value="'+greyBand[13]+'">Band 12</option> </select><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Min-Value:&nbsp; <input type="number" name="greymin" id="minGrey'+i+'"maxlength="5" placeholder="0" value="'+(bandValues[i-1][0][0])+'"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Max-Value: <input type="number" name="greymax" id="maxGrey'+i+'"maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][0])+'"/><br/><br/> </label> </container> <br/> '
										//new input, gives info if its to be concerned with a S2A Dataset:
										+ ' <input type="hidden" name="l2a" value="false"> '
										//Creates submit
										+ ' <button type="submit" id="formSubmiter'+i+'" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> Show this dataset</button> </form> </span> </div>');
										//possibly selects a radio button
										if(btn[i-1][0] == "true"){
											toggleDrop((i*2),((i*2)+1));
										}else if(btn[i-1][1] == "true"){
											toggleDrop(((i*2)+1),(i*2));
										}
										//resets bandarrays
										constArray = ["0","B1","B2","B3","B4","B5","B6","B7","B8","B8a","B9","B10","B11","B12"];
										redBand = constArray;
										greenBand = constArray;
										blueBand = constArray;
										greyBand = constArray;
}


function createL2AAccordion(result, pagetoview, expanded, band, btn, bandValues, i, l){
	var length = result.L1C.length;
	var length2 = result.L2A.length;

		//sets bandValues to default, if not explicitly given
		if (band == undefined || band.length == 0 || band.length < (length+length2)) {
			band = [];
			zerArr = ["0","0","0","0"];
			for (var j = 0; j < (length+length2); j++) {
				band[j] = [];
				band[j].push(zerArr);
			}
		}
		//Sets btnvalues to default, if not explicitly given
		var rgbChecked = "";
		var greyChecked = "";
		if(btn != undefined && btn.length != 0){
			if (btn[i-1][0] =="true"){
				rgbChecked = "checked";
			}else if(btn[i-1][1] =="true"){
				greyChecked = "checked";
			}
		}else{
			btn = [];
			for (var j = 0; j < length+length2; j++) {
				btn.push(["false","false"]);
			}
		}
		//Sets expanded to default, if not explicitly given
		if(expanded == undefined){
			expanded = [];
			expanded[i-1] = "out";
		}
		//Sets bandvalues to default, if not explicitly given
		if(bandValues == undefined || bandValues.length == 0){
			bandValues = [];
		}
		//Sets bandvalues to default, if not explicitly given
		if(bandValues == undefined || bandValues.length == 0){
			bandValues = [];
			for(k=0; k < length+length2; k++){
				bandValues[k] = [];
				bandValues[k][0] = [];
				bandValues[k][1] = [];
				for (var j = 0; j < 4; j++) {
					bandValues[k][0][j] = 0;
					bandValues[k][1][j] = 65536;
				}
			}
		} 

		//Sytling of accordion titles (color of badges and adding manual breaks)
		var productUri = result.L2A[l].PRODUCT_URI_2A;
		var slicedUri = productUri.slice(0,40) +'<br>' + productUri.slice(40);

		var spacecraftname = result.L2A[l].PRODUCT_URI_2A.slice(0, 3);
		var spacecraftbadge;
		switch(spacecraftname){
			case "S2A":
				spacecraftbadge = ' <span class="badge" style="background-color:#c67605;"> Spacecraft: ' + spacecraftname + '</span>';
				break;
			case "S2B":
				spacecraftbadge = ' <span class="badge" style="background-color:#3a87ad;"> Spacecraft: ' + spacecraftname + '</span>';
				break;
		}
		
		var levelname = result.L2A[l].PRODUCT_URI_2A.slice(7, 10);
		var levelbadge = '<span class="badge" style="background-color:#468847;"> Level: ' +  levelname + '</span>';
		

		//creates accordion with name
		$('#resultpanel').append('<div id="div'+i+'" class="panel panel-default"> <a class="text-muted" data-toggle="collapse" data-target="#dataset' + i + '"> <div class="panel-heading"> '+ spacecraftbadge + levelbadge +'<br/> <span style="white-space: nowrap;"> <span class="glyphicon glyphicon-open" aria-hidden="true"/>' + slicedUri + '</span></div></a><span class="panel-body panel-collapse collapse '+expanded[i-1]+'" id="dataset'+i+'"><p id="quality" style="padding: 15px; padding-bottom:0px"/><p style="line-height: 1.5;margin-left:4%;" id="l2adatasetButton'+l+'" style="padding: 15px; padding-top: 0px"></p><form class="colorform" id="showL2AData' + i + '" method="POST">'
										+ '  <div> <button class="btn btn-primary" style="background-color: #D3D3D3;color:#000000;border-color:#c7c7c7;" id="showTCI'+ i +'"> <span class="glyphicon glyphicon-camera" aria-hidden="true"/> Show True Color Image </button> <br/> <br/> </div> <container><input id="rgb'+i+'" type="radio" name="rgbbool" value="true" '+rgbChecked+' onclick="toggleDrop('+(i*2)+','+((i*2)+1)+')"/> RGB<br/><label for="rgb" class="dropd" id="dropd'+(i*2)+'">'
										+'Red band:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<select name="rcn" id="rgbselect' + ((i*3)-2) + '"></select>'
											+'<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Min-Value:&nbsp; <input type="number" name="rcmin" id="minRed'+i+'" placeholder="0" value="'+(bandValues[i-1][0][1])+'"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Max-Value: <input type="number" name="rcmax"  id="maxRed'+i+'" maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][1])+'"/><br/><br/>'
										+'Green band:&nbsp;&nbsp;<select name="gcn" id="rgbselect' + ((i*3)-1)+ '" value="0"></select><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Min-Value:&nbsp; <input type="number" name="gcmin" id="minGreen'+i+'" maxlength="5" placeholder="'+(bandValues[i-1][0][2])+'" value="0"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Max-Value: <input type="number" name="gcmax" id="maxGreen'+i+'" maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][2])+'"/><br/><br/>'
										+'Blue band:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<select name="bcn" id="rgbselect' + (i*3)+ '" value="0"></select><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Min-Value:&nbsp; <input type="number" name="bcmin" id="minBlue'+i+'" maxlength="5" placeholder="0" value="'+(bandValues[i-1][0][3])+'"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Max-Value: <input type="number" name="bcmax" id="maxBlue'+i+'" maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][3])+'"/><br/></label><br/>'
											+'<input id="grey'+i+'" type="radio" name="rgbbool" value="false" '+greyChecked+' onclick="toggleDrop('+((i*2)+1)+','+(i*2)+')"/> Greyscale<br/><label for="grey" class="dropd" id="dropd'+((i*2)+1)+'">'
										+'Choose a band:&nbsp;&nbsp;<select name="gsc" id="greyselect'+i+'" value="'+2+'"></select><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Min-Value:&nbsp; <input type="number" name="greymin" id="minGrey'+i+'"maxlength="5" placeholder="0" value="'+(bandValues[i-1][0][0])+'"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Max-Value: <input type="number" name="greymax" id="maxGrey'+i+'"maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][0])+'"/><br/><br/></label></container><br/>'
										//neuer Input, gibt an ob es sich um ein S2A Dataset handelt:
										+ ' <input type="hidden" name="l2a" value="true"> '
										+ '<button type="submit" id="formSubmiter'+i+'" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> Show this dataset</button></form></span></div>');
										if(btn[i-1][0] == "true"){
											toggleDrop((i*2),((i*2)+1));
										}else if(btn[i-1][1] == "true"){
											toggleDrop(((i*2)+1),(i*2));
										}
}

/**
 * creates HTML-Element with metadata from each dataset for each dataset
 * fills Dropdownmenues of S2A datasets
 *@param res result from search request
 *@param page current pagenumber
 */
function visualizeMetadata(result, page, band, vis){

	//Number for polygon
	var number = 0;

	//Used for polygon creation
	polyLayer.clearLayers();

	var res = result.L1C;
	var resL2A = result.L2A;

	//iterate through "res" and create accordions fill them with metadata


	for(i=0; i < res.length; i++){
		//HTML-Element is filled with metadata
		$('#l1cdatasetButton' + (i)).html(formatMetadata(res[i]));

		//Use for Polygoncreation
		drawPolygon(res, i, page, number, res.length);
		number++;
	};

	for(i=0; i< resL2A.length; i++){
        //HTML-Element is filled with metadata
		$('#l2adatasetButton' + (i)).html(formatMetadata(resL2A[i]));

		//Use for Polygoncreation
		drawPolygon(resL2A, i, page, number, (res.length + resL2A.length));
		number++;
	};

	//Submit for L2A Datasets
	for(j=res.length; j<(res.length + resL2A.length); j++){
		if(vis == undefined){
			vis = [];
			for(var k = 0; k<(res.length + resL2A.length);k++){
				vis.push("false");
			}
		}
	}
}

/**
 * formats raw metadata to be readable
 *@param metadata Object to be formatted
 */
function formatMetadata(metadata){
    var html = ""
    Object.keys(metadata).forEach(function(key){
        var value = metadata[key];
        
        // Edge case for Bandnames that are split manually
        if (key == "R10M" || key == "R20M" || key == "R60M") {
            html += "<b>" + key + ":</b> </br>" + toString(metadata[key]).replace(/,/g, "<br/>" ) +  "</br>"
            return
        }
        // preprocess Keys to be readable
        key = readableMetadataKey(key)

        // preprocess value to be readable
        // If Value + Key is less than 40 write in one line
        if (value.length <= 49 || key === "Footprint") {
                html += "<b>" + key + ": </b>" + value + "<br/>";
        // else split
        } else {
            html += "<b>" + key + ": </b><br/>";
            var leftover = value;
            // Cut after 40 characters
            while (leftover.length > 40){
                html += leftover.slice(0,40) + "<br/>";
                leftover = leftover.slice(40);
            }
            html += leftover + "<br/>";
        }
    });
    return html;
}

/**
 * formats and returns string to be all lowercase with first letter uppercase
 * if string is not on blacklist
 *@param key string to be formatted
 */
function readableMetadataKey(key){
    var blacklist = ["AOT", "L1C", "L2A", "ID", "URL", "URI", "MSI", "ANC"]
    var result = "";
    key.split("_", 5).forEach(function(x){
        if (blacklist.indexOf(x) == -1) {
            result += x.charAt(0) + x.slice(1).toLowerCase() + " "
        } else {
            result += x + " "
        }
    });
    return result.slice(0, result.length-1)
}


function addL2AOptions(result, id, array, j, band, firstband){
  for(var i = 0; i < array.length; i = i + 2){
   $("#"+id)[0].options[$("#"+id)[0].options.length] = new Option(array[i],result[j][array[1]][array[i+1]]);
   if(i == 0){
     $("#"+id)[0].options[$("#"+id)[0].options.length-1].disabled = "true";
   }
	 //Selector for permalink
	 if(band != undefined){
		 for(var k = 0; k < band.length; k++) {
             if(band[k][firstband] == result[j][array[1]][array[i+1]]){
                $("#"+id)[0].options[$("#"+id)[0].options.length-1].selected = "selected";
             }
		 }
	 }
  }
}

function toString(obj){
	return ("" + obj);
}

function createOptions(resL2A, k, i, band){
				var arr10m = ["Resolution 10 Meter:", "R10M", "Band AOT", 0, "Band 2", 1, "Band 3", 2 , "Band 4", 3,  "Band WVP", 6 , "Band 8", 4];
				var arr20m = ["Resolution 20 Meter:", "R20M", "Band AOT", 0, "Band 2", 1, "Band 3", 2 , "Band 4", 3, "Band 5", 4, "Band 6", 5, "Band 7", 6, "Band SCL", 10, "Band 8a", 9, "Band 11", 7, "Band 12", 8, "Band VIS", 12, "Band WVP", 13];
				var arr60m = ["Resolution 60 Meter:", "R60M", "Band AOT", 0, "Band 1", 1, "Band 2", 2, "Band 3", 3, "Band 4", 4, "Band 5", 5, "Band 6", 6, "Band 7", 7, "Band 9", 8, "Band 11", 9, "Band 12", 10, "Band 8a", 11, "Band SCL", 12, "Band WVP", 14]
				$("#rgbselect"+((k*3)-2))[0].options[$("#rgbselect"+((k*3)-2))[0].options.length] = new Option("Pick a Band", "");
				$("#rgbselect"+((k*3)-2))[0].options[$("#rgbselect"+((k*3)-2))[0].options.length-1].disabled = "true";
				addL2AOptions(resL2A, ("rgbselect"+((k*3)-2)), arr60m, i,band,1);
				addL2AOptions(resL2A, ("rgbselect"+((k*3)-2)), arr20m, i,band,1);
				addL2AOptions(resL2A, ("rgbselect"+((k*3)-2)), arr10m, i,band,1);
				$("#rgbselect"+((k*3)-1))[0].options[$("#rgbselect"+((k*3)-1))[0].options.length] = new Option("Pick a Band", "");
				$("#rgbselect"+((k*3)-1))[0].options[$("#rgbselect"+((k*3)-1))[0].options.length-1].disabled = "true";
				addL2AOptions(resL2A, ("rgbselect"+((k*3)-1)), arr60m, i,band,2);
				addL2AOptions(resL2A, ("rgbselect"+((k*3)-1)), arr20m, i,band,2);
				addL2AOptions(resL2A, ("rgbselect"+((k*3)-1)), arr10m, i,band,2);
				$("#rgbselect"+(k*3))[0].options[$("#rgbselect"+(k*3))[0].options.length] = new Option("Pick a Band", "");
				$("#rgbselect"+(k*3))[0].options[$("#rgbselect"+(k*3))[0].options.length-1].disabled = "true";
				addL2AOptions(resL2A, ("rgbselect"+(k*3)), arr60m, i,band,3);
				addL2AOptions(resL2A, ("rgbselect"+(k*3)), arr20m, i,band,3);
				addL2AOptions(resL2A, ("rgbselect"+(k*3)), arr10m, i,band,3);
				$("#greyselect"+k)[0].options[$("#greyselect"+k)[0].options.length] = new Option("Pick a Band", "");
				$("#greyselect"+k)[0].options[$("#greyselect"+k)[0].options.length-1].disabled = "true";
				addL2AOptions(resL2A, ("greyselect"+k), arr60m, i,band,0);
				addL2AOptions(resL2A, ("greyselect"+k), arr20m, i,band,0);
				addL2AOptions(resL2A, ("greyselect"+k), arr10m, i,band,0);
}


/**
 *shows and hides elements
 *called on radio buttons
 *@param i element, to be shown
 *@param j element, to be hidden
 */
function toggleDrop(i,j){
	$('#dropd'+i).show();
	$('#dropd'+j).hide();
}
