// SCRIPT.JS //

window.onload = () => {
  //
  console.log("in window onload!");
  //
  getCountryData();
  getHistoricalData();
  //
  // document.querySelector("active-cases-card").addEventListener("click", () => {
  //   console.log("yo we clicked");
  // });
};

///////////////////////////////////////////

// initialize variables.
let map;
let infoWindow;
let coronaGlobalData;
let mapCircles = [];
let casesTypeColors = {
  cases: "#1d2c4d",
  active: "#9d80fe",
  recovered: "#7dd71d",
  deaths: "#fb4443",
};

// initMap function.
function initMap() {
  //
  console.log("in initMap");

  //
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.8283, lng: -98.5795 },
    zoom: 3,
    styles: mapStyle,
  });
  //
  infoWindow = new google.maps.InfoWindow();
  ////
}

// getCountryData function.
const getCountryData = () => {
  //
  console.log("in getCountryData");
  //
  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showDataOnMap(data);
      showDataInTable(data);
      //
      console.log(data);
    });
  ////
};

// changeDataSelection function.
const changeDataSelection = (casesType) => {
  //
};

// openInfoWindow function.
const openInfoWindow = () => {
  infoWindow.open(map);
};

// showDataOnMap function.
const showDataOnMap = (data) => {
  //
  data.map((country) => {
    //
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    //
    var countryCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country.cases,
    });

    //
    var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">
                </div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total: ${country.cases}
                </div>
                <div class="info-recovered">
                    Recovered: ${country.recovered}
                </div>
                <div class="info-deaths">
                    Deaths: ${country.deaths}
                </div>
            </div>
        `;
    /////

    //
    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCircle.center,
    });
    //
    google.maps.event.addListener(countryCircle, "mouseover", function () {
      infoWindow.open(map);
    });
    //
    google.maps.event.addListener(countryCircle, "mouseout", function () {
      infoWindow.close();
    });
    ////
  });
  ////
};

// showDataInTable function.
const showDataInTable = (data) => {
  var html = "";
  data.forEach((country) => {
    html += `
        <tr>
            <td>${country.country}</td>
            <td>${country.cases}</td>
            <td>${country.recovered}</td>
            <td>${country.deaths}</td>
        </tr>
        `;
  });
  //
  document.getElementById("table-data").innerHTML = html;
  ////
};

//////////////////////////////////////////////////////////
