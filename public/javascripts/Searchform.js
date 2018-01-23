/** Alles was mit der Searchform zu tun hat!*/

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
