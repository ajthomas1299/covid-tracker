// SCRIPT.JS //

window.onload = () => {
  //
  //console.log("in window onload!");
  //
  getCountriesData();
  getHistoricalData();
  getWorldCoronaData();
  //
  initSlider();
  // An alternative method. Here for reference.
  // });
  // document.querySelector(".active-cases-card").addEventListener("click", () => {
  //   console.log("yo we clicked");
  // });
};

///////////////////////////////////////////

// initialize global variables.
let map;
let infoWindow;
let coronaGlobalCountryData;
let chartDataCases;
let chartDataRecovered;
let chartDataDeaths;
let casesType;
let chart;
let mapCircles = [];
let tableDataHasLoaded = false;
//
const worldwideSelection = {
  name: `<img style="vertical-align: middle; width: 25px;height:25px;" src="globe.png">` + 'Worldwide',
  value: 'www',
  selected: true,
}
//
let casesTypeColors = {
  cases: "#B90808",
  active: "#9d80fe",
  recovered: "#7dd71d",
  deaths: "#1d2c4d",
};

//
const mapCenter = {
  lat: 34.80746,
  lng: -40.4796
}

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
  $('.ui.dropdown').dropdown({
    values: searchList,
    onChange: function (value, text) {
      // Test
      //console.log("In initDropdown, getting value: ", value)

      if (value !== worldwideSelection.value) {
        getCountryData(value);
        //
        scrollTable(value);
        ////
      } else {
        getWorldCoronaData();
        // To make sure scroll data is not called on init.
        if (tableDataHasLoaded) {
          scrollTable(value);
        } else {
          tableDataHasLoaded = true;
        }
        ////
      }
    }
  });
}

// init slider. https://kenwheeler.github.io/slick/
const initSlider = () => {
  //
  $(document).ready(function () {
    $('.slider-container').slick({
      dots: true,
      arrows: true,
      prevArrow: "<button type='button' class='slick-prev pull-left'><i class='fa fa-angle-left' aria-hidden='true'></i></button>",
      nextArrow: "<button type='button' class='slick-next pull-right'><i class='fa fa-angle-right' aria-hidden='true'></i></button>",
      infinite: false,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      adaptiveHeight: false,
      centerMode: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
  });
  ////
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
      if ((countryIso == "USA") || (countryIso == "BRA") || (countryIso == "RUS")) {
        newZoom = 3;
      } else {
        newZoom = 5;
      }
      // Testing
      // console.log("In getCountryData: countryIso: ", countryIso);
      // console.log("In getCountryData: newZoom: ", newZoom);
      //
      setStatsCardNumbers(data);
      setMapCenter(data.countryInfo.lat, data.countryInfo.long, newZoom);
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
      ////
    });
  ////
};

// getWorldCoronaData function.
const getWorldCoronaData = () => {
  //
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
    });
  ////
};

// getHistoricalData function.  fetch / get the corona virus historical data.
const getHistoricalData = () => {
  fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      chartDataCases = buildChartDataCases(data);
      chartDataRecovered = buildChartDataRecovered(data);
      chartDataDeaths = buildChartDataDeaths(data);
      buildChart(chartDataCases, chartDataRecovered, chartDataDeaths, "cases");
    });
  ////
};



// changeDataSelection function.
const changeDataSelection = (elem, casesTypeSelected) => {
  // Testing
  // console.log(casesType);
  // console.log(mapCircles);

  casesType = casesTypeSelected;
  //
  let current = document.getElementsByClassName("show-clicked");

  // Clear current active Card.
  if (current.length > 0) {
    current[0].className = current[0].className.replace(" show-clicked", "");
  }

  // Add show-clicked class names to clicked on Card element.
  elem.classList.toggle("show-clicked");
  //
  clearTheMap();
  //
  showDataOnMap(coronaGlobalCountryData, casesType);
  //
  // Set new map title
  if (casesType === "cases") {
    //
    document.getElementById(
      "map-title"
    ).innerHTML = "Coronavirus Cases";
    //
  } else if (casesType === "recovered") {
    //
    document.getElementById(
      "map-title"
    ).innerHTML = "Recovered Cases";
    //
  } else if (casesType === "deaths") {
    //
    document.getElementById(
      "map-title"
    ).innerHTML = "Coronavirus Deaths";
    //
  } else {
    //
    document.getElementById(
      "map-title"
    ).innerHTML = "Coronavirus Cases";
    //
  } // end if

  //
  // clearTheLinearChart();
  chart.destroy();
  //
  // showDataOnLinearChart(coronaGlobalCountryData, casesType);
  //
  buildChart(chartDataCases, chartDataRecovered, chartDataDeaths, casesType);
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
  ////
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
      name: `<img style="vertical-align: middle; width: 30px;height:20px;" src=${countryData.countryInfo.flag}>` + countryData.country,
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
  //
  ////
};

// openInfoWindow function.
const openInfoWindow = () => {
  //
  infoWindow.open(map);
  ////
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
      strokeColor: casesTypeColors[casesType],
      strokeOpacity: 0.8,
      strokeWeight: 2,
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
  ////
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

  // Set Search to reflect table click.
  // worldwideSelection.value
  $('.ui.dropdown').dropdown('set selected', countryIso);

  ////
  getCountryData(countryIso);
  ////
}

//
const scrollTable = (searchClickCountryIso) => {
  // Testing
  //console.log("In scrollTable: searchClickInfo: ", searchClickCountryIso);
  //

  //
  let i = 0;
  //
  // while (document.getElementById('table-data').rows[i].cells[5].innerText != searchClickCountryIso) {
  // while (i < 300) {
  while (i < coronaGlobalCountryData.length) {
    //
    document.getElementById('table-data').rows[i].scrollIntoView(true);
    //
    // console.log("In scrollTable: countryIso: ", document.getElementById('table-data').rows[i].cells[5].innerText);
    // //
    if ((document.getElementById('table-data').rows[i].cells[5].innerText === searchClickCountryIso) ||
      (searchClickCountryIso === "www")) {
      //
      break;
      //
    } else {
      //
      i++;
      //
    }
    //
    // i++;
    ////
  }
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
            <td class="tFlag"><img style="width: 37px;height:25px;" src=${country.countryInfo.flag}></td>
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
