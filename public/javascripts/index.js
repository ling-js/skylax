/**
* Geosoftware I, SoSe 2017, final
* @author Jan Speckamp (428367)
*/
/**
* Loads all requested Stages. Overwrites all Submit Handlers that are already present,
*/
$(document).ready(function() {
  initMap();
  // Show all Items when initially opening Search Bar
  sidebar.on('content', function(e) {
  });

  initStartup();
  //Keine Ahnung ob wir das hier noch brauchen -> $('#resultpanel').hide();

});

/**
 * Initialises all required stuff.
 * Adds options to date selector.
 * Load every permalink saved things.
 */
function initStartup(){
  initOptions();
  $.when(loadHash()).done(loadPermaSearchParams());
}



