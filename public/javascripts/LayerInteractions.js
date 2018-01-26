
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
        var url = 'http://gis-bigdata.uni-muenster.de:14014/value?';
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
 *Zeigt die Deckungskraft Level an oder aktualisiert es
 *@param i Nummer des Datasets, bei dem die Deckungskraft angezeigt werden soll
*/
function showOpacityLevel(i){
  $('#opacityOutputId'+ i ).html('Opacity Level:' + $('#opacityId'+ i ).val()+'%');
}

/**
 *Aktualisiert die Deckungskraft von angezeigten Datasets.
 *@param j Nummer des Datasets, bei dem die Opactiy angezeigt werden soll
*/
function opacityChanger(j){
  lyr.options.opacity = $('#opacityId'+ j ).val()/100;
  //Layer muss geupdatet werden nach Veränderung
  updateLyr();
}

/**
 *Aktualisiert die Deckungskraft von angezeigten Datasets.
 *Dazu wird das Layer von der Karte entfernt und neu hinzugefügt.
*/
function updateLyr(){
  map.removeLayer(lyr);
  map.addLayer(lyr);
}

/**
 *Entfernt das angezeigte Dataset von der Karte, dem Layercontorl und den Opactiyslider, wenn eins vorhanden ist.
*/
function removeDatasets(){
  if (layerControl._layers.length == 4) {
    layerControl.removeLayer(lyr);
    map.removeLayer(lyr);
    $("#opacitySlider").remove();
  }
}

/**
 *Öffnet ein Akkordion. Wird ausgeführt nach Klick auf ein Polygon.
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
    
