var margin = { top: 200, right: 30, bottom: 50, left: 500 };
// The svg
var svg4 = d3.select("#chart4"),
  width = +svg4.attr("width") - margin.left - margin.right,
  height = +svg4.attr("height") - margin.top - margin.bottom;

// Map and projection

let projection4 = d3
  .geoMercator()
  .scale(120000)
  .center([11, 46.1])
  .translate([width / 2, height / 2]);
/*
var projection = d3.geoIdentity()
.fitExtent([width,height],geojsonObject)
.reflectY(true);*/

// Data and color scale
var data4 = d3.map();
let colorScale4 = d3
  .scaleThreshold()
  .domain([100, 300, 500, 1000, 2000, 3200])
  .range(d3.schemeGreens[7]);

var tooltipA3T4 = d3
  .select("#chart4Div")
  .append("div")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  //.style("min-width", "2px")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("font-size", "16px");

// Load external data and boot
d3.queue()
  .defer(d3.json, "./DataVisualization/data/circoscrizioni.json")
  .defer(d3.csv, "./DataVisualization/data/neighborhoodAbundance.csv", function (d) {
    data4.set(d.Neighborhood, +d.Count);
  })
  .await(ready4);

function ready4(error, topo) {
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

    tooltipA3T4.transition().duration(200).style("opacity", 1);

    tooltipA3T4
      .html(
        "<span style='color:grey'>Neighborhood: </span>" +
          d.properties.nome +
          "<br>" +
          "<span style='color:grey'>Tree Abundance: </span>" +
          d.total
      )
      .style("top", event.pageY + "px");
  };
  let mouseMove = function (d) {
    tooltipA3T4
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

    tooltipA3T4.transition().duration(200).style("opacity", 0);
  };
  // Draw the map
  svg4
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath().projection(projection4))
    // set the color of each country
    .attr("fill", function (d) {
      d.total = data4.get(d.properties.nome) || 0;
      return "#dbf8cf";
    })
    .style("stroke", "black")
    .attr("class", function (d) {
      return "Country";
    })
    .style("opacity", 1)
    .on("mouseover", mouseOver)
    .on("mousemove", mouseMove)
    .on("mouseleave", mouseLeave);

  d3.csv("./DataVisualization/data/geo_data_trees.csv", function (data) {
    svg4
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return projection4([d.Longitude, d.Latitude])[0];
      })
      .attr("cy", function (d) {
        return projection4([d.Longitude, d.Latitude])[1];
      })
      .attr("r", 2)
      .style("fill", "#2b8a3e")
      .attr("stroke", "black")
      .attr("stroke-width", 0.3)
      .attr("fill-opacity", 0.8);
  });
}
