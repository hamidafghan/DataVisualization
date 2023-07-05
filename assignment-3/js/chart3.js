var margin = { top: 200, right: 30, bottom: 50, left: 500 };
// The svg
var svg3 = d3.select("#A3task3"),
  width = +svg3.attr("width") - margin.left - margin.right,
  height = +svg3.attr("height") - margin.top - margin.bottom;

// Map and projection

var projection3 = d3
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
    [200, 500, 800, 1500, 3500, 6000, 8000],
    d3v6.schemeBlues[8]
  ),
  "#A3task3_legend"
);

// Data and color scale
var data3 = d3.map();
var colorScale3 = d3
  .scaleThreshold()
  .domain([100, 200, 500, 800, 1500, 3500, 6000, 8000])
  .range(d3.schemeBlues[8]);

var tooltipA3T3 = d3
  .select("#A3task3Div")
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
  .defer(d3.json, "./data/circoscrizioni.json")
  .defer(d3.csv, "./data/neighborhoodOxygenProd.csv", function (d) {
    data3.set(d.Neighborhood, +d["Oxygen Production (kg/yr)"]);
  })
  .await(ready3);

function ready3(error, topo) {
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

    tooltipA3T3.transition().duration(200).style("opacity", 1);
    tooltipA3T3
      .html(
        "<span style='color:grey'>Neighborhood: </span>" +
          d.properties.nome +
          "<br>" +
          "<span style='color:grey'>Oxygen Production (kg/yr): </span>" +
          d.total
      )
      .style("top", event.pageY + "px");
  };
  let mouseMove = function (d) {
    tooltipA3T3
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

    tooltipA3T3.transition().duration(200).style("opacity", 0);
  };
  // console.log(topo.features)
  // console.log(data)
  // Draw the map
  svg3
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath().projection(projection3))
    // set the color of each country
    .attr("fill", function (d) {
      // console.log(d.properties.nome, d.total, d.id)
      d.total = data3.get(d.properties.nome) || 0;
      return colorScale3(d.total);
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
