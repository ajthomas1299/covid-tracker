// SCRIPT.JS //

window.onload = () => {
  //
  //console.log("in window onload!");
  //
  getCountryData();
  getHistoricalData();
  getWorldCoronaData();
  //
  // document.querySelector(".active-cases-card").addEventListener("click", () => {
  //   console.log("yo we clicked");
  // });
};

///////////////////////////////////////////

// initialize global variables.
let map;
let infoWindow;
let coronaGlobalCountryData;
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
  //console.log("in initMap");

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
  //console.log("in getCountryData");
  //
  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      coronaGlobalCountryData = data;
      showDataOnMap(data);
      showDataInTable(data);
      //
      //console.log(data);
    });
  ////
};

// getWorldCoronaData function.
const getWorldCoronaData = () => {
  fetch("https://disease.sh/v2/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //
      // console.log(data);
      //
      setStatsCardNumbers(data);
      //
      let chartData = buildPieChart(data);
      //
    });
};

// getHistoricalData function.  fetch / get the corona virus historical data.
const getHistoricalData = () => {
  fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let chartDataCases = buildChartDataCases(data);
      let chartDataRecovered = buildChartDataRecovered(data);
      let chartDataDeaths = buildChartDataDeaths(data);
      buildChart(chartDataCases, chartDataRecovered, chartDataDeaths);
    });
};

// changeDataSelection function.
const changeDataSelection = (elem, casesType) => {
  // Testing
  // console.log(casesType);
  // console.log(mapCircles);

  //
  let current = document.getElementsByClassName("show-clicked");

  // If there's no active class
  if (current.length > 0) {
    current[0].className = current[0].className.replace(" show-clicked", "");
  }

  //
  elem.classList.toggle("show-clicked");
  //
  clearTheMap();
  //
  showDataOnMap(coronaGlobalCountryData, casesType);
  ////
};

// clearTheMap function.
const clearTheMap = () => {
  //
  for (let circle of mapCircles) {
    //
    circle.setMap(null);
  }

  ////
};

// setStatsCardNumbers function.
const setStatsCardNumbers = (data) => {
  //
  // console.log("In setStatsCardNumbers: data: ");
  // console.log("Cases: " + data.cases);
  // console.log("Active: " + data.cases);
  // console.log("Recovered: " + data.cases);
  // console.log("Death: " + data.cases);
  //
  // data.active, data.recovered, data.deaths
  //
  //
  let htmlTotalCases = "";
  let htmlActiveCases = "";
  let htmlRecoveredCases = "";
  let htmlDeathCases = "";
  //
  document.getElementById(
    "total-cases"
  ).innerHTML = data.cases.toLocaleString();
  document.getElementById(
    "active-cases"
  ).innerHTML = data.active.toLocaleString();
  document.getElementById(
    "recovered-cases"
  ).innerHTML = data.recovered.toLocaleString();
  document.getElementById(
    "death-cases"
  ).innerHTML = data.deaths.toLocaleString();
  ////
};

// openInfoWindow function.
const openInfoWindow = () => {
  infoWindow.open(map);
};

// showDataOnMap function.
const showDataOnMap = (data, casesType = "cases") => {
  //
  data.map((country) => {
    //
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    //
    var countryCircle = new google.maps.Circle({
      // strokeColor: "#FF0000",
      strokeColor: casesTypeColors[casesType],
      strokeOpacity: 0.8,
      strokeWeight: 2,
      // fillColor: "#FF0000",
      fillColor: casesTypeColors[casesType],
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country[casesType],
    });

    // load our array we will use to clear the circles later.
    mapCircles.push(countryCircle);

    //
    var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${
                  country.countryInfo.flag
                });">
                </div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total: ${country.cases.toLocaleString()}
                </div>
                <div class="info-recovered">
                    Recovered: ${country.recovered.toLocaleString()}
                </div>
                <div class="info-deaths">
                    Deaths: ${country.deaths.toLocaleString()}
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
  //
  var html = "";
  //
  data.forEach((country) => {
    html += `
        <tr>
            <td>${country.country}</td>
            <td>${country.cases.toLocaleString()}</td>
            <td>${country.recovered.toLocaleString()}</td>
            <td>${country.deaths.toLocaleString()}</td>
        </tr>
        `;
  });
  //
  document.getElementById("table-data").innerHTML = html;
  ////
};

//////////////////////////////////////////////////////////
