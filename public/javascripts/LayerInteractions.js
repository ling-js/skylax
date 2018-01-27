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

/**
 * Displays the value on tile click
 */
function initLookUp(e){
  var x = correctCoordinates(e.latlng.lng);
  var y = e.latlng.lat;
  var dname = this.options.dname;
  var bname = this.options.bname;
  valueRequest(dname, bname, x, y);
}

/**
 * Displays the value on tile click
 *@param x X coordinate
 *@param y Y coordniate
 */
 function showValue(x, y){
   var popupMessage = "";
   if(valueLookUpArray.length == 1){
     popupMessage += "The value here is " + valueLookUpArray[0];
   }else{
     var colors = ["red","green","blue"]
     for (var i = 0; i < valueLookUpArray.length; i++) {
       if (i != 0) {
         popupMessage += " <br> "
       }
       popupMessage += "Value of the "+colors[i]+" band is "+valueLookUpArray[i];
     }
   }
   var popup = L.popup()
     .setLatLng([y, x])
     .setContent(popupMessage)
     .openOn(map);
 }

/**
 * Requests the Value of te dataset of specific coordinates.
 *@param dname Name of datasets
 *@param bname bandValues
 *@param x X coordinate
 *@param y Y coordniate
 */
  function valueRequest(dname, bname, x, y){
    spinnerShow(document.getElementById('map'));
    valueLookUpArray = []
    var result =[];
    var count = 0;
    for(var i = 0; i<bname.length;i++){
      if(bname[i] != null && dname[i] != null){
        count ++;
      }
    }
    for(var i = 0; i<bname.length;i++)
    {
      if(bname[i] != null && dname[i] != null){
        var url = apiurl + '/value?';
        var searchParams = new URLSearchParams();
        searchParams.append("d", dname[i]);
        if(bname[i].length < 3)
        {
          bname[i] = "B0"+bname[i].slice(bname[i].length-1);
        }else if(bname[i] == "B8a"){
          bname[i] = "B8A";
        }
        searchParams.append("b", bname[i]);
        searchParams.append("x", x);
        searchParams.append("y", y);
        url = url + searchParams;
        $.ajax({
          type: "GET",
          url: url,
          data:"",
          statusCode: {
            404: function() {
              console.log("something went wrong(404)");
                spinnerHide(document.getElementById('map'));
            }},
            success: function (res, status, request) {
              valueLookUpArray.push(res);
              count --;
              if (count == 0) {
                spinnerHide(document.getElementById('map'));
                showValue(x,y);
              }
            },
            error: function(xhr, status, error) {
              console.log("Achtung:Es gab einen Fehler bei der AJAX-Anfrage der Fehlercode lautet :" + ""+ xhr.responseText);
              //alert(xhr.responseText);
              spinnerHide(document.getElementById('map'));
            }
          }); //end ajax
        }
      }
    }




/**
 *shows opacity level or updates it
 *@param i number of dataset, where to opacity level is to be shown
*/
function showOpacityLevel(i){
  $('#opacityOutputId'+ i ).html('Opacity Level:' + $('#opacityId'+ i ).val()+'%');
}

/**
 *updates opacity level of shown dataset
 *@param j number of dataset, where to opacity level is to be shown
*/
function opacityChanger(j){
  lyr.options.opacity = $('#opacityId'+ j ).val()/100;
  //Layer after change needs to be updated
  updateLyr();
}

/**
 *Aupdates opacity level of shown dataset
 *dazu removed from map and added again
*/
function updateLyr(){
  map.removeLayer(lyr);
  map.addLayer(lyr);
}

/**
 *removes dataset from map, the layercontrol and opacity slider, in case one exists.
*/
function removeDatasets(){
  if (layerControl._layers.length == 4) {
    layerControl.removeLayer(lyr);
    map.removeLayer(lyr);
    $("#opacitySlider").remove();
  }
}

/**
 *open accordion. Runs after click on a polygon
*/
function openAccordion(){
  hash = '#search';
  openTabInSidebar(hash);
  for(var i = 1; i < this.options.resultLength+1; i++){
    if(i == (this.options.number+1)){
      $("#dataset"+(this.options.number+1)).collapse('show');
      var scroll = $("#dataset"+(this.options.number+1))[0].parentNode.offsetTop;
      $('#scrollero').scrollTop(scroll);
    }else{
      $("#dataset"+i).collapse('hide');
    }
  }
}
