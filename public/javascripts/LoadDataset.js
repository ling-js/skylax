
$(document).ready(function() {
  /**
   * Die Suche wird ausgeführt, Ergebnisse werde zurückgegeben und verarbeitet
   */
  $('#searchform').submit(function(e) {
      spinnerShow(document.getElementById('sidebar'));
      // Prevent default html form handling
      e.preventDefault();
      var that = this;
      //Prüft, ob Enddate später ist
      if(compareDates() == true){
        //Fügt Eingaben aus den Wertfeldern zusammen zu einer templateurl
        var substring = $("#searchformbyname_input").val();
        var startdate = $("#startyear").val() + "-" + $("#startmonth").val() + "-" + $("#startday").val() + "T" + $("#starthour").val() + ":" + $("#startmin").val() + ":" + $("#startsec").val()+ "Z";
        var enddate = $("#endyear").val() + "-" + $("#endmonth").val() + "-" + $("#endday").val() + "T" + $("#endhour").val() + ":" + $("#endmin").val() + ":" + $("#endsec").val() + "Z";
        var page = 0;
        var pagetoview = 1;
        var bbox="";
        if ($(searchformbybbox_bottomLong).val() != "" && $(searchformbybbox_bottomLat).val() != "" && $(searchformbybbox_topLong).val() != "" && $(searchformbybbox_topLat).val() != ""){
          bbox=($(searchformbybbox_bottomLong).val()+','+ $(searchformbybbox_bottomLat).val() +','+ $(searchformbybbox_topLong).val()+',' +$(searchformbybbox_topLat).val());
        }
        var templateurl = "http://gis-bigdata.uni-muenster.de:14014/search?substring="+substring+"&bbox="+bbox+"&startdate="+startdate+"&enddate="+enddate+"&page=";
        //Initalisiert den Paginator
        pagerInit(templateurl);
        var expanded = [];
        //Startet Ajax Reuqest
        ajaxrequest(templateurl, pagetoview);
    }else{
      //Falsche Daten
      alert("Startdate must be before Enddate");
      spinnerHide(document.getElementById('sidebar'));
    }
  });
});


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
        createHTML(res, pagetoview, expanded, band, btn, bandValues, vis, opacity);
        page = pageCalculator(request.getResponseHeader('X-Dataset-Count'));
        //HTML Element mit Metadaten werden erzeugt
        visualizeMetadata(res, pagetoview, band, vis);
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
