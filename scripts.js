document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("mapSelect").addEventListener("change", function() {
    var mapSelect = document.getElementById("mapSelect");
    var selectedMap = mapSelect.value;
  
    var mapTitle = document.getElementById("mapTitle");
    var mapDescription = document.getElementById("mapDescription");
    var mapDetails = document.getElementById("mapDetails");
  
    mapDetails.style.display = selectedMap !== "0" ? "block" : "none";
  
    switch (selectedMap) {
      case "1":
        mapTitle.textContent = "Knee Deep in the Dead";
        mapDescription.innerHTML = "<span class='stat'><b>STARTING HERO:</b></span> <span class='additional-text'>Christian</span> <br><span class='stat'><b>STARTING ARMY:</b></span> <span class='additional-text'>Few Marksmen, Few Crusaders, Few Halebardier</span> <br><span class='stat'><b>BUILDINGS:</b></span> <span class='additional-text'>No Home Castle</span> <br><span class='stat'><b>RESOURCES:</b></span> <span class='additional-text'>Resources List 1</span> <br><span class='stat'><b>GOAL:</b></span> <span class='additional-text'>Defeat all enemy heroes and capture all enemy towns (in x rounds)</span> <br><span class='stat'><b>MAP:</b></span><br><br><div class='mapImageContainer'><img class='mapImage' src='KDD_hexes.png' alt='Map Image'></div><br><i>Click to enlarge image</i>";
        break;
      case "2":
        mapTitle.textContent = "Good to Go";
        mapDescription.innerHTML = "<span class='stat'><b>STARTING HERO:</b></span> <span class='additional-text'>Random</span> <br><span class='stat'><b>STARTING ARMY:</b></span> <span class='additional-text'>Few Tier #1, #2 and #3 units 2</span><br><span class='stat'><b>BUILDINGS:</b></span> <span class='additional-text'>All</span> <br><span class='stat'><b>RESOURCES:</b></span> <span class='additional-text'>Resource List 2</span> <br><span class='stat'><b>GOAL:</b></span> <span class='additional-text'>Defeat all enemy heroes and capture all enemy towns (in x rounds)</span> <br><span class='stat'><b>MAP:</b></span><br><br><div class='mapImageContainer'><img class='mapImage' src='GtG_hexes.png' alt='Map Image'></div><br><i>Click to enlarge image</i>";
        break;
      case "3":
        mapTitle.textContent = "More Maps coming soon!";
        mapDescription.innerHTML = "";
        break;
      default:
        mapDetails.style.display = "none"; // Hide details if not a valid option
        break;
    }
  });

  document.getElementById("mapDescription").addEventListener("click", function(event) {
    if (event.target.tagName === "IMG") {
      if (!event.target.classList.contains("zoomed")) {
        event.target.classList.add("zoomed");
      } else {
        event.target.classList.remove("zoomed");
      }
    }
  });
});
