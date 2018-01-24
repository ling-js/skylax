/** Dynamisch erzeugtes HTML für die Datasets!*/

/**
 * Erstellt die Resultate aus der Suche.
 * Lädt auch aus dem Permalink.
 *@param res Ergebniss aus Suchanfrage
 *@param pagetoview Seitenzahl, die angezeigt werden soll
 *@param expanded Für Permalink: Ist ein Dataset expanded?
 *@param band Für Permalink: Welches Band ist ausgwählt?
 *@param btn Für Permalink: Welcher Radiobtn ist ausgewählt?
 *@param bandValues Für Permalink: Welche Werte sind für die Bänder eingetragen?
 *@param vis Für Permalink: Welches Dataset ist angezeigt?
 *@param opacity Für Permalink: Wie ist die Opacity des angezeigten Datasets?
 */

function createHTML(result, pagetoview, expanded, band, btn, bandValues, vis, opacity){
	var reslength = result.L1C.length + result.L2A.length;
	var L1Clength = result.L1C.length;
	var L2Alength = result.L2A.length;

	//Zurücksetzen
	$('#one').html("");
	//Lädt alles Datasets, übergibt Werte für Permalink
	$('#one').html('<div class="panel-panel-default" id="resultpanel">'
	+ createInnerHTML(result, pagetoview, expanded, band, btn, bandValues) + '</div>');
	//Setzt Opacity und Vis auf Standardwerte, wenn nicht angegeben
	if(opacity == undefined){
		opacity = [];
		for(var i = 0; i<reslength;i++){
			opacity.push(100);
		}
	}
	if(vis == undefined){
		vis = [];
		for(var i = 0; i<reslength;i++){
			vis.push("false");
		}
	}
	//Erstellt Sumbit Buttons für jedes Dataset
	for(j=1; j<(L1Clength+1); j++){
		 createL1CSubmitHandler(result.L1C, j, opacity[j-1]);
		 if(vis[j-1] == "true"){
			 $('#showData'+j).submit();
		 }
	}
	for(j=L1Clength+1; j<(reslength+1); j++){
		var i = j-L1Clength;
		createL2ASubmitHandler(result.L2A, j, opacity[j-1], i);
		if(vis[j-1] == "true"){
			 $('#showL2AData'+j).submit();
		}
	}
}

/**
 * Erstellt die Anzeigemöglichkeit für Resultate aus der Suche als Akkordion einzeln.
 *@param lenght Anzahl der Ergebniss aus Suchanfrage
 *@param pagetoview Seitenzahl, die angezeigt werden soll
 *@param expanded Für Permalink: Ist ein Dataset expanded?
 *@param band Für Permalink: Welches Band ist ausgwählt?
 *@param btn Für Permalink: Welcher Radiobtn ist ausgewählt?
 *@param bandValues Für Permalink: Welche Werte sind für die Bänder eingetragen?
 *@return HTML Element mit einem Datasetakkordion.
 */
function createInnerHTML(result, pagetoview, expanded, band, btn, bandValues){
	var length = result.L1C.length;
	var length2 = result.L2A.length;
	var arr10m = ["Resolution 10 Meter:", "R10M", "Band AOT", "[0]", "Band 2", "[1]", "Band 3", "[2]" , "Band 4", "[3]", "Band TCI", "[5]",  "Band WVP", "[6]" , "Band 8", "[4]"];
	var arr20m = ["Resolution 20 Meter:", "R20M", "Band AOT", "[0]", "Band 2", "[1]", "Band 3", "[2]" ,"Band 4", "[3]", "Band 5","[4]", "Band 6","[5]", "Band 7","[6]", "Band SCL","[10]", "Band 8a","[9]", "Band TCI","[11]", "Band 11","[7]", "Band 12","[8]", "Band VIS","[12]", "Band WVP", "[13]"];
	var arr60m = ["Resolution 60 Meter:", "R60M", "Band AOT", "[0]", "Band 1", "[1]", "Band 2", "[2]" ,"Band 3", "[3]", "Band 4","[4]", "Band 5","[5]", "Band 6","[6]", "Band 7","[7]", "Band 9","[8]", "Band 11","[9]", "Band 12","[10]", "Band 8a","[11]", "Band SCL","[12]", "Band TCI", "[13]", "Band WVP", "[14]"]



	for(i=1;i < length+1; i++){
		//Setzt band auf Standardwerte, wenn nicht angegeben
		if (band == undefined || band.length == 0 || band.length < length) {
			band = [];
			zerArr = ["0","0","0","0"];
			for (var j = 0; j < length; j++) {
				band[j] = [];
				band[j].push(zerArr);
			}
		}
		//verändert die Array für die Bänder, damit das richitge selected wird
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
		//Setzt btn auf Standardwerte, wenn nicht angegeben
		//Ansonsten werden die Werte übernommen und gesetzt
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
			for (var j = 0; j < length; j++) {
				btn.push(["false","false"]);
			}
		}
		//Setzt expanded auf Standardwerte, wenn nicht angegeben
		if(expanded == undefined){
			expanded = [];
			expanded[i-1] = "out";
		}
		//Setzt bandvalues auf Standardwerte, wenn nicht angegeben
		if(bandValues == undefined || bandValues.length == 0){
			bandValues = [];
			for(k=0; k < length; k++){
				bandValues[k] = [];
				bandValues[k][0] = [];
				bandValues[k][1] = [];
				for (var j = 0; j < 4; j++) {
					bandValues[k][0][j] = 0;
					bandValues[k][1][j] = 65536;
				}
			}
		}

		//Erstellst ein Akkordion mit Namen,ggf. ausgefahren
		$('#one').html($('#one').html() + '<div class="panel panel-default"> <a class="text-muted" data-toggle="collapse" data-target="#dataset' + i + '"><div class="panel-heading"><span class="glyphicon glyphicon-open" aria-hidden="true"></span> Dataset '+ (8*(pagetoview-1)+i) +'</div></a><span class="panel-body panel-collapse collapse '+expanded[i-1]+'" id="dataset'+i+'"> <p id="quality" style="padding: 15px; padding-bottom:0px">Metadata:</p> <p id="datasetButton'+i+'" style="padding: 15px; padding-top: 0px"></p> '
										//Erstellt Radiobuttons,ggf. angeklickt,mit den dazugehörigen bandValues, ggf. wird eins schon vorher ausgewählt
										+ ' <form class="colorform" id="showData' + i + '" method="POST"> <container> <input id="rgb'+i+'" type="radio" name="rgbbool" value="true" '+rgbChecked+' onclick="toggleDrop('+(i*2)+','+((i*2)+1)+')"/> RGB<br/> <label for="rgb" class="dropd" id="dropd'+(i*2)+'"> '
										+ ' Red band:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <select name="rcn" id="rgbselect' + ((i*3)-2)+ '"> <option disabled="disabled" value="'+redBand[0]+'">Pick a band</option> <option value="'+redBand[1]+'">Band 1</option> <option value="'+redBand[2]+'">Band 2</option> <option value="'+redBand[3]+'">Band 3</option> <option value="'+redBand[4]+'">Band 4</option> <option value="'+redBand[5]+'">Band 5</option> <option value="'+redBand[6]+'">Band 6</option> <option value="'+redBand[7]+'">Band 7</option> <option value="'+redBand[8]+'">Band 8</option> <option value="'+redBand[9]+'">Band 8a</option> <option value="'+redBand[10]+'">Band 9</option> <option value="'+redBand[11]+'">Band 10</option> <option value="'+redBand[12]+'">Band 11</option> <option value="'+redBand[13]+'">Band 12</option> </select> <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										//Erstellt die bandValues, ggf. mit anderem Wert
										+ ' Min-Value: <input type="number" name="rcmin" id="minRed'+i+'" placeholder="0" value="'+(bandValues[i-1][0][1])+'"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Max-Value: <input type="number" name="rcmax"  id="maxRed'+i+'" maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][1])+'"/><br/><br/> '
										+ ' Green band:&nbsp;&nbsp; <select name="gcn" id="rgbselect' + ((i*3)-1)+ '" value="0"> <option disabled="disabled" value="'+greenBand[0]+'">Pick a band</option> <option value="'+greenBand[1]+'">Band 1</option> <option value="'+greenBand[2]+'">Band 2</option> <option value="'+greenBand[3]+'">Band 3</option> <option value="'+greenBand[4]+'">Band 4</option> <option value="'+greenBand[5]+'">Band 5</option> <option value="'+greenBand[6]+'">Band 6</option> <option value="'+greenBand[7]+'">Band 7</option> <option value="'+greenBand[8]+'">Band 8</option> <option value="'+greenBand[9]+'">Band 8a</option> <option value="'+greenBand[10]+'">Band 9</option> <option value="'+greenBand[11]+'">Band 10</option> <option value="'+greenBand[12]+'">Band 11</option> <option value="'+greenBand[13]+'">Band 12</option> </select> <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Min-Value: <input type="number" name="gcmin" id="minGreen'+i+'" maxlength="5" placeholder="'+(bandValues[i-1][0][2])+'" value="0"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Max-Value: <input type="number" name="gcmax" id="maxGreen'+i+'" maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][2])+'"/><br/><br/> '
										+ ' Blue band:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <select name="bcn" id="rgbselect' + (i*3)+ '" value="0"> <option selected="selected" disabled="disabled" value="'+blueBand[0]+'">Pick a band</option> <option value="'+blueBand[1]+'">Band 1</option> <option value="'+blueBand[2]+'">Band 2</option> <option value="'+blueBand[3]+'">Band 3</option> <option value="'+blueBand[4]+'">Band 4</option> <option value="'+blueBand[5]+'">Band 5</option> <option value="'+blueBand[6]+'">Band 6</option> <option value="'+blueBand[7]+'">Band 7</option> <option value="'+blueBand[8]+'">Band 8</option> <option value="'+blueBand[9]+'">Band 8a</option> <option value="'+blueBand[10]+'">Band 9</option> <option value="'+blueNumber[11]+'">Band 10</option> <option value="'+blueBand[12]+'">Band 11</option> <option value="'+blueBand[13]+'">Band 12</option> </select> <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Min-Value: <input type="number" name="bcmin" id="minBlue'+i+'" maxlength="5" placeholder="0" value="'+(bandValues[i-1][0][3])+'"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Max-Value: <input type="number" name="bcmax" id="maxBlue'+i+'" maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][3])+'"/><br/> </label><br/> '
										+ ' <input id="grey'+i+'" type="radio" name="rgbbool" value="false" '+greyChecked+' onclick="toggleDrop('+((i*2)+1)+','+(i*2)+')"/> Greyscale<br/> <label for="grey" class="dropd" id="dropd'+((i*2)+1)+'"> '
										+ ' Choose a band:&nbsp;&nbsp; <select name="gsc" id="greyselect'+i+'" value="'+2+'"> <option selected="selected" disabled="disabled" value="'+greyBand[0]+'">Pick a band</option> <option value="'+greyBand[1]+'">Band 1</option> <option value="'+greyBand[2]+'">Band 2</option> <option value="'+greyBand[3]+'">Band 3</option> <option value="'+greyBand[4]+'">Band 4</option> <option value="'+greyBand[5]+'">Band 5</option> <option value="'+greyBand[6]+'">Band 6</option> <option value="'+greyBand[7]+'">Band 7</option> <option value="'+greyBand[8]+'">Band 8</option> <option value="'+greyBand[9]+'">Band 8a</option> <option value="'+greyBand[10]+'">Band 9</option> <option value="'+greyBand[11]+'">Band 10</option> <option value="'+greyBand[12]+'">Band 11</option> <option value="'+greyBand[13]+'">Band 12</option> </select><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Min-Value: <input type="number" name="greymin" id="minGrey'+i+'"maxlength="5" placeholder="0" value="'+(bandValues[i-1][0][0])+'"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; '
										+ ' Max-Value: <input type="number" name="greymax" id="maxGrey'+i+'"maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][0])+'"/><br/><br/> </label> </container> <br/> '
										//neuer Input, gibt an ob es sich um ein S2A Dataset handelt:
										+ ' <input type="hidden" name="l2a" value="false"> '
										//Erstellt Submit Button
										+ ' <button type="submit" id="formSubmiter'+i+'" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> Show this dataset</button> </form> </span> </div>');
										//Klickt ggf. Radio Button an
										if(btn[i-1][0] == "true"){
											toggleDrop((i*2),((i*2)+1));
										}else if(btn[i-1][1] == "true"){
											toggleDrop(((i*2)+1),(i*2));
										}
										//Setzt Bandarrays zurück
										constArray = ["0","B1","B2","B3","B4","B5","B6","B7","B8","B8a","B9","B10","B11","B12"];
										redBand = constArray;
										greenBand = constArray;
										blueBand = constArray;
										greyBand = constArray;
	}


	for(i=length+1;i < (length+length2+1); i++){

		//Setzt band auf Standardwerte, wenn nicht angegeben
		if (band == undefined || band.length == 0 || band.length < (length+length2)) {
			band = [];
			zerArr = ["0","0","0","0"];
			for (var j = 0; j < (length+length2); j++) {
				band[j] = [];
				band[j].push(zerArr);
			}
		}
		//Setzt btn auf Standardwerte, wenn nicht angegeben
		//Ansonsten werden die Werte übernommen und gesetzt
		var rgbChecked = "";
		var greyChecked = "";
		if(btn == undefined || btn.length == 0){
				btn = [];
		}
		if(btn[i-1] != undefined && btn.length > length){
			if (btn[i-1][0] =="true"){
				rgbChecked = "checked";
			}else if(btn[i-1][1] =="true"){
				greyChecked = "checked";
			}
		}else{
			for (var j = length; j < length+length2; j++) {
				btn.push(["false","false"]);
			}
		}
		//Setzt expanded auf Standardwerte, wenn nicht angegeben
		if(expanded == undefined){
			expanded = [];
			expanded[i-1] = "out";
		}
		//Setzt bandvalues auf Standardwerte, wenn nicht angegeben

		if(bandValues == undefined || bandValues.length == 0){
			bandValues = [];
		}
		if(bandValues[i] == undefined || bandValues.length < length+1){
			for(k=length; k < (length+length2); k++){
				bandValues[k] = [];
				bandValues[k][0] = [];
				bandValues[k][1] = [];
				for (var j = 0; j < 4; j++) {
					bandValues[k][0][j] = 0;
					bandValues[k][1][j] = 65536;
				}
			}
		}

		//Erstellst ein Akkordion mit Namen,ggf. ausgefahren
		$('#one').html($('#one').html() + '<div class="panel panel-default"><a class="text-muted" data-toggle="collapse" data-target="#dataset' + i + '"><div class="panel-heading"><span class="glyphicon glyphicon-open" aria-hidden="true"></span> Dataset '+ (8*(pagetoview-1)+i) +'</div></a><span class="panel-body panel-collapse collapse '+expanded[i-1]+'" id="dataset'+i+'"><p id="quality" style="padding: 15px; padding-bottom:0px">Metadata:</p><p id="datasetButton'+i+'" style="padding: 15px; padding-top: 0px"></p><form class="colorform" id="showL2AData' + i + '" method="POST"><container><input id="rgb'+i+'" type="radio" name="rgbbool" value="true" '+rgbChecked+' onclick="toggleDrop('+(i*2)+','+((i*2)+1)+')"/> RGB<br/><label for="rgb" class="dropd" id="dropd'+(i*2)+'">'
										+'Red band:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<select name="rcn" id="rgbselect' + ((i*3)-2) + '"></select>'
											+'<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Min-Value: <input type="number" name="rcmin" id="minRed'+i+'" placeholder="0" value="'+(bandValues[i-1][0][1])+'"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Max-Value: <input type="number" name="rcmax"  id="maxRed'+i+'" maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][1])+'"/><br/><br/>'
										+'Green band:&nbsp;&nbsp;<select name="gcn" id="rgbselect' + ((i*3)-1)+ '" value="0"></select><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Min-Value: <input type="number" name="gcmin" id="minGreen'+i+'" maxlength="5" placeholder="'+(bandValues[i-1][0][2])+'" value="0"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Max-Value: <input type="number" name="gcmax" id="maxGreen'+i+'" maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][2])+'"/><br/><br/>'
										+'Blue band:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<select name="bcn" id="rgbselect' + (i*3)+ '" value="0"></select><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Min-Value: <input type="number" name="bcmin" id="minBlue'+i+'" maxlength="5" placeholder="0" value="'+(bandValues[i-1][0][3])+'"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Max-Value: <input type="number" name="bcmax" id="maxBlue'+i+'" maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][3])+'"/><br/></label><br/>'
											+'<input id="grey'+i+'" type="radio" name="rgbbool" value="false" '+greyChecked+' onclick="toggleDrop('+((i*2)+1)+','+(i*2)+')"/> Greyscale<br/><label for="grey" class="dropd" id="dropd'+((i*2)+1)+'">'
										+'Choose a band:&nbsp;&nbsp;<select name="gsc" id="greyselect'+i+'" value="'+2+'"></select><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Min-Value: <input type="number" name="greymin" id="minGrey'+i+'"maxlength="5" placeholder="0" value="'+(bandValues[i-1][0][0])+'"/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Max-Value: <input type="number" name="greymax" id="maxGrey'+i+'"maxlength="5" placeholder="65536" value="'+(bandValues[i-1][1][0])+'"/><br/><br/></label></container><br/>'
										//neuer Input, gibt an ob es sich um ein S2A Dataset handelt:
										+ ' <input type="hidden" name="l2a" value="true"> '
										+ '<button type="submit" id="formSubmiter'+i+'" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span> Show this dataset</button></form></span></div>');
										if(btn[i-1][0] == "true"){
											toggleDrop((i*2),((i*2)+1));
										}else if(btn[i-1][1] == "true"){
											toggleDrop(((i*2)+1),(i*2));
										}
										//Setzt Bandarrays zurück
										/*constArray = ["0","B1","B2","B3","B4","B5","B6","B7","B8","B8a","B9","B10","B11","B12"];
										redBand = constArray;
										greenBand = constArray;
										blueBand = constArray;
										greyBand = constArray;*/

	}


	return $('#one').html();
}







/**
 * Erstllt HTML-Element mit den Metadaten von jedem Dateset für jedes Dataset an
 * Befüllt die Dropdownmenues der S2A Datensätze
 *@param res Ergebnisse aus Suchanfrage
 *@param page Aktuelle Seitenzahl
 */
function visualizeMetadata(result, page, band, vis){

	// Used for permalinks
	jsonForDatasets = [];

	//Number for polygon
	var number = 0;

	//Used for polygon creation
	polyLayer.clearLayers();

	var res = result.L1C;
	var resL2A = result.L2A;

	//iterate through "res" and create accordions fill them with metadata


	for(i=0; i < res.length; i++){

		//fill array for permalinks
		jsonForDatasets.push(res[i]);

		//HTML-Element wird mit Meta-Daten gefüllt
		$('#datasetButton' + (i+1)  ).html(
		"<b> Cloud Coverage Assesment: </b>" + res[i].CLOUD_COVERAGE_ASSESSMENT +  "</br>" +
		"<b> Datatake Sensing Start: </b>" + res[i].DATATAKE_1_DATATAKE_SENSING_START + "</br>" +
		"<b> Datatkae Type: </b>" + res[i].DATATAKE_1_DATATAKE_TYPE + "</br>" +
		"<b> Datatake ID: </b>" + res[i].DATATAKE_1_ID + "</br>" +
		"<b> Sensing Orbit Direction: </b>" + res[i].DATATAKE_1_SENSING_ORBIT_DIRECTION + "</br>" +
		"<b> Sensing Orbit Number: </b>" + res[i].DATATAKE_1_SENSING_ORBIT_NUMBER + "</br>" +
		"<b> Spacecraft Name: </b>" + res[i].DATATAKE_1_SPACECRAFT_NAME + "</br>" +
		"<b> Degraded ANC Data Percentage: </b>" + res[i].DEGRADED_ANC_DATA_PERCENTAGE + "</br>" +
		"<b> Degraded MSI Data Percentage: </b>" + res[i].DEGRADED_MSI_DATA_PERCENTAGE + "</br>" +
		"<b> Footprint: </b>" + res[i].FOOTPRINT + "</br>" +
		"<b> Format Correctness Flag: </b>" + res[i].FORMAT_CORRECTNESS_FLAG + "</br>" +
		"<b> General Quality Flag: </b>" + res[i].GENERAL_QUALITY_FLAG + "</br>" +
		"<b> Generation Time: </b>" + res[i].GENERATION_TIME + "</br>" +
		"<b> Geometric Quality Flag: </b>" + res[i].GEOMETRIC_QUALITY_FLAG + "</br>" +
		"<b> Preview Geo Info: </b>" + res[i].PREVIEW_GEO_INFO + "</br>" +
		"<b> Preview Image-Url: </b>" + res[i].PREVIEW_IMAGE_URL +"</br>" +
		"<b> Processing Baseline: </b>" + res[i].PROCESSING_BASELINE + "</br>" +
		"<b> Processing Level: </b>" + res[i].PROCESSING_LEVEL + "</br>" +
		"<b> Product Start Time: </b>" + res[i].PRODUCT_START_TIME + "</br>" +
		"<b> Product Stop Time: </b>" + res[i].PRODUCT_STOP_TIME + "</br>" +
		"<b> PRODUCT_TYPE: </b>" + res[i].PRODUCT_TYPE + "</br>" +
		"<b> PRODUCT_URI: </b>" + res[i].PRODUCT_URI + "</br>" +
		"<b> Quantification Value: </b>" + res[i].QUANTIFICATION_VALUE + "</br>" +
		"<b> Radiometric Quality Flag: </b>" + res[i].RADIOMETRIC_QUALITY_FLAG + "</br>"+
		"<b> Reference Band: </b>" + res[i].REFERENCE_BAND + "</br>" +
		"<b> Reflectance Conversion U: </b>" + res[i].REFLECTANCE_CONVERSION_U + "</br>" +
		"<b> Sensor Quality Flag: </b>" + res[i].SENSOR_QUALITY_FLAG + "</br>" +
		"<b> Special Value Nodata: </b>" + res[i].SPECIAL_VALUE_NODATA + "</br>" +
		"<b> Special Value Saturated: </b>" + res[i].SPECIAL_VALUE_SATURATED + "</br>" +
		"<b> Subdataset 1 Description: </b>" + res[i].SUBDATASET_1_DESC + "</br>" +
		"<b> Subdataset 1 Name: </b>" + res[i].SUBDATASET_1_NAME + "</br>" +
		"<b> Subdataset 2 Description: </b>" + res[i].SUBDATASET_2_DESC + "</br>" +
		"<b> Subdataset 2 Name: </b>" + res[i].SUBDATASET_2_NAME + "</br>" +
		"<b> Subdataset 3 Description: </b>" + res[i].SUBDATASET_3_DESC + "</br>" +
		"<b> Subdataset 3 Name: </b>" + res[i].SUBDATASET_3_NAME + "</br>" +
		"<b> Subdataset 4 Description: </b>" + res[i].SUBDATASET_4_DESC + "</br>" +
		"<b> Subdataset 4 Name: </b>" + res[i].SUBDATASET_4_NAME + "</br>");

		//Use for Polygoncreation
		drawPolygon(res, i, page, number, res.length);
		number++;
	};

	for(j=res.length; j<(res.length + resL2A.length); j++){
		var i = j - res.length;

		//fill array for permalinks
		jsonForDatasets.push(resL2A[i]);
		$('#datasetButton' + (j+1)  ).html(
		"<b> AOT Retrieval Accuracy: </b>" + resL2A[i].AOT_RETRIEVAL_ACCURACY +  "</br>" +
		"<b> Bare Soils Percentage: </b>" + resL2A[i].BARE_SOILS_PERCENTAGE +  "</br>" +
		"<b> Cloud Coverage Assesment: </b>" + resL2A[i].CLOUD_COVERAGE_ASSESSMENT +  "</br>" +
		"<b> Cloud Coverage Percentage: </b>" + resL2A[i].CLOUD_COVERAGE_PERCENTAGE +  "</br>" +
		"<b> Cloud Shadow Percentage: </b>" + resL2A[i].CLOUD_SHADOW_PERCENTAGE +  "</br>" +
		"<b> Dark Features Percentage: </b>" + resL2A[i].DARK_FEATURES_PERCENTAGE +  "</br>" +
		"<b> Datatake Sensing Start: </b>" + resL2A[i].DATATAKE_1_DATATAKE_SENSING_START + "</br>" +
		"<b> Datatkae Type: </b>" + resL2A[i].DATATAKE_1_DATATAKE_TYPE + "</br>" +
		"<b> Datatake ID: </b>" + resL2A[i].DATATAKE_1_ID + "</br>" +
		"<b> Sensing Orbit Direction: </b>" + resL2A[i].DATATAKE_1_SENSING_ORBIT_DIRECTION + "</br>" +
		"<b> Sensing Orbit Number: </b>" + resL2A[i].DATATAKE_1_SENSING_ORBIT_NUMBER + "</br>" +
		"<b> Spacecraft Name: </b>" + resL2A[i].DATATAKE_1_SPACECRAFT_NAME + "</br>" +
		"<b> Degraded ANC Data Percentage: </b>" + resL2A[i].DEGRADED_ANC_DATA_PERCENTAGE + "</br>" +
		"<b> Degraded MSI Data Percentage: </b>" + resL2A[i].DEGRADED_MSI_DATA_PERCENTAGE + "</br>" +
		"<b> Footprint: </b>" + resL2A[i].FOOTPRINT + "</br>" +
		"<b> Format Correctness Flag: </b>" + resL2A[i].FORMAT_CORRECTNESS_FLAG + "</br>" +
		"<b> General Quality Flag: </b>" + resL2A[i].GENERAL_QUALITY_FLAG + "</br>" +
		"<b> HIGH_PROBA_CLOUDS_PERCENTAGE: </b>" + resL2A[i].HIGH_PROBA_CLOUDS_PERCENTAGE +  "</br>" +
		"<b> L1C_TOA_QUANTIFICATION_VALUE: </b>" + resL2A[i].L1C_TOA_QUANTIFICATION_VALUE +  "</br>" +
		"<b> L1C_TOA_QUANTIFICATION_VALUE_UNIT: </b>" + resL2A[i].L1C_TOA_QUANTIFICATION_VALUE_UNIT +  "</br>" +
		"<b> L2A_AOT_QUANTIFICATION_VALUE: </b>" + resL2A[i].L2A_AOT_QUANTIFICATION_VALUE +  "</br>" +
		"<b> L2A_AOT_QUANTIFICATION_VALUE_UNIT: </b>" + resL2A[i].L2A_AOT_QUANTIFICATION_VALUE_UNIT +  "</br>" +
		"<b> L2A_BOA_QUANTIFICATION_VALUE: </b>" + resL2A[i].L2A_BOA_QUANTIFICATION_VALUE +  "</br>" +
		"<b> L2A_BOA_QUANTIFICATION_VALUE_UNIT: </b>" + resL2A[i].L2A_BOA_QUANTIFICATION_VALUE_UNIT +  "</br>" +
		"<b> L2A_WVP_QUANTIFICATION_VALUE: </b>" + resL2A[i].L2A_WVP_QUANTIFICATION_VALUE +  "</br>" +
		"<b> L2A_WVP_QUANTIFICATION_VALUE_UNIT: </b>" + resL2A[i].L2A_WVP_QUANTIFICATION_VALUE +  "</br>" +
		"<b> LOW_PROBA_CLOUDS_PERCENTAGE: </b>" + resL2A[i].LOW_PROBA_CLOUDS_PERCENTAGE +  "</br>" +
		"<b> MEDIUM_PROBA_CLOUDS_PERCENTAGE: </b>" + resL2A[i].MEDIUM_PROBA_CLOUDS_PERCENTAGE +  "</br>" +
		"<b> NODATA_PIXEL_PERCENTAGE: </b>" + resL2A[i].NODATA_PIXEL_PERCENTAGE +  "</br>" +

		"<b> Generation Time: </b>" + resL2A[i].GENERATION_TIME + "</br>" +
		"<b> Geometric Quality Flag: </b>" + resL2A[i].GEOMETRIC_QUALITY_FLAG + "</br>" +
		"<b> Preview Geo Info: </b>" + resL2A[i].PREVIEW_GEO_INFO + "</br>" +
		"<b> Preview Image-Url: </b>" + resL2A[i].PREVIEW_IMAGE_URL +"</br>" +
		"<b> Processing Baseline: </b>" + resL2A[i].PROCESSING_BASELINE + "</br>" +
		"<b> Processing Level: </b>" + resL2A[i].PROCESSING_LEVEL + "</br>" +
		"<b> Product Start Time: </b>" + resL2A[i].PRODUCT_START_TIME + "</br>" +
		"<b> Product Stop Time: </b>" + resL2A[i].PRODUCT_STOP_TIME + "</br>" +
		"<b> PRODUCT_TYPE: </b>" + resL2A[i].PRODUCT_TYPE + "</br>" +
		"<b> PRODUCT_URI_1C: </b>" + resL2A[i].PRODUCT_URI_1C +  "</br>" +
		"<b> PRODUCT_URI_2A: </b>" + resL2A[i].PRODUCT_URI_2A +  "</br>" +
		//"<b> PRODUCT_URI: </b>" + res[i].PRODUCT_URI + "</br>" +
		//"<b> Quantification Value: </b>" + res[i].QUANTIFICATION_VALUE + "</br>" +
		"<b> Radiometric Quality Flag: </b>" + resL2A[i].RADIOMETRIC_QUALITY_FLAG + "</br>"+
		"<b> Reference Band: </b>" + resL2A[i].REFERENCE_BAND + "</br>" +
		"<b> Reflectance Conversion U: </b>" + resL2A[i].REFLECTANCE_CONVERSION_U + "</br>" +
		"<b> SATURATED_DEFECTIVE_PIXEL_PERCENTAGE: </b>" + resL2A[i].SATURATED_DEFECTIVE_PIXEL_PERCENTAGE +  "</br>" +
		"<b> Sensor Quality Flag: </b>" + resL2A[i].SENSOR_QUALITY_FLAG + "</br>" +
		"<b> SNOW_ICE_PERCENTAGE: </b>" + resL2A[i].SNOW_ICE_PERCENTAGE +  "</br>" +
		"<b> Special Value Nodata: </b>" + resL2A[i].SPECIAL_VALUE_NODATA + "</br>" +
		"<b> Special Value Saturated: </b>" + resL2A[i].SPECIAL_VALUE_SATURATED + "</br>" +
		"<b> THIN_CIRRUS_PERCENTAGE: </b>" + resL2A[i].THIN_CIRRUS_PERCENTAGE +  "</br>" +
		"<b> VEGETATION_PERCENTAGE: </b>" + resL2A[i].VEGETATION_PERCENTAGE +  "</br>" +
		"<b> WATER_PERCENTAGE: </b>" + resL2A[i].WATER_PERCENTAGE +  "</br>" +
		"<b> WATER_VAPOUR_RETRIEVAL_ACCURACY: </b>" + resL2A[i].WATER_VAPOUR_RETRIEVAL_ACCURACY +  "</br>" +
		"<b> R10M: </b>" + resL2A[i].R10M +  "</br>" +
		"<b> R20M: </b>" + resL2A[i].R20M +  "</br>" +
		"<b> R60M: </b>" + resL2A[i].R60M +  "</br>");

		//Use for Polygoncreation
		drawPolygon(resL2A, i, page, number, (res.length + resL2A.length));
		number++;

 		//Erzeuge select Values für S2A Datasets:
 		var k = j+1;
 		var arr10m = ["Resolution 10 Meter:", "R10M", "Band AOT", 0, "Band 2", 1, "Band 3", 2 , "Band 4", 3, "Band TCI", 5,  "Band WVP", 6 , "Band 8", 4];
		var arr20m = ["Resolution 20 Meter:", "R20M", "Band AOT", 0, "Band 2", 1, "Band 3", 2 , "Band 4", 3, "Band 5", 4, "Band 6", 5, "Band 7", 6, "Band SCL", 10, "Band 8a", 9, "Band TCI", 11, "Band 11", 7, "Band 12", 8, "Band VIS", 12, "Band WVP", 13];
		var arr60m = ["Resolution 60 Meter:", "R60M", "Band AOT", 0, "Band 1", 1, "Band 2", 2, "Band 3", 3, "Band 4", 4, "Band 5", 5, "Band 6", 6, "Band 7", 7, "Band 9", 8, "Band 11", 9, "Band 12", 10, "Band 8a", 11, "Band SCL", 12, "Band TCI", 13, "Band WVP", 14]
		addL2AOptions(resL2A, ("rgbselect"+((k*3)-2)), arr10m, i, band);
		addL2AOptions(resL2A, ("rgbselect"+((k*3)-2)), arr20m, i,band);
		addL2AOptions(resL2A, ("rgbselect"+((k*3)-2)), arr60m, i,band);
		addL2AOptions(resL2A, ("rgbselect"+((k*3)-1)), arr10m, i,band);
		addL2AOptions(resL2A, ("rgbselect"+((k*3)-1)), arr20m, i,band);
		addL2AOptions(resL2A, ("rgbselect"+((k*3)-1)), arr60m, i,band);
		addL2AOptions(resL2A, ("rgbselect"+(k*3)), arr10m, i,band);
		addL2AOptions(resL2A, ("rgbselect"+(k*3)), arr20m, i,band);
		addL2AOptions(resL2A, ("rgbselect"+(k*3)), arr60m, i,band);
		addL2AOptions(resL2A, ("greyselect"+k), arr10m, i,band);
		addL2AOptions(resL2A, ("greyselect"+k), arr20m, i,band);
		addL2AOptions(resL2A, ("greyselect"+k), arr60m, i,band);
	};

	//Submit for L2A Datasets
	for(j=res.length; j<(res.length + resL2A.length); j++){
		if(vis == undefined){
			vis = [];
			for(var k = 0; k<(res.length + resL2A.length);k++){
				vis.push("false");
			}
		}
		if(vis[j] == "true"){
			console.log(j);
				 $('#showL2AData'+(j+1)).submit();
			}
		}
}


function addL2AOptions(result, id, array, j, band){
  for(var i = 0; i < array.length; i = i + 2){
   $("#"+id)[0].options[$("#"+id)[0].options.length] = new Option(array[i],result[j][array[1]][array[i+1]]);
   if(i == 0){
     $("#"+id)[0].options[$("#"+id)[0].options.length-1].disabled = "true";
   }
	 //Selector for permalink
	 if(band != undefined){
		 for (var k = 0; k < band.length; k++) {
			 for(var m = 0; m<band[k].length;m++){
				 if(band[k][m] == result[j][array[1]][array[i+1]]){
				    $("#"+id)[0].options[$("#"+id)[0].options.length-1].selected = "selected";
				 }
			 }
		 }
	 }
  }
}

/**
 *Zeigt und versteckt Elemente
 *Wird bei den RadioButtons aufgerufen
 *@param i Element, das gezeigt werden soll
 *@param j Element, das versteckt werden soll
 */
function toggleDrop(i,j){
	$('#dropd'+i).show();
	$('#dropd'+j).hide();
}

/**
 *Gibt die Stelle im Array zurück, in welcher das angegebene Band steht
 *@param bandArray Array, das durchsucht werden soll
 *@param band Eintrag, nach dem gesucht werden soll
 *@return Die Stelle im Array mit dem gesuchten Eintrag
*/
function findArray(bandArray, band){
	var number = 0;
	for(var i = 0; i<bandArray.length;i++){
		if(bandArray[i] == band){
			number = i;
			break;
		}
	}
	return number;
}
