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
