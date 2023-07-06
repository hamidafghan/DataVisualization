// Set the dimensions and margins of the graph
var margin = { top: 20, right: 30, bottom: 10, left: 100 },
  width = 700 - margin.left - margin.right,
  height = 420 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svgChart1 = d3
  .select("#chart1")
  .append("svg")
  .attr("id", "svg_id_chart_1")
  .attr("viewBox", "0 0 700 500")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./DataVisualization/data/treesMeasures.csv", function (data) {
  var size = data.length;
  var defaultBins = Math.floor(Math.sqrt(size));
  var x = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d["Height (m)"];
      }),
    ])
    .range([0, width + 180]);

  svgChart1
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svgChart1
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 50)
    .text("Height (m)");

  var y = d3.scaleLinear().range([height, 0]);
  var yAxis = svgChart1.append("g");

  function update(nBin) {
    var histogram = d3
      .histogram()
      .value(function (d) {
        return d["Height (m)"];
      })
      .domain(x.domain())
      .thresholds(x.ticks(nBin));

    var bins = histogram(data);

    y.domain([
      0,
      d3.max(bins, function (d) {
        return d.length;
      }),
    ]);

    yAxis.transition().duration(1000).call(d3.axisLeft(y));
    var u = svgChart1.selectAll("rect").data(bins);

    u.enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function (d) {
        return x(d.x1) - x(d.x0) - 1;
      })
      .attr("height", function (d) {
        return height - y(d.length);
      })
      .style("fill", "#4cae49");
    u.exit().remove();
  }

  update(defaultBins);

  d3.select("#nBin").on("input", function () {
    update(+this.value);
  });
});

d3.select("#treeSizeMeasures_for_taskA2_1").on("change", function () {
  let selectedText_task1 = this.value;
  var margin = { top: 20, right: 30, bottom: 10, left: 100 },
    width = 700 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;
  d3.select("#svg_id_chart_1").remove();
  // append the svg object to the body of the page
  var svgChart1_new = d3
    .select("#chart1")
    .append("svg")
    .attr("id", "svg_id_chart_1")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 700 500`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("./DataVisualization/data/treesMeasures.csv", function (data) {
    var size = data.length;
    var defaultBins = Math.floor(Math.sqrt(size));
    // X axis: scale and draw:
    var x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d[selectedText_task1];
        }),
      ]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
    svgChart1_new
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svgChart1_new
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 50)
      .text(`${selectedText_task1}`);

    var y = d3.scaleLinear().range([height, 0]);
    var yAxis = svgChart1_new.append("g");

    function update(nBin) {
      var histogram = d3
        .histogram()
        .value(function (d) {
          return d[selectedText_task1];
        })
        .domain(x.domain())
        .thresholds(x.ticks(nBin));

      var bins = histogram(data);

      y.domain([
        0,
        d3.max(bins, function (d) {
          return d.length;
        }),
      ]);

      yAxis.transition().duration(1000).call(d3.axisLeft(y));

      var u = svgChart1_new.selectAll("rect").data(bins);

      u.enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(1000)
        .attr("x", 1)
        .attr("transform", function (d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function (d) {
          return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function (d) {
          return height - y(d.length);
        })
        .style("fill", "#4cae49");

      u.exit().remove();
    }

    update(defaultBins);

    d3.select("#nBin").on("input", function () {
      update(+this.value);
    });
  });
});
