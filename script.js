// SCRIPT.JS //

window.onload = () => {
  //
  //console.log("in window onload!");
  //
  getCountriesData();
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
const worldwideSelection = {
  name: `<img style="vertical-align: middle; width: 25px;height:25px;" src="globe.png">` + 'Worldwide',
  value: 'www',
  selected: true,
}
let casesTypeColors = {
  // cases: "#1d2c4d",
  cases: "#B90808",
  active: "#9d80fe",
  recovered: "#7dd71d",
  // deaths: "#fb4443",
  deaths: "#1d2c4d",
};

//
const mapCenter = {
  lat: 34.80746,
  lng: -40.4796
}

//
// const mapCenter = {
//   lat: 39.8283,
//   lng: -98.5795
// }

// initMap function.
function initMap() {
  //
  //console.log("in initMap");

  //
  map = new google.maps.Map(document.getElementById("map"), {
    center: mapCenter,
    zoom: 3,
    styles: mapStyle,
  });
  //
  infoWindow = new google.maps.InfoWindow();
  ////
}

// initDropdown function.
const initDropdown = (searchList) => {
  //

  //
  $('.ui.dropdown').dropdown({
    values: searchList,
    onChange: function (value, text) {
      // Test
      //console.log("In initDropdown, getting value: ", value)

      if (value !== worldwideSelection.value) {
        getCountryData(value);
      } else {
        getWorldCoronaData();
      }
    }
  });
}

// getCountryData function.
const getCountryData = (countryIso) => {
  //
  //console.log("in getCountryData");
  //
  const url = "https://disease.sh/v3/covid-19/countries/" + countryIso;
  //

  //
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let newZoom = 3;
      if ((countryIso == "USA") || (countryIso == "BRA")) {
        newZoom = 3;
      } else {
        newZoom = 5;
      }
      // Testing
      // console.log("In getCountryData: countryIso: ", countryIso);
      // console.log("In getCountryData: newZoom: ", newZoom);
      //
      setMapCenter(data.countryInfo.lat, data.countryInfo.long, newZoom);
      setStatsCardNumbers(data);
      //
      //console.log(data);
    });
  ////
};

// getCountriesData function.
const getCountriesData = () => {
  //
  //console.log("in getCountryData");
  //
  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      coronaGlobalCountryData = data;
      setSearchList(data);
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
      setMapCenter(mapCenter.lat, mapCenter.lng, 2);
      //
      // let chartData = buildPieChart(data);
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

  // Clear current active card
  if (current.length > 0) {
    current[0].className = current[0].className.replace(" show-clicked", "");
  }

  // Add show-clicked class names to clicked on element.
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

//
const setMapCenter = (lat, long, zoom) => {
  //
  map.setZoom(zoom);
  //
  map.panTo({
    lat: lat,
    lng: long
  });
}

//
const setSearchList = (data) => {
  // Test
  // console.log("In setSearchList: data: ", data);
  //
  let searchList = [];
  //
  searchList.push(worldwideSelection);

  //
  data.forEach((countryData) => {
    searchList.push({
      name: `<img style="vertical-align: middle; width: 25px;height:20px;" src=${countryData.countryInfo.flag}>` + countryData.country,
      value: countryData.countryInfo.iso3
    })
  })
  // Test
  //console.log("In setSearchList : searchList: ", searchList)
  //
  initDropdown(searchList);
  ////
}

// setStatsCardNumbers function.
const setStatsCardNumbers = (data) => {
  // Testing
  //console.log("In setStatsCardNumbers: data: ");
  //console.log(data);
  // console.log("Cases: " + data.cases);
  // console.log("Active: " + data.cases);
  // console.log("Recovered: " + data.cases);
  // console.log("Death: " + data.cases);
  //
  // data.active, data.recovered, data.deaths
  //
  let addedCases = numeral(data.todayCases).format('+0,0');
  let recoveredCases = numeral(data.todayRecovered).format('+0,0');
  let deathCases = numeral(data.todayDeaths).format('+0,0');
  //
  let totalCases = numeral(data.cases).format('0.0a');
  let totalRecoveredCases = numeral(data.recovered).format('0.0a');
  let totalDeathCases = numeral(data.deaths).format('0.0a');
  //
  document.getElementById(
    "total-cases"
  ).innerHTML = addedCases;
  //
  //
  document.getElementById(
    "recovered-cases"
  ).innerHTML = recoveredCases;
  //
  document.getElementById(
    "death-cases"
  ).innerHTML = deathCases;
  //
  document.querySelector(
    ".cases-total"
  ).innerHTML = `${totalCases} Total`;
  //
  //
  document.querySelector(
    ".recovered-total"
  ).innerHTML = `${totalRecoveredCases} Total`;
  //
  document.querySelector(
    ".deaths-total"
  ).innerHTML = `${totalDeathCases} Total`;
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

// Comparer function. To help the javascript sort function Sort the Json Object in a specified order by.
const getSortOrder = (attribute, orderBy) => {
  //
  return function (a, b) {
    //
    if (orderBy.toUpperCase() === "DESC") {
      //
      if (b[attribute] > a[attribute]) {
        return 1;
      } else if (b[attribute] < a[attribute]) {
        return - 1;

      } else {
        return 0;
      };
      //
    } else {
      //
      if (a[attribute] > b[attribute]) {
        return 1;
      } else if (a[attribute] < b[attribute]) {
        return - 1;

      } else {
        return 0;
      };
      //
    }
    ////
  }
};

//
const panMapToCountrySelectedInTable = (tableRowElement) => {
  // Testing
  //console.log("In panMap...: tableRowElement : ", tableRowElement);
  //
  //console.log("In panMap...: element.classList : ", tableRowElement.classList);
  //

  //
  let col;
  let newLat;
  let newLng;
  let countryIso;
  //
  for (let i = 0; col = tableRowElement.cells[i]; i++) {
    //columns would be accessed using the "col" variable assigned in the for loop
    // Testing
    //console.log("innerText: i : " + i + " " + col.innerText);    //Will give you the td value
    //
    if (i === 3) {
      newLat = col.innerText;
    } else if (i === 4) {
      newLng = col.innerText;
    } else if (i === 5) {
      countryIso = col.innerText;
    }
    ////
  }

  //
  let newZoom = 3;
  if ((countryIso == "USA") || (countryIso == "BRA") || (countryIso == "RUS")) {
    newZoom = 3;
  } else {
    newZoom = 5;
  }
  //
  setMapCenter(Number(newLat), Number(newLng), Number(newZoom));
  ////
}

// showDataInTable function.
const showDataInTable = (data, casesType = "cases") => {
  // Troubleshooting
  //console.log("In showDataInTable : ", data);
  // Sort the data in the JSON object by number of cases desc.
  data.sort(getSortOrder("cases", "DESC")); //pass the attribute to be sorted on and the order by. (ASC or DESC)
  //
  var html = "";
  //
  data.forEach((country) => {
    html += `
        <tr class="tRow" onclick="panMapToCountrySelectedInTable(this)" style="cursor: pointer;">
            <td class="tFlag"><img style="width: 30px;height:25px;" src=${country.countryInfo.flag}></td>
            <td class="tCountry">${country.country}</td>
            <td class="tCases">${country.cases.toLocaleString()}</td>
            <td class="tLat" style="display: none;">${country.countryInfo.lat}</td>
            <td class="tLong" style="display: none;">${country.countryInfo.long}</td>
            <td class="tIso3" style="display: none;">${country.countryInfo.iso3}</td>
        </tr>
        `;
  });
  //
  document.getElementById("table-data").innerHTML = html;
  ////
};

//////////////////////////////////////////////////////////
