var margin = { top: 200, right: 30, bottom: 50, left: 500 };
// The svg
var svg1 = d3.select("#chart1"),
  width = +svg1.attr("width") - margin.left - margin.right,
  height = +svg1.attr("height") - margin.top - margin.bottom;

// Map and projection

let projection1 = d3
  .geoMercator()
  .scale(120000)
  .center([11, 46.1])
  .translate([width / 2, height / 2]);

var data = d3.map();

// Load external data and boot
d3.queue()
  .defer(d3.json, "/DataVisualization/Data/circoscrizioni.json")
  .defer(d3.csv, "/DataVisualization/Data/neighborhoodAbundance.csv", function (d) {
    data.set(d.Neighborhood, +d.Count);
  })
  .await(ready);

Legend(
  d3v6.scaleThreshold(
    [50, 100, 300, 500, 1000, 2000, 3000],
    d3v6.schemeGreens[8]
  ),
  "#chart1_legend"
);

// Data and color scale
let colorScale1 = d3
  .scaleThreshold()
  .domain([50, 100, 300, 500, 1000, 2000, 3000])
  .range(d3.schemeGreens[8]);

var tooltipA3T1 = d3
  .select("#chart1Div")
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

function ready(error, topo) {
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

    console.log(d);

    tooltipA3T1.transition().duration(200).style("opacity", 1);
    tooltipA3T1
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
    tooltipA3T1
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

    tooltipA3T1.transition().duration(200).style("opacity", 0);
  };
  // console.log(topo.features)
  // console.log(data)
  // Draw the map
  svg1
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath().projection(projection1))
    // set the color of each country
    .attr("fill", function (d) {
      // console.log(d.properties.nome, d.total, d.id)
      d.total = data.get(d.properties.nome) || 0;
      return colorScale1(d.total);
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
