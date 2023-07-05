// set the dimensions and margins of the graph
var margin = { top: 20, right: 30, bottom: 10, left: 100 },
  width = 700 - margin.left - margin.right,
  height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgA2T1 = d3
  .select("#A2task1")
  .append("svg")
  .attr("id", "the_SVG_ID_taska2_1")
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", `0 0 700 500`)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data/treesMeasures.csv", function (data) {
  var size = data.length;
  var defaultBins = Math.floor(Math.sqrt(size));
  // X axis: scale and draw:
  var x = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d["Height (m)"];
      }),
    ]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width + 180]);
  svgA2T1
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svgA2T1
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 50)
    .text("Height (m)");

  // Y axis: initialization
  var y = d3.scaleLinear().range([height, 0]);
  var yAxis = svgA2T1.append("g");

  // A function that builds the graph for a specific value of bin
  function update(nBin) {
    // var tooltipA2T1 = d3.select("#A2task1")
    // .append("div")
    // .style("opacity", 0)
    // .attr("class", "tooltip")
    // .style("background-color", "white")
    // .style("border", "solid")
    // .style("border-width", "2px")
    // .style("border-radius", "5px")
    // .style("padding", "10px")

    // var mouseoverA2T1 = function (d) {
    //   // const totalAmount = d.Count;
    //   // const treeType = d.Name;
    //   // const canopyMean = d["Mean Canopy Cover (m2)"];
    //   tooltipA2T1
    //     .transition()
    //     .duration(100)
    //     .style("opacity", 1)
    //     // .html("Tree Type: " + treeType + "<br>" + "Total Amount: " + totalAmount + "<br>" + "Canopy mean: " + canopyMean)
    //     .html("Range: " + 10 + " - " + 20)
    //     // .style("left", (d3.mouse(this)[0] + 20) + "px")
    //     // .style("top", (d3.mouse(this)[1]) + "px")
    //     .style("left", (event.pageX+ 20) + "px")
    //     .style("top", (event.pageY) + "px")
    //   d3.select(this).attr("fill", "#0e6efc");
    // }
    // var mousemoveA2T1 = function (d) {
    //   tooltipA2T1
    //     .style('left', (event.pageX + 40) + 'px')
    //     .style('top', (event.pageY + 5) + 'px')
    // }
    // var mouseleaveA2T1 = function (d) {
    //   tooltipA2T1
    //     .transition()
    //     .duration(100)
    //     .style("opacity", 0);
    //   d3.select(this).attr("fill", "#69b3a2");
    // }

    // set the parameters for the histogram

    var histogram = d3
      .histogram()
      .value(function (d) {
        return d["Height (m)"];
      }) // I need to give the vector of value
      .domain(x.domain()) // then the domain of the graphic
      .thresholds(x.ticks(nBin)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: update now that we know the domain
    y.domain([
      0,
      d3.max(bins, function (d) {
        return d.length;
      }),
    ]); // d3.hist has to be called before the Y axis obviously
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Join the rect with the bins data
    var u = svgA2T1.selectAll("rect").data(bins);

    // Manage the existing bars and eventually the new ones:
    u.enter()
      .append("rect") // Add a new rect for each new elements
      .merge(u) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(1000)
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
      })
      .attr("width", function (d) {
        // return x(d.x1) - x(d.x0);
        return x(d.x1) - x(d.x0) - 1;
      })
      .attr("height", function (d) {
        return height - y(d.length);
      })
      .style("fill", "#4cae49");
    // .on("mouseover", mouseoverA2T1)
    // .on("mousemove", mousemoveA2T1)
    // .on("mouseleave", mouseleaveA2T1);

    // If less bar in the new histogram, I delete the ones not in use anymore
    u.exit().remove();
  }

  // Initialize with default number of bins
  update(defaultBins);

  // Listen to the button -> update if user change it
  d3.select("#nBin").on("input", function () {
    update(+this.value);
  });
});

d3.select("#treeSizeMeasures_for_taskA2_1").on("change", function () {
  let selectedText_task1 = this.value;
  var margin = { top: 20, right: 30, bottom: 10, left: 100 },
    width = 700 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;
  d3.select("#the_SVG_ID_taska2_1").remove();
  // append the svg object to the body of the page
  var svgA2T1_new = d3
    .select("#A2task1")
    .append("svg")
    .attr("id", "the_SVG_ID_taska2_1")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 700 500`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("./data/treesMeasures.csv", function (data) {
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
    svgA2T1_new
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svgA2T1_new
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 50)
      .text(`${selectedText_task1}`);

    // Y axis: initialization
    var y = d3.scaleLinear().range([height, 0]);
    var yAxis = svgA2T1_new.append("g");

    // A function that builds the graph for a specific value of bin
    function update(nBin) {
      // set the parameters for the histogram

      var histogram = d3
        .histogram()
        .value(function (d) {
          return d[selectedText_task1];
        }) // I need to give the vector of value
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(nBin)); // then the numbers of bins

      // And apply this function to data to get the bins
      var bins = histogram(data);

      // Y axis: update now that we know the domain
      y.domain([
        0,
        d3.max(bins, function (d) {
          return d.length;
        }),
      ]); // d3.hist has to be called before the Y axis obviously
      yAxis.transition().duration(1000).call(d3.axisLeft(y));

      // Join the rect with the bins data
      var u = svgA2T1_new.selectAll("rect").data(bins);

      // Manage the existing bars and eventually the new ones:
      u.enter()
        .append("rect") // Add a new rect for each new elements
        .merge(u) // get the already existing elements as well
        .transition() // and apply changes to all of them
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
      // .on("mouseover", mouseoverA2T1)
      // .on("mousemove", mousemoveA2T1)
      // .on("mouseleave", mouseleaveA2T1);

      // If less bar in the new histogram, I delete the ones not in use anymore
      u.exit().remove();
    }

    // Initialize with default number of bins
    update(defaultBins);

    // Listen to the button -> update if user change it
    d3.select("#nBin").on("input", function () {
      update(+this.value);
    });
  });
});
