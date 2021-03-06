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


function createTCISubmitHandler(res, j, i, l2a, opacity){
	$('#showTCI'+ j).click(function(e) {	
		e.preventDefault();
		var bands = [];
		var names = [];
		spinnerHide(document.getElementById('sidebar'));
		spinnerShow(document.getElementById('map'));
		if(l2a){
			var datasetName = "&gscdn="+ res[i].PRODUCT_URI_2A;
			var bandname = "&gsc=" + res[i].R60M[13];
			bands.push(res[i].R60M[13]);
			names.push(res[i].PRODUCT_URI_2A);
			var that = "tci=true&rgbbool=false&l2a=true";
			that += datasetName;
			that += bandname;
		}
		else {
			var datasetName = "&gscdn="+ res[i].SUBDATASET_4_NAME;
			bands.push("TCI");
			names.push(res[i].SUBDATASET_4_NAME);
			var that = "tci=true&rgbbool=false&gsc=TCI&l2a=false";
			that += datasetName;
		}
	        // submit via ajax
	        $.ajax({
	        	data: that,
	        	type: "POST",
	        	url: apiurl + '/generate?',
	        	error: function(xhr, status, err) {
		            console.log("Error while loading Data");
					spinnerHide(document.getElementById('map'));
		            alert("Error while loading Data");
	          	},
	          	success: function(res) {
					//remove all Datasets that were visualized before
					removeDatasets();
					//end of Spinner visualization
					spinnerHide(document.getElementById('map'));
	            	console.log("Data successfully loaded.");	
	            	// create lyr with requested data
                    
	            	lyr = L.tileLayer(
						apiurl + '/data/' + res + '/{z}/{x}/{-y}.png',
						{
						tms: true,
					    continuousWorld: true,
						opacity: 100,
						bounds: stringToCoordArray(jsonForDatasets[j-1].FOOTPRINT),
						minZoom : 4,
						maxZoom : 12,
						}

					);
		            // add layer to Map and name it like the Dataset it was requested from
					layerControl.addOverlay(lyr, "Current Dataset");
					map.addLayer(lyr);
					visDatasetNumber = j;
					zoomToLayer(j);
					//ValueLookUp
					drawInvisPolygon(j, names, bands, (radioValue(document.getElementsByName('rgbbool'),j)));
					$('#dataset'+j).append('<div id="opacitySlider" style="padding: 15px; padding-top: 0px"> <p>Choose your opacity:</p> <input type="range" name="opacity" id="opacityId'+j+'" value="'+opacity+'" min="0" max="100" oninput="showOpacityLevel('+j+')" onchange="opacityChanger('+j+')"/><output name="opacityOutput" id="opacityOutputId'+j+'">Opacity Level: '+opacity+'%</output> </div>');
					opacityChanger(j);
				}
	        });
	});
}

/**
 * Erstellt Submithandler für L1C Datasets
 *
 *@param res result from search parameter
 *@param j index of id of dataset, where the submithandler is to be created from
 *@param opacity current  opacity-value
 */
function createL1CSubmitHandler(res, j, opacity, l){
	$('#showData'+ j).submit(function(e) {
		spinnerHide(document.getElementById('sidebar'));
		spinnerShow(document.getElementById('map'));
		e.preventDefault();
	    //check if input fields are not empty for the markers
	    if((	//Check if radio button option "RGB" is checked and all 3 bands are choosen at rgb
			((radioValue(document.getElementsByName('rgbbool'),j)) == "true") &&
			($('#rgbselect'+ ((j*3)-2)).val()  !== null) &&
			($('#rgbselect'+ ((j*3)-1)).val() !== null) &&
			($('#rgbselect'+ (j*3)).val()  !== null)
	    ) || (
	    	//or check if radio button option "Greyscale" is checked and one band is choosen at greyscale

			((radioValue(document.getElementsByName('rgbbool'),j)) == "false") &&
	        ($('#greyselect'+ j).val() !== null))
		)//if true than go on with submitting
	    {
	    	// create some hidden inputs, to append name of Subdataset of choosen bands
    		var redSDNInput = $('<input type="hidden" name="rcdn" value=' + subdataL1CName(res, $('#rgbselect'+ ((j*3)-2)).val(), l) + '>');
	        var greenSDNInput = $('<input type="hidden" name="gcdn" value=' + subdataL1CName(res, $('#rgbselect'+ ((j*3)-1)).val(), l) + '>');
	        var blueSDNInput = $('<input type="hidden" name="bcdn" value=' + subdataL1CName(res, $('#rgbselect'+ ((j*3))).val(), l) + '>');
	        var greySDNInput = $('<input type="hidden" name="gscdn" value=' + subdataL1CName(res, $('#greyselect'+ j).val(), l) + '>');

	        //append input values to POST-data-object
	        $(this).append(redSDNInput);
	        $(this).append(greenSDNInput);
	        $(this).append(blueSDNInput);
	        $(this).append(greySDNInput);

			//Array for ValueLookUp
			var bands = [];
			bands.push($('#rgbselect'+ ((j*3)-2)).val());
			bands.push($('#rgbselect'+ ((j*3)-1)).val());
			bands.push($('#rgbselect'+ ((j*3))).val());
			bands.push($('#greyselect'+ j).val());
			var names = [];
			names.push(redSDNInput[0].value);
			names.push(greenSDNInput[0].value);
			names.push(blueSDNInput[0].value);
			names.push(greySDNInput[0].value);

			var that = this;
	        // submit via ajax
	        $.ajax({
	        	data: $(that).serialize(),
	        	type: $(that).attr('method'),
	        	url:  apiurl + '/generate?',
	        	error: function(xhr, status, err) {
		            console.log("Error while loading Data");
					spinnerHide(document.getElementById('map'));
		            alert("Error while loading Data");
	          	},
	          	success: function(res) {
					//remove all Datasets that were visualized before
					removeDatasets();
					//end of Spinner visualization
					spinnerHide(document.getElementById('map'));
	            	console.log("Data successfully loaded.");

                    // create lyr with requested data
	            	lyr = L.tileLayer(
						apiurl + '/data/' + res + '/{z}/{x}/{-y}.png',
						{
						  tms: true,
						  continuousWorld: true,
							opacity: 100,
							bounds: stringToCoordArray(jsonForDatasets[j-1].FOOTPRINT),
							minZoom : 4,
							maxZoom : 12,
						}

					);
		            // add layer to Map and name it like the Dataset it was requested from
					layerControl.addOverlay(lyr, "Current Dataset");
					map.addLayer(lyr);
					visDatasetNumber = j;
					zoomToLayer(j);
					//ValueLookUp
					drawInvisPolygon(j, names, bands, (radioValue(document.getElementsByName('rgbbool'),j)));
					$('#dataset'+j).append('<div id="opacitySlider" style="padding: 15px; padding-top: 0px"> <p>Choose your opacity:</p> <input type="range" name="opacity" id="opacityId'+j+'" value="'+opacity+'" min="0" max="100" oninput="showOpacityLevel('+j+')" onchange="opacityChanger('+j+')"/><output name="opacityOutput" id="opacityOutputId'+j+'">Opacity Level: '+opacity+'%</output> </div>');
					opacityChanger(j);
				}
	        });
	        redSDNInput.remove();
	        greenSDNInput.remove();
	        blueSDNInput.remove();
	        greySDNInput.remove();
	    }
	    // if not all needed inputs are filled by the user, give error and do not submit anything
		else
		{
            spinnerHide(document.getElementById('map'));
	    	alert("Please define requested values before clicking the Show this dataset -Button l1c");
		}
	});
}



/**
 * Creates submithandler for L2A datasets
 *
 *@param res result from the search request
 *@param j index of id of dataset, where the submithandler is to be created from
 *@param opacity current  opacity-value
 *@param i = (index id of dataset) - (length of L1C-Arrays)
 */
function createL2ASubmitHandler(res, j, opacity, i){
	$('#showL2AData'+ j).submit(function(e) {
		spinnerHide(document.getElementById('sidebar'));
		spinnerShow(document.getElementById('map'));
		e.preventDefault();
	    //check if input fields are not empty for the markers
	    if (
	    (
	    	//Check if radio button option "RGB" is checked and all 3 bands are choosen at rgb
			((radioValue(document.getElementsByName('rgbbool'),j)) == "true") &&
			($('#rgbselect'+ ((j*3)-2)).val()  !== null) &&
			($('#rgbselect'+ ((j*3)-1)).val() !== null) &&
			($('#rgbselect'+ (j*3)).val()  !== null)
	    ) || (
	    	//or check if radio button option "Greyscale" is checked and one band is choosen at greyscale

			((radioValue(document.getElementsByName('rgbbool'),j)) == "false") &&
	        ($('#greyselect'+ j).val() !== null))
		) //if true than go on with submitting
	    {
	    	// create some hidden inputs, to append name of Subdataset of choosen bands
    		var redSDNInput = $('<input type="hidden" name="rcdn" value=' + subdataL2AName(res, $('#rgbselect'+ ((j*3)-2)).val(), i) + '>');
	        var greenSDNInput = $('<input type="hidden" name="gcdn" value=' + subdataL2AName(res, $('#rgbselect'+ ((j*3)-1)).val(), i) + '>');
	        var blueSDNInput = $('<input type="hidden" name="bcdn" value=' + subdataL2AName(res, $('#rgbselect'+ (j*3)).val(), i) + '>');
	        var greySDNInput = $('<input type="hidden" name="gscdn" value=' + subdataL2AName(res, $('#greyselect'+ j).val(), i) + '>');


	        //append input values to POST-data-object
	        $(this).append(redSDNInput);
	        $(this).append(greenSDNInput);
	        $(this).append(blueSDNInput);
	        $(this).append(greySDNInput);

			//Array for ValueLookUp
			var bands = [];
			bands.push($('#rgbselect'+ ((j*3)-2)).val());
			bands.push($('#rgbselect'+ ((j*3)-1)).val());
			bands.push($('#rgbselect'+ ((j*3))).val());
			bands.push($('#greyselect'+ j).val());
			var names = [];
			names.push(redSDNInput[0].value);
			names.push(greenSDNInput[0].value);
			names.push(blueSDNInput[0].value);
			names.push(greySDNInput[0].value);

	        var that = this;
	        console.log($(that).serialize());
	        // submit via ajax
	        $.ajax({
	          	data: $(that).serialize(),
		        type: $(that).attr('method'),
		        url:  apiurl + '/generate?',
		        error: function(xhr, status, err) {
	            	console.log("Error while loading Data");
					spinnerHide(document.getElementById('map'));
		            alert("Error while loading Data");
	          	},
	          	success: function(res) {
	  				//remove all Datasets that were visualized before
					removeDatasets();
					//end of Spinner visualization
					spinnerHide(document.getElementById('map'));
	                console.log("Data successfully loaded.");

	                // create lyr with requested data
		            lyr = L.tileLayer(
						apiurl + '/data/' + res + '/{z}/{x}/{-y}.png',
						{
						  tms: true,
						  continuousWorld: true,
							opacity: 100,
							bounds: stringToCoordArray(jsonForDatasets[j-1].FOOTPRINT),
							minZoom : 4,
							maxZoom : 12,
						}

					);
		            // add layer to Map and name it like the Dataset it was requested from
				    layerControl.addOverlay(lyr, "Current Dataset");
					map.addLayer(lyr);
					visDatasetNumber = j;
					zoomToLayer(j);

					//ValueLookUp
					drawInvisPolygon(j, names, bands,(radioValue(document.getElementsByName('rgbbool'),j)));
					$('#dataset'+j).append('<div id="opacitySlider" style="padding: 15px; padding-top: 0px"> <p>Choose your opacity:</p> <input type="range" name="opacity" id="opacityId'+j+'" value="'+opacity+'" min="0" max="100" oninput="showOpacityLevel('+j+')" onchange="opacityChanger('+j+')"/><output name="opacityOutput" id="opacityOutputId'+j+'">Opacity Level: '+opacity+'%</output> </div>');
					opacityChanger(j);
				}
	        });

	        //empty hidden Inputs
	        redSDNInput.remove();
	        greenSDNInput.remove();
	        blueSDNInput.remove();
	        greySDNInput.remove();
	    }
	   	// if not all needed inputs are filled by the user, give error and do not submit anything
		else
		{
			spinnerHide(document.getElementById('map'));
	    	alert("Please define requested values before clicking the Show this dataset -Button");
		}
	});
}



/**
 * Returns subdatasetname of a given band from L1C datasets
 *
 *@param res Object with all Datasets user can choose from
 *@param value choosen band
 *@param j Index+1 of Dataset the band was choosen from
 */
function subdataL1CName(res, value, j){
	var index = ["B2", "B3", "B4", "B8", "B5", "B6", "B7", "B8a", "B11", "B12", "B1", "B9", "B10"].indexOf(value);
	if(index < 0){
		return "";
	}
	if(index < 4){
		return res[j].SUBDATASET_1_NAME;
	}
	else if (index > 9) {
		return res[j].SUBDATASET_3_NAME;
	}
	else
		return res[j].SUBDATASET_2_NAME;
}

/**
 * Returns Product-URI of a given band from L2A datasets
 *
 *@param res Object with all Datasets user can choose from
 *@param value choosen band
 *@param j Index of Dataset the band was choosen from
 */
function subdataL2AName(res, value, j){
	if(value == null){
		return "";
	}
	else{
		return res[j].PRODUCT_URI_2A;
	}
}

/**
 * returns the value of radio button option that is checked out of two given radio button options
 *
 *@param radio radiobutton to be checked
 *@param j Index to calculate which options of the radiobutton will be checked
 */
function radioValue(radios, j){
	for (var i = ((j-1)*2); i < (((j-1)*2)+2); i++)
	{
		if (radios[i].checked)
		{
		  return(radios[i].value);
		}
	}
	//if none is checked return "unknown"
	return "unknown";
}
