function createSubmitHandler(res, j, opacity){
	$('#showData'+ j).submit(function(e) {
		spinnerShow(document.getElementById('map'));
		e.preventDefault();
	    //Prüfe ob die Eingabefelder für die Marker nicht leer sind
	    if (
	    (
			((radioValue(document.getElementsByName('rgbbool'),j)) == "true") &&
			($('#rgbselect'+ ((j*3)-2)).val()  !== null) &&
			($('#rgbselect'+ ((j*3)-1)).val() !== null) &&
			($('#rgbselect'+ (j*3)).val()  !== null)
	    ) || (
			((radioValue(document.getElementsByName('rgbbool'),j)) == "false") &&
	        ($('#greyselect'+ j).val() !== null))
		)
	    {
    		var redSDNInput = $('<input type="hidden" name="rcdn" value=' + subdataName(res, $('#rgbselect'+ ((j*3)-2)).val(), j) + '>');
	        var greenSDNInput = $('<input type="hidden" name="gcdn" value=' + subdataName(res, $('#rgbselect'+ ((j*3)-1)).val(), j) + '>');
	        var blueSDNInput = $('<input type="hidden" name="bcdn" value=' + subdataName(res, $('#rgbselect'+ ((j*3))).val(), j) + '>');
	        var greySDNInput = $('<input type="hidden" name="gscdn" value=' + subdataName(res, $('#greyselect'+ j).val(), j) + '>');

	        $(this).append(redSDNInput);
	        $(this).append(greenSDNInput);
	        $(this).append(blueSDNInput);
	        $(this).append(greySDNInput);
	        var that = this;

	        // submit via ajax
	        $.ajax({
	          data: $(that).serialize(),
	          type: $(that).attr('method'),
	          url:  'http://gis-bigdata.uni-muenster.de:14014/generate?',
	          error: function(xhr, status, err) {
	            console.log("Error while loading Data");
							spinnerHide(document.getElementById('map'));
	            alert("Error while loading Data");
	          },
	          success: function(res) {
							removeDatasets();
							spinnerHide(document.getElementById('map'));
	              console.log("Data successfully loaded.");
	              lyr = L.tileLayer(
					'http://gis-bigdata.uni-muenster.de:14014/data/' + res + '/{z}/{x}/{-y}.png',
					{
					  tms: true,
					  continuousWorld: true,
						opacity: 100,
					}

				);
				  layerControl.addOverlay(lyr, "Dataset "+j);
					map.addLayer(lyr);
					zoomToLayer(j);
					$('#dataset'+j).append('<div id="opacitySlider" style="padding: 15px; padding-top: 0px"> <p>Choose your opacity:</p> <input type="range" name="opacity" id="opacityId'+j+'" value="'+opacity+'" min="0" max="100" oninput="showOpacityLevel('+j+')" onchange="opacityChanger('+j+')"/><output name="opacityOutput" id="opacityOutputId'+j+'">Opacity Level: '+opacity+'%</output> </div>');
					opacityChanger(j);
					}
	        });
	        redSDNInput.remove();
	        greenSDNInput.remove();
	        blueSDNInput.remove();
	        greenSDNInput.remove();
	    }
		else
		{
    		//console.log("falseeeee: " + j);
				spinnerHide(document.getElementById('map'));
	    	alert("Please define requested values before clicking the Show this dataset -Button");
		}
	});
		//console.log("Submit overwritten.")
}


function subdataName(res, value, j){
	console.log("Started subdataName.");
	var index = ["B2", "B3", "B4", "B8", "B5", "B6", "B7", "B8a", "B11", "B12", "B1", "B9", "B10"].indexOf(value);
	console.log(index);
	if(index < 0){
		return "";
	}
	if(index < 4){
		return res[j-1].SUBDATASET_1_NAME;
	}
	else if (index > 9) {
		return res[j-1].SUBDATASET_3_NAME;
	}
	else
		return res[j-1].SUBDATASET_2_NAME;
}

function radioValue(radios, j){
	for (var i = ((j-1)*2); i < (((j-1)*2)+2); i++)
	{
		if (radios[i].checked)
		{
		  return(radios[i].value);
		}
	}
	return "unknown";
}

