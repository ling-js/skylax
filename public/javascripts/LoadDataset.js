/**
* Lädt aus dem Permalink die Suchparameter, fügt diese ein ud führt ggf. Suche aus
*/
function loadSearch(){
  //lädt Suchparameter
  var searchParams = new URLSearchParams(window.location.search.slice(1));
  //Gibt an, wie viele Suchparameter angegeben sind und ob eins ein Dataset ist
  var counter = 0;
  var ds = false;
  for (let i of searchParams) {
    counter++;
    if(i[0] == "ds"){
      ds = true;
    }
  }
  //Wenn Datasets vorhanden sind
  if(counter > 4){
    //Initalisiert Variablen zum befüllen aus Permalink
    var dsNumber = 0;
    var calcNumber = 0;
    var dsOpacity = [];
    var dsExpanded =[];
    var dsVis = [];
    var dsBand =[];
    var dsBandValues = [];
    var dsBtn = [];
    var pagetoview = 1;
    //Durchläuft alle Suchparameter und lädt Variablen
    for (let i of searchParams) {
      if(i[0] == "ds"){
        var dsRgbBandTemp = [];
        var dsValuesTemp = [];
        var dsMinValuesTemp = [];
        var dsMaxValuesTemp = [];
        var dsParams = new URLSearchParams(i[1]);
        for (let j of dsParams) {
          if(j[0] == "calc"){
            //Lädt alle Variablen, die es in Calc gibt
            var calcParams = new URLSearchParams(j[1]);
            for (let k of calcParams) {
              //hier kommt was mit calculated hin, aber nichts genaues weiß man nicht
            }
          }else{
            //Lädt alle Variablen, die es in Datasets gibt
            switch(j[0]) {
                case "n":
                  console.log("Was soll  ich denn damit?" + j[1]);
                  break;
                case "o":
                  dsOpacity.push(j[1]);
                  break;
                case "vis":
                  dsVis.push(j[1])
                  break;
                case "exp":
                  dsExpanded.push(j[1]);
                  break;
                case "btn":
                  if(j[1] == "rgb"){
                    dsBtn.push(["true","false"]);
                  }else if(j[1] == "grey"){
                    dsBtn.push(["false","true"]);
                  }else{
                    dsBtn.push(["false","false"]);
                  }
                  break;
                case "gscdn":
                  dsRgbBandTemp.push(j[1]);
                  break;
                case "rcdn":
                  dsRgbBandTemp.push(j[1]);
                  break;
                case "gcdn":
                  dsRgbBandTemp.push(j[1]);
                  break;
                case "bcdn":
                  dsRgbBandTemp.push(j[1]);
                  break;
                case "greymin":
                  dsMinValuesTemp.push(j[1]);
                  break;
                case "rcmin":
                  dsMinValuesTemp.push(j[1]);
                  break;
                case "gcmin":
                  dsMinValuesTemp.push(j[1]);
                  break;
                case "bcmin":
                  dsMinValuesTemp.push(j[1]);
                  break;
                case "greymax":
                  dsMaxValuesTemp.push(j[1]);
                  break;
                case "rcmax":
                  dsMaxValuesTemp.push(j[1]);
                  break;
                case "gcmax":
                  dsMaxValuesTemp.push(j[1]);
                  break;
                case "bcmax":
                  dsMaxValuesTemp.push(j[1]);
                  break;
            }
          }
        }
        //Daten werden in Temparrays gespeichert, um dem Format zu entsprechen
        //Temparray werden in die "richitgen" geschrieben und geleert
        dsBand.push(dsRgbBandTemp);
        dsRgbBandTemp = [];
        dsValuesTemp.push(dsMinValuesTemp);
        dsValuesTemp.push(dsMaxValuesTemp);
        dsBandValues.push(dsValuesTemp);
        dsValuesTemp = [];
        dsMinValuesTemp = [];
        dsMaxValuesTemp = [];
      }else{
        //Lädt Suchparamter der Suche und Seite, die angezeigt werden soll
        switch(i[0]) {
            case "st":
              $("#searchformbyname_input").val(i[1]);
              break;
            case "ssd":
              fillDate(i,"start");
              break;
            case "sed":
              fillDate(i,"end");
              break;
            case "p":
              pagetoview = i[1];
              break;
            case "sbox":
              var sbox = i[1].split(",");
              $("#searchformbybbox_bottomLat").val(sbox[1]);
              $("#searchformbybbox_bottomLong").val(sbox[0]);
              $("#searchformbybbox_topLat").val(sbox[3]);
              $("#searchformbybbox_topLong").val(sbox[2]);
              coordsToPolygon("true");
              break;
        }
      }
    }
    if(ds == true){
      //Wenn Datasets vorhanden sind, wird hier die Ajax request ausgeführt, um diese erneut zu suchen
      var substring = $("#searchformbyname_input").val();
      var startdate = $("#startyear").val() + "-" + $("#startmonth").val() + "-" + $("#startday").val() + "T" + $("#starthour").val() + ":" + $("#startmin").val() + ":" + $("#startsec").val()+ "Z";
      var enddate = $("#endyear").val() + "-" + $("#endmonth").val() + "-" + $("#endday").val() + "T" + $("#endhour").val() + ":" + $("#endmin").val() + ":" + $("#endsec").val() + "Z";
      var page = 0;
      var bbox="";
      if ($(searchformbybbox_bottomLong).val() != "" && $(searchformbybbox_bottomLat).val() != "" && $(searchformbybbox_topLong).val() != "" && $(searchformbybbox_topLat).val() != ""){
        bbox=($(searchformbybbox_bottomLong).val()+','+ $(searchformbybbox_bottomLat).val() +','+ $(searchformbybbox_topLong).val()+',' +$(searchformbybbox_topLat).val());
      }
      var templateurl = "http://gis-bigdata.uni-muenster.de:14014/search?substring="+substring+"&bbox="+bbox+"&startdate="+startdate+"&enddate="+enddate+"&page=";
      pagerInit(templateurl);
      ajaxrequest(templateurl, pagetoview, dsExpanded, dsBand, dsBtn, dsBandValues, dsVis, dsOpacity);
    }
  }else{
    //Versteckt Button entsprechend der Such
    $('#bboxbutton').show();
    $('#deleteDrawing').hide();
  }
}

/**
 * Die Suche wird ausgeführt, Ergebnisse werde zurückgegeben und verarbeitet
 *@param templateurl URL für die Suche. Suchparamter wurde schon angefügt
 *@param pagetoview Die Seite, die anzeigt werden soll
 *@param expanded Für Permalink: Ist ein Dataset expanded?
 *@param band Für Permalink: Welches Band ist ausgwählt?
 *@param btn Für Permalink: Welcher Radiobtn ist ausgewählt?
 *@param bandValues Für Permalink: Welche Werte sind für die Bänder eingetragen?
 *@param vis Für Permalink: Welches Dataset ist angezeigt?
 *@param opacity Für Permalink: Wie ist die Opacity des angezeigten Datasets?
 */
function ajaxrequest(templateurl, pagetoview, expanded, band, btn, bandValues, vis, opacity){
  $.ajax({
    type: "GET",
    url: templateurl+(pagetoview-1),
    data:'',
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    statusCode: {
      404: function() {
        console.log("something went wrong(404)");
          spinnerHide(document.getElementById('sidebar'));
      }},
      success: function (res, status, request) {
        //Zeigt Paginator an oder auch nicht
        if(res.length == 0){
          $('#page-selection')[0].style.display = "none";
        }else{
          $('#page-selection')[0].style.display = "";
        }
        //HTML zu den Ergebnissen werden erzeugt
        createHTML(res.L1C, pagetoview, expanded, band, btn, bandValues, vis, opacity);
        page = pageCalculator(request.getResponseHeader('X-Dataset-Count'));
        //$('#resultpanel').show();
        console.dir(res);
        console.dir(res.L1C);
        //HTML Element mit Metadaten werden erzeugt
        visualizeMetadata(res, pagetoview);
        //Paginator wird bearbeitet
        $('#page-selection').bootpag({
          total: page,
          page: pagetoview,
          maxVisible: 5,
          leaps: true,
          firstLastUse: true,
          first: '←',
          last: '→',
          wrapClass: 'pagination',
          activeClass: 'active',
          disabledClass: 'disabled',
          next: 'next',
          prev: 'prev',
          lastClass: 'last',
          firstClass: 'first'
        });
        spinnerHide(document.getElementById('sidebar'));
      },
      error: function(xhr, status, error) {
        console.log("Achtung:Es gab einen Fehler bei der AJAX-Anfrage der Fehlercode lautet :" + ""+ xhr.responseText);
        //alert(xhr.responseText);
        spinnerHide(document.getElementById('sidebar'));
      }
    }); //end ajax
  }
