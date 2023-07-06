// ----------- Second Chart --------------
height2 = 500 - margin.top - margin.bottom;
var svg2 = d3.select("#A1chart2")
  .append("svg")
  .attr("viewBox", `0 0 1000 500`)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("../../DataVisualization/Data/top_trees_neighborhood.csv").then(function (data) {
  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1);
  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = Array.from(new Set(data.map(function (d) { return d.Neighborhood; })));
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 3000])
    .range([0, width]);

  svg2.append("g")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleBand()
    .domain(groups)
    .range([0, height2])
    .padding([0.2]);
  svg2.append("g")
    .call(d3.axisLeft(y));
  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#3c51ae', '#ffd43b', '#4daf4a', '#e41a1c', '#FFBCD9', '#adb5bd']);

  // stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data);

  // ----------------
  // Create a tooltip
  // ----------------
  var tooltip2 = d3.select("#A1chart2")
    .append("div")
    .attr("class", "tooltip")


  // Three functions that change the tooltip when the user hovers / moves / leaves a cell
  var mouseover2 = function (event, d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    tooltip2
      .html("Tree Type: " + subgroupName + "<br>" + "Amount: " + subgroupValue)
      .style("opacity", 1);
    d3.select(this).attr("fill", "#0e6efc");
  };

  var mousemove2 = function (event) {
    tooltip2
      .style('left', (event.pageX + 30) + 'px')
      .style('top', (event.pageY + 10) + 'px');
  };

  // Show the bars
  svg2.append("g")
    .selectAll("g")
    // Enter the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
    .attr("fill", function (d) {
      return color(d.key);
    })
    .selectAll("rect")
    // Enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function (d) {
      return d;
    })
    .join("rect")
    .attr("x", function (d) {
      return x(d[0]);
    })
    .attr("y", function (d) {
      return y(d.data.Neighborhood);
    })
    .attr("height", y.bandwidth())
    .attr("width", function (d) {
      return x(d[1]) - x(d[0]);
    })
    .on("mouseover", mouseover2)
    .on("mousemove", mousemove2)
    .on("mouseleave", function () {
      tooltip2.style("opacity", 0);
      d3.select(this).attr("fill", function (d) {
        return color;
      });
    });

    color_map = {
      'Celtis australis': 0,
      'Aesculus hippocastanum': 1,
      'Carpinus betulus': 2,
      'Tilia cordata': 3,
      'Platanus x hispanica': 4,
      'Other': 5
  }
  
  var legend = d3.select("#chart_2_legend")
    .append("svg")
    .attr('width', 300)
    .attr('height', 200)
    .append('g')
    .attr("transform", `translate(50,0)`)
    .selectAll("div")
    .data(subgroups)
    .join("g")
    .attr('transform', function (d, i) { return "translate(0," + i * 30 + ")"; });


  legend.append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", function (d, i) { return color(color_map[d]); });

  legend.append("text")
    .attr("x", 25)
    .attr("y", 15)
    .text(function (d, i) { return d; });
}).catch((err) => {
  console.error(err)
});
