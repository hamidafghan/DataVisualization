// set the dimensions and margins of the graph
var margin = { top: 10, right: 100, bottom: 10, left: 10 },
  width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#A5task1")
  .append("svg")
  .attr("viewBox", `-200 -15 1300 700`)
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Color scale used
var color = d3.scaleOrdinal(d3.schemeCategory20);

// Set the sankey diagram properties
var sankey = d3.sankey().nodeWidth(15).nodePadding(30).size([width, height]);

// load the data
d3.json("./data/top_10_trees_FluxChart.json", function (error, graph) {
  console.log(graph.nodes, graph.links);
  // Constructs a new Sankey generator with the default settings.
  sankey.nodes(graph.nodes).links(graph.links).layout(1);

  // var tooltipA5T1 = d3.select("#A4task1")
  //   .append("div")
  //   .style("opacity", 0)
  //   .attr("class", "tooltip")
  //   .style("background-color", "white")
  //   .style("border", "solid")
  //   .style("border-width", "2px")
  //   .style("border-radius", "5px")
  //   .style("padding", "10px")
  //   .style("font-size", "16px");

  // let mouseoverA5T1 = function (d) {
  //   tooltipA5T1
  //     .transition()
  //     .duration(200)
  //     .style("opacity", 1)
  //     tooltipA5T1
  //     .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Mean Temp (°C): </span>" + d.mean)
  // }
  // let mousemoveA5T1 = function (d) {
  //   tooltipA5T1
  //     .style('left', (event.pageX + 20) + 'px')
  //     .style('top', (event.pageY + 10) + 'px')

  // }
  // let mouseleaveA5T1 = function (d) {
  //   tooltipA5T1
  //     .transition()
  //     .duration(200)
  //     .style("opacity", 0);
  // }

  // add in the links

  var link = svg
    .append("g")
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", sankey.link())
    .style("stroke-width", function (d) {
      return Math.max(1, d.dy);
    })
    .sort(function (a, b) {
      return b.dy - a.dy;
    });

  link.append("title").text(function (d) {
    return "Value: " + d.value;
  });
  // .on("mouseover", mouseoverA5T1)
  // .on("mousemove", mousemoveA5T1)
  // .on("mouseleave", mouseleaveA5T1);

  // add in the nodes
  var node = svg
    .append("g")
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .call(
      d3
        .drag()
        .subject(function (d) {
          return d;
        })
        .on("start", function () {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove)
    );

  // add the rectangles for the nodes
  console.log(graph.nodes);
  node
    .append("rect")
    .attr("height", function (d) {
      return d.dy;
    })
    .attr("width", sankey.nodeWidth())
    .style("fill", function (d) {
      return (d.color = color(d.name.replace(/ .*/, "")));
    })
    .style("stroke", function (d) {
      return d3.rgb(d.color).darker(2);
    })
    // Add hover text
    .append("title")
    .text(function (d, i) {
      let value2 = 0;
      if (d.name != "Carbon Storage (eur)" && d.name != "Carbon Storage (kg)") {
        value2 = d.sourceLinks[0].value;
        return (
          d.name +
          "\n" +
          "Carbon Storage (kg): " +
          d.value +
          "\n" +
          "Carbon Storage (eur): " +
          value2
        );
      } else {
        return d.name;
      }
    });

  // add in the title for the nodes
  node
    .append("text")
    .attr("x", -6)
    .attr("y", function (d) {
      return d.dy / 2;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("transform", null)
    .text(function (d) {
      return d.name;
    })
    .filter(function (d) {
      return d.x < width / 2;
    })
    .attr("x", 6 + sankey.nodeWidth())
    .attr("text-anchor", "start");

  // the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr(
      "transform",
      "translate(" +
        d.x +
        "," +
        (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) +
        ")"
    );
    sankey.relayout();
    link.attr("d", sankey.link());
  }
});
