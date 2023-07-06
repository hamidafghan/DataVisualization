// Chart dimensions
const margin = { top: 10, right: 100, bottom: 50, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create SVG element
const svg = d3.select("#A1chart1")
  .append("svg")
  .attr("viewBox", `0 0 1000 500`)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Define data URL
const dataUrl = "../../DataVisualization/Data/top_20_trees.csv";

// Load data
d3.csv(dataUrl).then(function(data) {
  // Draw chart
  drawChart(data);
}).catch(function(error) {
  console.error("Error loading data:", error);
});

// Function to draw the chart
function drawChart(data) {
  // Create X scale
  const x = d3.scaleLinear()
    .domain([0, 1300])
    .range([0, width]);

  // Create Y scale
  const y = d3.scaleBand()
    .range([0, height])
    .domain(data.map(d => d.Name))
    .padding(0.1);

  // Append X axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Append Y axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // Create tooltip
  const tooltip = d3.select("#A1chart1")
    .append("div")
    .attr("class", "tooltip");

  // Mouse event functions
  function mouseover(event, d) {
    const totalAmount = d.count;
    const treeType = d.Name;
    const canopyMean = d.mean;
    tooltip
      .html(`Tree Type: ${treeType}<br>Total Amount: ${totalAmount}<br>Canopy mean: ${canopyMean}`)
      .style("opacity", 1);
    d3.select(this).attr("fill", "#0e6efc");
  }

  function mousemove() {
    tooltip
      .style("left", `${event.pageX + 40}px`)
      .style("top", `${event.pageY + 5}px`);
  }

  function mouseleave() {
    tooltip.style("opacity", 0);
    d3.select(this).attr("fill", d => scolor(d.count));
  }

  // Color scales
  const scolor = d3.scaleSequential()
    .domain([0, d3.max(data, d => d.count)])
    .interpolator(d3.interpolateGreens);

  const scolor2 = d3.scaleSequential()
    .domain([300, 270])
    .interpolator(d3.interpolateGreys);

  // Create bars
  const bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", x(0))
    .attr("y", d => y(d.Name))
    .attr("width", 0)
    .attr("height", y.bandwidth())
    .attr("fill", d => scolor(d.count))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  // Add count labels
  svg.selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .text(d => d.count)
    .attr("x", d => x(d.count) - 30)
    .attr("y", d => y(d.Name) + 14)
    .attr("text-anchor", "right")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", d => scolor2(d.count));

  // Animation
  bars.transition()
    .duration(800)
    .attr("x", d => x(0))
    .attr("width", d => width - (width - x(d.count)))
    .delay((d, i) => i * 100);
}
