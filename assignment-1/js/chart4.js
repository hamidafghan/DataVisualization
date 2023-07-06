//----------- Fourth Chart --------------
const height4 = 500 - margin.top - margin.bottom;

const svg4 = d3.select("#A1chart4")
    .append("svg")
    .attr("viewBox", `0 0 1000 500`)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv("../../DataVisualization/Data/top_trees_neighborhood_stacked.csv").then(function (data) {

    // List of subgroups = header of the csv files = soil condition here
    const subgroups = data.columns.slice(1);

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = Array.from(new Set(data.map(d => d.Neighborhood)));

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);
    svg4.append("g")
        .attr("transform", `translate(0, ${height4})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    const y = d3.scaleBand()
        .domain(groups)
        .range([0, height4])
        .padding(0.2);
    svg4.append("g")
        .call(d3.axisLeft(y));

    // Color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#3c51ae', '#ffd43b', '#4daf4a', '#e41a1c', '#FFBCD9', '#adb5bd']);

    // Normalize the data -> sum of each group must be 100!
    const dataNormalized = [];
    data.forEach(function (d) {
        let tot = 0;
        for (let i = 0; i < subgroups.length; i++) {
            const name = subgroups[i];
            tot += +d[name];
        }
        for (let i = 0; i < subgroups.length; i++) {
            const name = subgroups[i];
            d[name] = d[name] / tot * 100;
        }
        dataNormalized.push(d);
    });

    // Stack the data -> stack per subgroup
    const stackedData = d3.stack()
        .keys(subgroups)
        (dataNormalized);

    const tooltip4 = d3.select("#A1chart4")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    // Mouseover event function
    const mouseover4 = function (event, d) {
        const subgroupName = d3.select(this.parentNode).datum().key;
        const subgroupValue = d.data[subgroupName];
        tooltip4
            .html(`Tree Type: ${subgroupName}<br>Amount: ${subgroupValue.toFixed(2)}%`)
            .style("opacity", 1);
        d3.select(this).attr("fill", "#0e6efc");
    };

    // Mousemove event function
    const mousemove4 = function (event) {
        tooltip4
            .style("left", (event.pageX + 30) + "px")
            .style("top", (event.pageY + 10) + "px");
    };

    // Mouseleave event function
    const mouseleave4 = function () {
        tooltip4.style("opacity", 0);
        d3.select(this).attr("fill", function (d) {
            return color;
        });
    };

    // Show the bars
    svg4.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("fill", function (d) {
            return color(d.key);
        })
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x(d[0]);
        })
        .attr("y", function (d) {
            return y(d.data.Neighborhood);
        })
        .attr("width", function (d) {
            return x(d[1]) - x(d[0]);
        })
        .attr("height", y.bandwidth())
        .on("mouseover", mouseover4)
        .on("mousemove", mousemove4)
        .on("mouseleave", mouseleave4);

    const legend = d3.select("#chart_4_legend")
        .append("svg")
        .attr("width", 300)
        .attr("height", 200)
        .append("g")
        .attr("transform", "translate(50,0)")
        .selectAll("div")
        .data(subgroups)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return `translate(0, ${i * 30})`;
        });

    legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function (d) {
            return color(d);
        });

    legend.append("text")
        .attr("x", 25)
        .attr("y", 15)
        .text(function (d) {
            return d;
        });

}).catch(function (error) {
    // Handle error if any
    console.error("Error:", error);
});
