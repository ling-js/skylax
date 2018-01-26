/** Alles was mit der Searchform zu tun hat!*/


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
        if(page == 0){
          $("#page-selection")[0].children[0].style.display = "none";
        }else{
          $("#page-selection")[0].children[0].style.display = "";
        }
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
 * Calculats the pages needed to show all datasets
 * @param allContents Number of dataset results
 * @return Number of pages needed
 */
function pageCalculator(allContents){
  if(allContents%8 == 0){
    allContents = allContents/8;
  }else{
    allContents = (Math.floor(allContents/8)+1);
  }
  return allContents;
}







/**
 *Erstellt aus einem String ein Date
 *@param str Ist "end" oder "start", je nachdem welches Date erstellt werden soll
 *@return Ein Datum
 */

function createDate(str){
  var dateString = $("#"+str+"year").val() + "-" + $("#"+str+"month").val() + "-" + $("#"+str+"day").val() + "T" + $("#"+str+"hour").val() + ":" + $("#"+str+"min").val() + ":" + $("#"+str+"sec").val();
  var date = new Date(dateString);
  return date;
}



/**
 * Initialises the Paginator.
 *@param templateurl URL for the Ajax request
 */
function pagerInit(templateurl){
  $('#page-selection').bootpag({
    total: 0,
    page: 0,
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
  }).on("page", function(event, /* page number here */ num){
    spinnerShow(document.getElementById('sidebar'));
    ajaxrequest(templateurl, num); // some ajax content loading...
  });
}



/**
 * Adds options to the date slector
 *@param id ID of the date field
 *@param startInt First Option Value
 *@param endInt Last Option Value
 *@param selectedInt Value that should be selcted on creation
 */
function addOption(id, startInt, endInt, selectedInt){
  for(var i = startInt; i < endInt+1; i++){
    var val = i;
    if(i<10){
      val="0"+i;
    }
   $("#"+id)[0].options[$("#"+id)[0].options.length] = new Option(i, val);
   if(i == selectedInt){
     $("#"+id)[0].options[$("#"+id)[0].options.length-1].selected = "selected";
   }
  }
}




/**
 * Adds all options to the date slector on start up
 */
function initOptions(){
  addOption("startday",1,31,1);
  addOption("startmonth",1,12,1);
  addOption("startyear",2015,2026,1);
  addOption("starthour",0,23,0);
  addOption("startmin",0,59,0);
  addOption("startsec",0,59,0);
  addOption("endday",1,31,31);
  addOption("endmonth",1,12,12);
  addOption("endyear",2015,2026,2017);
  addOption("endhour",0,23,23);
  addOption("endmin",0,59,59);
  addOption("endsec",0,59,59);
}

/**
 * Compares the 2 date to make sure, the startdate is before the enddate
 *@return Bool value, true means startdate is before enddate
 */
function compareDates(){
  var startDate = createDate("start");
  var endDate = createDate("end");
  if(startDate < endDate){
    return true;
  }else{
    return false;
  }
}





/**
 *Ändert den Tag, wenn der Tag in diese Monat nicht existiert. Bsp.: 31.02.
 *Würde auf den 01.02. springen.
 *Options für die Tage werden entfernt oder hinzugefügt.
 *@param str Ist "end" oder "start", je nachdem bei welchem der Tag korrigiert werden soll
 */
function updateDay(str){
  if(lessDayMonth(str) == true){
    if($("#"+str+"day")[0].options.length == 31){
      $("#"+str+"day")[0].options[30].remove();
    }else if($("#"+str+"day")[0].options.length < 30){
      addOption(str+"day", $("#"+str+"day")[0].options.length+1, 30);
    }
  }else if($("#"+str+"month").val() == 2){
    if(feburaryCalc(str) == true){
      if($("#"+str+"day")[0].options.length == 28){
        addOption(str+"day", 29, 29);
      }else{
        for(var i = $("#"+str+"day")[0].options.length; i > 29; i--){
          $("#"+str+"day")[0].options[i-1].remove();
        }
      }
    }else{
      for(var i = $("#"+str+"day")[0].options.length; i > 28; i--){
        $("#"+str+"day")[0].options[i-1].remove();
      }
    }
  }else if($("#"+str+"day")[0].options.length < 31){
    addOption(str+"day", $("#"+str+"day")[0].options.length+1, 31, 1);
  }
}

/**
 *Gibt an, ob ein Monat ein Monat mit weniger als 31 Tagen ist(außer Februar)
 *@param str Ist "end" oder "start", je nachdem bei welchem der Monat kontrolliert werden soll
 *@return True für kurzer Monat, False für einen langen Monat
 */
function lessDayMonth(str){
  var months = [4, 6, 9, 11];
  for (var i = 0; i < months.length; i++) {
    if(months[i] == $("#"+str+"month").val()){
      return true;
    }
  }
  return false;
}

/**
 *Gibt an, ob der Feburar in einem Schaltjahr liegt, also 29 Tage hat
 *@param str Ist "end" oder "start", je nachdem bei welchem der Monat kontrolliert werden soll
 *@return True für langen Februar, False für einen kurzen Februar
 */
function feburaryCalc(str){
  if($("#"+str+"year").val() % 4 == 0){
    if($("#"+str+"year").val() % 100 == 0){
      if($("#"+str+"year").val() % 400 == 0){
        return true;
      }else{
        return false;
      }
    }
    return true;
  }
  return false;
}


/**
 *Toggelt die detailierte Zeitsuchfunktion(Stunde, Minute, Sekunde) der Searchform
 *@param i ID des HTML-Elements("detailedendtime" oder "detailedendtime")
 */
function toggleIt(i){
    var x = document.getElementById(i);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
