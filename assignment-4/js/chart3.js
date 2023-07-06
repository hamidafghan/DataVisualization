

// set the dimensions and margins of the graph
var margin = { top: 120, right: 30, bottom: 50, left: 110 },
  width = 700 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgA4T3 = d3.select("#A4chart3")
  .append("svg")
  .attr('id', 'SVG_ID_A4T3')
  .attr("viewBox", `0 0 900 700`)
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

var highlight = function (e,d) {
  // reduce opacity of all groups
  d3.selectAll(".path-ridgline").style("opacity", .01)
  // expect the one that is hovered
  d3.selectAll(`#pathRidg${d}`).style("opacity", 1)
}
var highlightMax = function (e,d) {
  // reduce opacity of all groups
  d3.selectAll(".path-ridgline").style("opacity", .01)
  // expect the one that is hovered

  d3.selectAll(`#pathRidgMax`).style("opacity", 1)
}
var highlightMin = function (e,d) {
  // reduce opacity of all groups
  d3.selectAll(".path-ridgline").style("opacity", .01)
  // expect the one that is hovered

  d3.selectAll(`#pathRidgMin`).style("opacity", 1)
}
// And when it is not hovered anymore
var noHighlight = function (e,d) {
  d3.selectAll(".path-ridgline").style("opacity", 1)
  // d3.selectAll(`.circle-line`).style("opacity", 1)
}

var allgroups = ["Max", "Min"]
let color2 = ['#fd7e14', '#74c0fc']
var size = 20
var moveX = 100
var moveY = 50
var xCircle = 390 + moveX
var xLabel = 440 + moveX
svgA4T3.selectAll("myrect")
  .data(allgroups)
  .enter()
  .append("circle")
  .attr("cx", xCircle)
  .attr("cy", function (d, i) { return 10 + i * (size + 5) - 100 }) // 100 is where the first dot appears. 25 is the distance between dots
  .attr("r", 7)
  .style("fill", function (d, i) { return color2[i] })
  .on("mouseover", highlight)
  .on("mouseleave", noHighlight)

// Add labels beside legend dots
svgA4T3.selectAll("mylabels")
  .data(allgroups)
  .enter()
  .append("text")
  .attr("x", xCircle + size * .8)
  .attr("y", function (d, i) { return i * (size + 5) + (size / 2) - 100 }) // 100 is where the first dot appears. 25 is the distance between dots
  .style("fill", function (d, i) { return color2[i] })
  .text(function (d) { return d })
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle")
  .on("mouseover", highlight)
  .on("mouseleave", noHighlight)

//read data
d3.csv("../../DataVisualization/Data/pivot_data_max_year_2021.csv").then((data) => {
    // Get the different categories and count them
  
    var categories = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var n = categories.length
  
    // Compute the mean of each group
    allMeans = []
    for (i in categories) {
  
      currentGroup = categories[i]
      mean = d3.mean(data, function (d) {
        return +d[currentGroup]
      })
      allMeans.push(mean)
    }
  
    // Create a color scale using these means.
    var myColor = d3.scaleSequential()
      .domain([-15, 40])
      .interpolator(d3.interpolateViridis);
  
    // Add X axis
    var x = d3.scaleLinear()
      .domain([-15, 40])
      .range([0, width]);
    svgA4T3.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickValues([0, 10, 20, 30]).tickSize(-height))
      .select(".domain").remove()
  
    // Add X axis label:
    svgA4T3.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - (width / 2))
      .attr("y", height + 40)
      .text("Max & Min Montly Temperature (°C)");
  
    // Create a Y scale for densities
    var y = d3.scaleLinear()
      .domain([0, 0.5])
      .range([height, 0]);
  
    // Create the Y axis for names
    var yName = d3.scaleBand()
      .domain(categories)
      .range([0, height])
      .paddingInner(1)
    svgA4T3.append("g")
      .call(d3.axisLeft(yName))
    // .select(".domain").remove()
  
    // Compute kernel density estimation for each column:
    var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
    var allDensity = []
    for (i = 0; i < n; i++) {
      key = categories[i]
      density = kde(data.map(function (d) { return d[key]; }))
      allDensity.push({ key: key, density: density })
    }
  
    // Add areas
    svgA4T3.selectAll("areas")
      .data(allDensity)
      .enter()
      .append("path")
      .attr("class", "path-ridgline")
      .attr("id", "pathRidgMax")
      .attr("transform", function (d) { return ("translate(0," + (yName(d.key) - height) + ")") })
      .datum(function (d) { return (d.density) })
      .attr("fill", "#fc7e13")
      .attr("fill-opacity", "0.2")
      .attr("stroke", "#fc7e13")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return y(d[1]); })
      )
      .on("mouseover", highlightMax)
      .on("mouseleave", noHighlight)
}).catch((err) => {
    console.error(err);
});

d3.csv("../../DataVisualization/Data/pivot_data_min_year_2021.csv").then((data) => {
    // Get the different categories and count them

    var categories = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var n = categories.length
  
    // Compute the mean of each group
    allMeans = []
    for (i in categories) {
  
      currentGroup = categories[i]
      mean = d3.mean(data, function (d) {
        return +d[currentGroup]
      })
      allMeans.push(mean)
    }
  
    // Create a color scale using these means.
    var myColor = d3.scaleSequential()
      .domain([-15, 40])
      .interpolator(d3.interpolateViridis);
  
    // Add X axis
    var x = d3.scaleLinear()
      .domain([-15, 40])
      .range([0, width]);
    svgA4T3.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickValues([0, 10, 20, 30]).tickSize(-height))
      .select(".domain").remove()
  
    // Add X axis label:
    svgA4T3.append("text")
      .attr("text-anchor", "end")
      .attr("x", width - (width / 2))
      .attr("y", height + 40)
      .text("Max & Min Montly Temperature (°C)");
  
    // Create a Y scale for densities
    var y = d3.scaleLinear()
      .domain([0, 0.5])
      .range([height, 0]);
  
    // Create the Y axis for names
    var yName = d3.scaleBand()
      .domain(categories)
      .range([0, height])
      .paddingInner(1)
    svgA4T3.append("g")
      .call(d3.axisLeft(yName))
  
    // Compute kernel density estimation for each column:
    var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
    var allDensity = []
    for (i = 0; i < n; i++) {
      key = categories[i]
      density = kde(data.map(function (d) { return d[key]; }))
      allDensity.push({ key: key, density: density })
    }
  
    // Add areas
    svgA4T3.selectAll("areas")
      .data(allDensity)
      .enter()
      .append("path")
      .attr("class", "path-ridgline")
      .attr("id", "pathRidgMin")
      .attr("transform", function (d) { return ("translate(0," + (yName(d.key) - height) + ")") })
      .datum(function (d) { return (d.density) })
      .attr("fill", "#73c0fb")
      .attr("fill-opacity", "0.2")
      .attr("stroke", "#73c0fb")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return y(d[1]); })
      )
      .on("mouseover", highlightMin)
      .on("mouseleave", noHighlight)
}).catch((err) => {
console.error(err);
});


d3.select("#yearsA4T3").on("change", function () {
  let selectedYear = this.value
  var margin = { top: 120, right: 30, bottom: 50, left: 110 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  d3.select("#SVG_ID_A4T3").remove();

  var svgA4T3 = d3.select("#A4chart3")
    .append("svg")
    .attr('id', 'SVG_ID_A4T3')
    .attr("viewBox", `0 0 900 700`)
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var highlight = function (e,d) {
    // reduce opacity of all groups
    d3.selectAll(".path-ridgline").style("opacity", .01)
    // expect the one that is hovered
    d3.selectAll(`#pathRidg${d}`).style("opacity", 1)
  }
  var highlightMax = function (e,d) {
    // reduce opacity of all groups
    d3.selectAll(".path-ridgline").style("opacity", .01)
    // expect the one that is hovered

    d3.selectAll(`#pathRidgMax`).style("opacity", 1)
  }
  var highlightMin = function (e,d) {
    // reduce opacity of all groups
    d3.selectAll(".path-ridgline").style("opacity", .01)
    // expect the one that is hovered

    d3.selectAll(`#pathRidgMin`).style("opacity", 1)
  }
  // And when it is not hovered anymore
  var noHighlight = function (e,d) {
    d3.selectAll(".path-ridgline").style("opacity", 1)
    // d3.selectAll(`.circle-line`).style("opacity", 1)
  }

  var allgroups = ["Max", "Min"]
  let color2 = ['#fd7e14', '#74c0fc']
  var size = 20
  var moveX = 100
  var moveY = 50
  var xCircle = 390 + moveX
  var xLabel = 440 + moveX
  svgA4T3.selectAll("myrect")
    .data(allgroups)
    .enter()
    .append("circle")
    .attr("cx", xCircle)
    .attr("cy", function (d, i) { return 10 + i * (size + 5) - 100 }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d, i) { return color2[i] })
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

  // Add labels beside legend dots
  svgA4T3.selectAll("mylabels")
    .data(allgroups)
    .enter()
    .append("text")
    .attr("x", xCircle + size * .8)
    .attr("y", function (d, i) { return i * (size + 5) + (size / 2) - 100 }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d, i) { return color2[i] })
    .text(function (d) { return d })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

    d3.csv(`../../DataVisualization/Data/pivot_data_max_year_${selectedYear}.csv`).then((data) => {
        // Get the different categories and count them
        var categories = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var n = categories.length
    
        // Compute the mean of each group
        allMeans = []
        for (i in categories) {
          currentGroup = categories[i]
          mean = d3.mean(data, function (d) { return +d[currentGroup] })
          allMeans.push(mean)
        }
    
        // Create a color scale using these means.
        var myColor = d3.scaleSequential()
          .domain([-15, 40])
          .interpolator(d3.interpolateViridis);
    
        // Add X axis
        var x = d3.scaleLinear()
          .domain([-15, 40])
          .range([0, width]);
        svgA4T3.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).tickValues([0, 10, 20, 30]).tickSize(-height))
          .select(".domain").remove()
    
        // Add X axis label:
        svgA4T3.append("text")
          .attr("text-anchor", "end")
          .attr("x", width - (width / 2))
          .attr("y", height + 40)
          .text("Max & Min Montly Temperature (°C)");
    
        // Create a Y scale for densities
        var y = d3.scaleLinear()
          .domain([0, 0.5])
          .range([height, 0]);
    
        // Create the Y axis for names
        var yName = d3.scaleBand()
          .domain(categories)
          .range([0, height])
          .paddingInner(1)
        svgA4T3.append("g")
          .call(d3.axisLeft(yName))
        // Compute kernel density estimation for each column:
        var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
        var allDensity = []
        for (i = 0; i < n; i++) {
          key = categories[i]
          density = kde(data.map(function (d) { return d[key]; }))
          allDensity.push({ key: key, density: density })
        }
    
        // Add areas
        svgA4T3.selectAll("areas")
          .data(allDensity)
          .enter()
          .append("path")
          .attr("class", "path-ridgline")
          .attr("id", "pathRidgMax")
          .attr("transform", function (d) { return ("translate(0," + (yName(d.key) - height) + ")") })
          .datum(function (d) { return (d.density) })
          .attr("fill", "#fc7e13")
          .attr("fill-opacity", "0.2")
          .attr("stroke", "#fc7e13")
          .attr("stroke-width", 2)
          .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(function (d) { return x(d[0]); })
            .y(function (d) { return y(d[1]); })
          ).on("mouseover", highlightMax)
          .on("mouseleave", noHighlight)
    
    }).catch((err) => {
        console.error(err);
    });

    d3.csv(`../../DataVisualization/Data/pivot_data_min_year_${selectedYear}.csv`).then((data) => {
        // Get the different categories and count them

        var categories = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var n = categories.length
    
        // Compute the mean of each group
        allMeans = []
        for (i in categories) {
    
          currentGroup = categories[i]
          mean = d3.mean(data, function (d) {
            return +d[currentGroup]
          })
          allMeans.push(mean)
        }
    
        // Create a color scale using these means.
        var myColor = d3.scaleSequential()
          .domain([-15, 40])
          .interpolator(d3.interpolateViridis);
    
        // Add X axis
        var x = d3.scaleLinear()
          .domain([-15, 40])
          .range([0, width]);
        svgA4T3.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).tickValues([0, 10, 20, 30]).tickSize(-height))
          .select(".domain").remove()
    
        // Add X axis label:
        svgA4T3.append("text")
          .attr("text-anchor", "end")
          .attr("x", width - (width / 2))
          .attr("y", height + 40)
          .text("Max & Min Montly Temperature (°C)");
    
        // Create a Y scale for densities
        var y = d3.scaleLinear()
          .domain([0, 0.5])
          .range([height, 0]);
    
        // Create the Y axis for names
        var yName = d3.scaleBand()
          .domain(categories)
          .range([0, height])
          .paddingInner(1)
        svgA4T3.append("g")
          .call(d3.axisLeft(yName))
    
        // Compute kernel density estimation for each column:
        var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
        var allDensity = []
        for (i = 0; i < n; i++) {
          key = categories[i]
          density = kde(data.map(function (d) { return d[key]; }))
          allDensity.push({ key: key, density: density })
        }
    
        // Add areas
        svgA4T3.selectAll("areas")
          .data(allDensity)
          .enter()
          .append("path")
          .attr("class", "path-ridgline")
          .attr("id", "pathRidgMin")
          .attr("transform", function (d) { return ("translate(0," + (yName(d.key) - height) + ")") })
          .datum(function (d) { return (d.density) })
          .attr("fill", "#73c0fb")
          .attr("fill-opacity", "0.2")
          .attr("stroke", "#73c0fb")
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(function (d) { return x(d[0]); })
            .y(function (d) { return y(d[1]); })
          ).on("mouseover", highlightMin)
          .on("mouseleave", noHighlight)
}).catch((err) => {
    console.error(err);
});

});

// This is what I need to compute kernel density estimation
function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map(function (x) {
      return [x, d3.mean(V, function (v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}
