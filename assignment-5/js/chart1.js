
// set the dimensions and margins of the graph
var margin = { top: 10, right: 100, bottom: 10, left: 10 },
  width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#A5chart1").append("svg")
.attr("viewBox", `-200 -15 1300 700`)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Color scale used
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Set the sankey diagram properties
var sankey = d3.sankey()
  .nodeWidth(15)
  .nodePadding(30)
  .size([width, height]);

// load the data
d3.json("./../../data/top_10_trees_FluxChart.json", function (error, graph) {

  console.log(graph.nodes, graph.links)
  // Constructs a new Sankey generator with the default settings.
  sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .layout(1);

  // add in the links
  
  var link = svg.append("g")
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", sankey.link())
    .style("stroke-width", function (d) { return Math.max(1, d.dy); })
    .sort(function (a, b) { return b.dy - a.dy; })

    link.append('title')
    .text(function (d) { return "Value: " + d.value })

  // add in the nodes
  var node = svg.append("g")
    .selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.drag()
      .subject(function (d) { return d; })
      .on("start", function () { this.parentNode.appendChild(this); })
      .on("drag", dragmove));

  // add the rectangles for the nodes
  console.log(graph.nodes)
  node
    .append("rect")
    .attr("height", function (d) { return d.dy; })
    .attr("width", sankey.nodeWidth())
    .style("fill", function (d) { return d.color = color(d.name.replace(/ .*/, "")); })
    .style("stroke", function (d) { return d3.rgb(d.color).darker(2); })
    // Add hover text
    .append("title")
    .text(function (d, i) { let value2=0;
      if(d.name != 'Carbon Storage (eur)' && d.name != 'Carbon Storage (kg)') {
        value2 = d.sourceLinks[0].value
        return d.name + "\n" + "Carbon Storage (kg): " + d.value + "\n" + "Carbon Storage (eur): " + value2
      }else{
        return d.name 
      }
      });

  // add in the title for the nodes
  node
    .append("text")
    .attr("x", -6)
    .attr("y", function (d) { return d.dy / 2; })
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("transform", null)
    .text(function (d) { return d.name; })
    .filter(function (d) { return d.x < width / 2; })
    .attr("x", 6 + sankey.nodeWidth())
    .attr("text-anchor", "start");

  // the function for moving the nodes
  function dragmove(d) {
    d3.select(this)
      .attr("transform",
        "translate("
        + d.x + ","
        + (d.y = Math.max(
          0, Math.min(height - d.dy, d3.event.y))
        ) + ")");
    sankey.relayout();
    link.attr("d", sankey.link());
  }

});


