// CHART.JS //

// buildChartDataCases function. Called from getHistoricalData.
const buildChartDataCases = (data) => {
  //
  // console.log(
  //   "In buildChartDataCases : data: " + JSON.stringify(data, null, 4)
  // );
  //
  let chartDataCases = [];
  //
  for (let date in data.cases) {
    //
    // data.cases.toLocaleString()
    // console.log(
    //   "In buildChartDataCases: data.cases Y parameter: " +
    //     data.cases[date].toLocaleString()
    // );

    //
    let newDataPoint = {
      x: date,
      y: data.cases[date],
    };
    //
    chartDataCases.push(newDataPoint);
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
  let chartDataRecovered = [];
  //
  for (let date in data.recovered) {
    //
    let newDataPoint = {
      x: date,
      y: data.recovered[date],
    };
    //
    chartDataRecovered.push(newDataPoint);
    //
  }
  //
  return chartDataRecovered;
  ////
};

// buildChartDataDeaths function. Called from getHistoricalData.
const buildChartDataDeaths = (data) => {
  //
  //console.log("In buildChartDataDeaths : data: " + JSON.stringify(data, null, 4));
  //
  let chartDataDeaths = [];
  //
  for (let date in data.deaths) {
    //
    let newDataPoint = {
      x: date,
      y: data.deaths[date],
    };
    //
    chartDataDeaths.push(newDataPoint);
    //
  }
  //
  return chartDataDeaths;
  ////
};

// buildPieChart function.
const buildPieChart = (data) => {
  var ctx = document.getElementById("myPieChart").getContext("2d");

  // For a pie chart
  var myPieChart = new Chart(ctx, {
    //
    type: "pie",
    //
    options: {
      maintainAspectRatio: false,
      // responsive: false,
      // tooltips. the popup window!
      tooltips: {
        mode: "index",
        intersect: false,
        // This took me forever to find AND workout. whew.
        callbacks: {
          label: function (tooltipItem, data) {
            //
            var dataLabel = data.labels[tooltipItem.index];
            //
            var value =
              ": " +
              data.datasets[tooltipItem.datasetIndex].data[
                tooltipItem.index
              ].toLocaleString();

            // make this isn't a multi-line label (e.g. [["label 1 - line 1, "line 2, ], [etc...]])
            if (Chart.helpers.isArray(dataLabel)) {
              // show value on first line of multiline label
              // need to clone because we are changing the value
              dataLabel = dataLabel.slice();
              dataLabel[0] += value;
              //
            } else {
              //
              dataLabel += value;
              //
            }
            //

            // return the text to display on the tooltip
            return dataLabel;
            ////
          }, // end label: function.
        }, // end callbacks function.
      }, // end tootips.
    }, // end options.
    //
    data: {
      datasets: [
        {
          data: [data.active, data.recovered, data.deaths],
          backgroundColor: ["#9d80fe", "#7dd71d", "#fb4443"],
        },
      ],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ["Active", "Recovered", "Deaths"],
    },
    //
  });

  ////
};

// buildChart function. Builds the linear chart.
const buildChart = (chartDataCases, chartDataRecoverd, chartDataDeaths) => {
  //
  // console.log(
  //   "In buildChart function : chartDataCases: " +
  //     JSON.stringify(chartDataCases, null, 4)
  // );
  //
  var timeFormat = "MM/DD/YY";
  var ctx = document.getElementById("myChart").getContext("2d");
  //
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // Configuration options go here
    options: {
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
              // Include a comma sign in the ticks
              callback: function (value, index, values) {
                return numeral(value).format("0,0");
              },
            },
          },
        ],
      },
    },

    // The data for our datasets
    data: {
      datasets: [
        {
          label: "Total Cases",
          backgroundColor: "#1d2c4d",
          borderColor: "#1d2c4d",
          fill: false,
          data: chartDataCases,
        },
        {
          label: "Recovered",
          backgroundColor: "#7dd71d",
          borderColor: "#1d2c4d",
          fill: false,
          data: chartDataRecoverd,
        },
        {
          label: "Deaths",
          backgroundColor: "#fb4443",
          borderColor: "#1d2c4d",
          fill: false,
          data: chartDataDeaths,
        },
      ],
    },
    //

    //
  });
};

///////////////////////////////////////////////////////////////////
