var margin = { top: 200, right: 30, bottom: 50, left: 500 };
// The svg
var svg2 = d3.select("#chart2"),
  width = +svg2.attr("width") - margin.left - margin.right,
  height = +svg2.attr("height") - margin.top - margin.bottom;

// Map and projection

var projection2 = d3
  .geoMercator()
  .scale(120000)
  .center([11, 46.1])
  .translate([width / 2, height / 2]);

/*
var projection = d3.geoIdentity()
.fitExtent([width,height],geojsonObject)
.reflectY(true);*/

Legend(
  d3v6.scaleThreshold(
    [0.000025, 0.00005, 0.0001, 0.001, 0.01, 0.02, 0.03],
    d3v6.schemeGreens[8]
  ),
  "#chart2_legend"
);

// Data and color scale
var data2 = d3.map();
let colorScale2 = d3
  .scaleThreshold()
  .domain([0.000025, 0.00005, 0.0001, 0.001, 0.01, 0.02, 0.03])
  .range(d3.schemeGreens[7]);

var tooltipA3T2 = d3
  .select("#chart2Div")
  .append("div")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  // .style("min-width", "2px")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("font-size", "16px");

// Load external data and boot
d3.queue()
  .defer(d3.json, "/DataVisualization/Data/circoscrizioni.json")
  .defer(d3.csv, "/DataVisualization/Data/neighborhoodDensity.csv", function (d) {
    data2.set(d.Neighborhood, +d.Density);
  })
  .await(ready2);

function ready2(error, topo) {
  let mouseOver = function (d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", 0.5)
      .style("stroke", "transparent");
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "red");

    tooltipA3T2.transition().duration(200).style("opacity", 1);
    tooltipA3T2
      .html(
        "<span style='color:grey'>Neighborhood: </span>" +
          d.properties.nome +
          "<br>" +
          "<span style='color:grey'>Tree Density: </span>" +
          d.total.toFixed(5)
      )
      .style("top", event.pageY + "px");
  };
  let mouseMove = function (d) {
    tooltipA3T2
      .style("left", event.pageX + 30 + "px")
      .style("top", event.pageY + "px");
  };

  let mouseLeave = function (d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black");
    d3.select(this).transition().duration(200).style("stroke", "black");

    tooltipA3T2.transition().duration(200).style("opacity", 0);
  };
  // console.log(topo.features)
  // console.log(data)
  // Draw the map
  svg2
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath().projection(projection2))
    // set the color of each country
    .attr("fill", function (d) {
      // console.log(d.properties.nome, d.total, d.id)
      d.total = data2.get(d.properties.nome) || 0;
      return colorScale2(d.total);
    })
    .style("stroke", "black")
    .attr("class", function (d) {
      return "Country";
    })
    .style("opacity", 1)
    .on("mouseover", mouseOver)
    .on("mousemove", mouseMove)
    .on("mouseleave", mouseLeave);
}
