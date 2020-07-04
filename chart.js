// CHART.JS //

// window.onload = () => {
//   // getCountryData();
//   // getHistoricalData();
//   getWorldCoronaData();
// };

/////////////////////////////////

// var map;
// var infoWindow;

// initMap function.
// function initMap() {
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: 39.8283, lng: -98.5795 },
//     zoom: 3,
//     styles: mapStyle,
//   });
//   infoWindow = new google.maps.InfoWindow();
// }

// getCountryData function.
// const getCountryData = () => {
//   fetch("https://corona.lmao.ninja/v2/countries")
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       showDataOnMap(data);
//       showDataInTable(data);
//     });
// };

// getWorldCoronaData function.
const getWorldCoronaData = () => {
  fetch("https://disease.sh/v2/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let chartData = buildPieChart(data);
      buildChart(chartData);
    });
};

// fetch / get the disease data.
// fetch("https://disease.sh/v2/all")
//     .then((response)=>{
//         return response.json()
//     }).then((data)=>{
//         buildPieChart(data);
//     })

// getHistoricalData function.  fetch / get the corona virus historical data.
const getHistoricalData = () => {
  fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let chartData = buildChartData(data);
      buildChart(chartData);
    });
};

// buildChartData function.
const buildChartData = (data) => {
  let chartData = [];
  for (let date in data.cases) {
    let newDataPoint = {
      x: date,
      y: data.cases[date],
    };
    chartData.push(newDataPoint);
  }
  return chartData;
};

// buildPieChart function.
const buildPieChart = (data) => {
  var ctx = document.getElementById("myPieChart").getContext("2d");

  // For a pie chart
  var myPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      datasets: [
        {
          data: [data.active, data.active, data.deaths],
          backgroundColor: ["#9d80fe", "#7dd71d", "#fb4443"],
        },
      ],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ["Active", "Recovered", "Deaths"],
    },
    // options: {
    //   maintainAspectRation: false,
    //   responsive: true
    // }
  });

  ////
};

// buildChart function.
const buildChart = (chartData) => {
  console.log("All if good");
  var timeFormat = "MM/DD/YY";
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      datasets: [
        {
          label: "Total Cases",
          backgroundColor: "#1d2c4d",
          borderColor: "#1d2c4d",
          data: chartData,
        },
      ],
    },

    // Configuration options go here
    options: {
      maintainAspectRatio: false,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              format: timeFormat,
              tooltipFormat: "ll",
            },
            // scaleLabel: {
            //   display: true,
            //   labelString: "Date",
            // },
          },
        ],
        yAxes: [
          {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return numeral(value).format("0,0");
              },
            },
          },
        ],
      },
    },
  });
};

// openInfoWindow function.
// const openInfoWindow = () => {
//   infoWindow.open(map);
// };

// // showDataOnMap function.
// const showDataOnMap = (data) => {
//   data.map((country) => {
//     let countryCenter = {
//       lat: country.countryInfo.lat,
//       lng: country.countryInfo.long,
//     };

//     var countryCircle = new google.maps.Circle({
//       strokeColor: "#FF0000",
//       strokeOpacity: 0.8,
//       strokeWeight: 2,
//       fillColor: "#FF0000",
//       fillOpacity: 0.35,
//       map: map,
//       center: countryCenter,
//       radius: country.cases,
//     });

//     var html = `
//               <div class="info-container">
//                   <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">
//                   </div>
//                   <div class="info-name">
//                       ${country.country}
//                   </div>
//                   <div class="info-confirmed">
//                       Total: ${country.cases}
//                   </div>
//                   <div class="info-recovered">
//                       Recovered: ${country.recovered}
//                   </div>
//                   <div class="info-deaths">
//                       Deaths: ${country.deaths}
//                   </div>
//               </div>
//           `;

//     var infoWindow = new google.maps.InfoWindow({
//       content: html,
//       position: countryCircle.center,
//     });
//     google.maps.event.addListener(countryCircle, "mouseover", function () {
//       infoWindow.open(map);
//     });

//     google.maps.event.addListener(countryCircle, "mouseout", function () {
//       infoWindow.close();
//     });
//   });
// };

// showDataInTable function.
// const showDataInTable = (data) => {
//   var html = "";
//   data.forEach((country) => {
//     html += `
//           <tr>
//               <td>${country.country}</td>
//               <td>${country.cases}</td>
//               <td>${country.recovered}</td>
//               <td>${country.deaths}</td>
//           </tr>
//           `;
//   });
//   document.getElementById("table-data").innerHTML = html;
// };

///////////////////////////////////////////////////////////////////
