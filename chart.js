// CHART.JS //

// buildChartDataCases function. Called from getHistoricalData.
const buildChartDataCases = (data) => {
  //
  // console.log("In buildChartDataCases : data: " + JSON.stringify(data, null, 4));
  //
  let chartDataCases = [];
  let lastDataPoint;
  //
  for (let date in data.cases) {
    // Testing
    // console.log("In buildChartDataCases: data.cases Y parameter: " + data.cases[date].toLocaleString());
    //
    if (lastDataPoint) {
      //
      let newDataPoint = {
        x: date,
        y: data.cases[date] - lastDataPoint,
      };
      //
      chartDataCases.push(newDataPoint);
      //
    }
    //
    lastDataPoint = data.cases[date];
    //
  }
  //
  return chartDataCases;
  ////
};

// buildChartDataRecovered function. Called from getHistoricalData.
const buildChartDataRecovered = (data) => {
  //
  //console.log("In buildChartDataRecovered : data: " + JSON.stringify(data, null, 4));
  //

  //
  let chartDataRecovered = [];
  let lastDataPoint;
  //
  for (let date in data.recovered) {
    //
    if (lastDataPoint) {
      //
      let newDataPoint = {
        x: date,
        y: data.recovered[date] - lastDataPoint,
      };
      //
      chartDataRecovered.push(newDataPoint);
      //
    }
    //
    lastDataPoint = data.recovered[date];
    //
  }
  //
  return chartDataRecovered;
  ////
}

// buildChartDataDeaths function. Called from getHistoricalData.
const buildChartDataDeaths = (data) => {
  //
  //console.log("In buildChartDataDeaths : data: " + JSON.stringify(data, null, 4));
  //
  let chartDataDeaths = [];
  let lastDataPoint;
  //

  //
  for (let date in data.deaths) {
    //
    if (lastDataPoint) {
      //
      let newDataPoint = {
        x: date,
        y: data.deaths[date] - lastDataPoint,
      };
      //
      chartDataDeaths.push(newDataPoint);
      //
    }
    //
    lastDataPoint = data.deaths[date];
    //
  }
  //
  return chartDataDeaths;
  ////
};

// buildPieChart function.  Left here for reference.
// const buildPieChart = (data) => {
//   var ctx = document.getElementById("myPieChart").getContext("2d");

//   // For a pie chart
//   var myPieChart = new Chart(ctx, {
//     //
//     type: "pie",
//     //
//     options: {
//       maintainAspectRatio: false,
//       // responsive: false,
//       // tooltips. the popup window!
//       tooltips: {
//         mode: "index",
//         intersect: false,
//         // This took me forever to find AND workout. whew.
//         callbacks: {
//           label: function (tooltipItem, data) {
//             //
//             var dataLabel = data.labels[tooltipItem.index];
//             //
//             var value =
//               ": " +
//               data.datasets[tooltipItem.datasetIndex].data[
//                 tooltipItem.index
//               ].toLocaleString();

//             // make this isn't a multi-line label (e.g. [["label 1 - line 1, "line 2, ], [etc...]])
//             if (Chart.helpers.isArray(dataLabel)) {
//               // show value on first line of multiline label
//               // need to clone because we are changing the value
//               dataLabel = dataLabel.slice();
//               dataLabel[0] += value;
//               //
//             } else {
//               //
//               dataLabel += value;
//               //
//             }
//             //

//             // return the text to display on the tooltip
//             return dataLabel;
//             ////
//           }, // end label: function.
//         }, // end callbacks function.
//       }, // end tootips.
//     }, // end options.
//     //
//     data: {
//       datasets: [
//         {
//           data: [data.active, data.recovered, data.deaths],
//           backgroundColor: ["#9d80fe", "#7dd71d", "#fb4443"],
//         },
//       ],

//       // These labels appear in the legend and in the tooltips when hovering different arcs
//       labels: ["Active", "Recovered", "Deaths"],
//     },
//     //
//   });

//   ////
// };

// buildChart function. Builds the linear chart.
const buildChart = (chartDataCases, chartDataRecoverd, chartDataDeaths, dataSetSelect) => {
  //
  // console.log(
  //   "In buildChart function : chartDataCases: " +
  //     JSON.stringify(chartDataCases, null, 4)
  // );
  //
  var timeFormat = "MM/DD/YY";
  var ctx = document.getElementById("myChart").getContext("2d");
  //
  if (dataSetSelect === "cases") {
    //
    dataSet = {
      label: "Daily New Cases",
      backgroundColor: "rgba(204, 16, 52, 0.5)",
      borderColor: "#B90808",
      fill: true,
      data: chartDataCases,
    }
    //
  } else if (dataSetSelect === "recovered") {
    //
    dataSet = {
      label: "Daily New Recovered",
      backgroundColor: "rgba(125, 215, 29, 0.5)",
      borderColor: "#7dd71d",
      fill: true,
      data: chartDataRecoverd,
    }
    //
  } else if (dataSetSelect === "deaths") {
    //
    dataSet = {
      label: "Daily New Deaths",
      backgroundColor: "rgba(29, 44, 77, 0.5)",
      borderColor: "#1d2c4d",
      fill: true,
      data: chartDataDeaths,
    }
    //
  } else {
    //
    dataSet = {
      label: "Daily New Cases",
      backgroundColor: "rgba(204, 16, 52, 0.5)",
      borderColor: "#B90808",
      fill: true,
      data: chartDataCases,
    }
  }
  //
  // Troubleshooting
  // console.log("In buildChar: casesType or dataSetSelect and...", dataSetSelect + "...dataSet...", dataSet);
  //
  chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // Configuration options go here
    options: {
      //
      animation: {
        duration: 1500,
        easing: 'linear',
      },
      //
      elements: {
        point: {
          radius: 0
        }
      },
      //
      maintainAspectRatio: false,
      // responsive: false,
      //
      // tooltips. the popup window!
      tooltips: {
        mode: "index",
        intersect: false,
        // This took me forever to find AND workout. whew.
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label || "";

            if (label) {
              label += ": ";
            }
            label += numeral(tooltipItem.yLabel).format("0,0");
            return label;
          },
        },
        // end callbacks function.
      }, // end tootips.
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true,
              borderDash: [8, 4],
            },
            type: "time",
            time: {
              parser: timeFormat,
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
            gridLines: {
              display: false,

            },
            ticks: {
              // Include a comma sign in the ticks
              callback: function (value, index, values) {
                return numeral(value).format("0a");
              },
            },
          },
        ],
      },
    },
    // The data for our selected dataset.
    data: {
      datasets: [dataSet,],
    },
    //
  });
  ////
};
///////////////////////////////////////////////////////////////////
