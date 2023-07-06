//----------- Third Chart --------------

const margin3 = { top: 30, right: 0, bottom: 150, left: 110 };
const width3 = 400 - margin3.left - margin3.right;
const height3 = 400 - margin3.top - margin3.bottom;

// Read the data
d3.csv("/DataVisualization/Data/top_trees_neighborhood_unpivot.csv").then((data) => {
  // Group the data: I want to draw one line per group
  const sumstat = d3.group(data, (d) => d.Name);
  const allKeys = Array.from(sumstat.keys());

  // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
  const svg3 = d3
    .select("#A1chart3")
    .selectAll("mybar")
    .data(Array.from(sumstat))
    .enter()
    .append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
    .append("g")
    .attr("transform", `translate(${margin3.left}, ${margin3.top})`);

  // Add X axis
  const x = d3
    .scaleLinear()
    .range([0, width3])
    .domain([0, d3.max(data, (d) => +d.Count)]);

  svg3
    .append("g")
    .attr("transform", `translate(0, ${height3})`)
    .call(d3.axisBottom(x).ticks(3))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.Neighborhood))
    .range([0, height3])
    .padding(0.2);

  svg3
    .append("g")
    .call(d3.axisLeft(y).ticks(5))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Color palette
  const colorTitles = d3
    .scaleOrdinal()
    .domain(allKeys)
    .range(["#ffd43b", "#4daf4a", "#3c51ae", "#adb5bd", "#FFBCD9", "#e41a1c"]);

  // Tooltip for all the bars
  const tooltip3 = d3
    .select("#A1chart3")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  // Event handlers for mouseover, mousemove, and mouseleave
  const mouseover3 = function (event, d) {
    const totalAmount3 = d.Count;
    const treeType3 = d.Name;
    tooltip3
      .html("Tree Type: " + treeType3 + "<br>" + "Total Amount: " + totalAmount3)
      .style("opacity", 1);
  };

  const mousemove3 = function (event) {
    tooltip3
      .style("left", `${event.pageX + 20}px`)
      .style("top", `${event.pageY + 10}px`);
  };

  const mouseleave3 = function () {
    tooltip3.style("opacity", 0);
  };

  // Create the bars
  svg3
    .selectAll("mybar")
    .data((d) => d[1])
    .enter()
    .append("rect")
    .style("fill", (d, i) => colorTitles(d.Name))
    .attr("x", (d, i) => x(0))
    .attr("y", (d, i) => y(d.Neighborhood))
    .attr("height", y.bandwidth())
    .attr("width", (d, i) => width3 - (width3 - x(d.Count)))
    .on("mouseover", mouseover3)
    .on("mousemove", mousemove3)
    .on("mouseleave", mouseleave3);

  // Add titles
  svg3
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", -5)
    .attr("x", 0)
    .text((d) => d[0])
    .style("fill", (d) => colorTitles(d[0]));
})
.catch((err) => {
  console.error(err);
});
