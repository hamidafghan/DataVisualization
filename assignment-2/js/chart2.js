// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 0, left: 260 },
  width = 800 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg2 = d3
  .select("#chart2")
  .append("svg")
  .attr("id", "the_SVG_ID_taskA2_2")
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", `0 0 800 510`)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv("/DataVisualization/Data/top_6_treesMeasures.csv", function (data) {
  data.forEach(function (d) {
    d["Height (m)"] = parseFloat(d["Height (m)"]);
  });
  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  var sumstat = d3
    .nest() // nest function allows to group the calculation per level of a factor
    .key(function (d) {
      return d.Name;
    })
    .rollup(function (d) {
      q1 = d3.quantile(
        d
          .map(function (g) {
            return g["Height (m)"];
          })
          .sort(d3.ascending),
        0.25
      );
      median = d3.quantile(
        d
          .map(function (g) {
            return g["Height (m)"];
          })
          .sort(d3.ascending),
        0.5
      );
      q3 = d3.quantile(
        d
          .map(function (g) {
            return g["Height (m)"];
          })
          .sort(d3.ascending),
        0.75
      );
      interQuantileRange = q3 - q1;
      min = q1 - 0.4 * interQuantileRange;
      max = q3 + 0.4 * interQuantileRange;
      return {
        q1: q1,
        median: median,
        q3: q3,
        interQuantileRange: interQuantileRange,
        min: min,
        max: max,
      };
    })
    .entries(data);

  // Show the Y scale
  var y = d3
    .scaleBand()
    .range([height, 0])
    .domain([
      "Aesculus hippocastanum",
      "Carpinus betulus",
      "Celtis australis",
      "Platanus x hispanica",
      "Tilia cordata",
      "Tilia x europaea",
    ]) //'Tilia x europaea'
    .padding(0.4);
  svg2.append("g").call(d3.axisLeft(y).tickSize(0)).select(".domain").remove();

  // Show the X scale
  var x = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d["Height (m)"];
      }),
    ])
    .range([0, width]);
  svg2
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5))
    .select(".domain")
    .remove();

  // Color scale
  var myColor = d3
    .scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([
      0,
      d3.max(data, function (d) {
        return +d["Height (m)"];
      }),
    ]);

  // Add X axis label:
  svg2
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 30)
    .text("Height (m)");

  // Show the main vertical line
  svg2
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("x1", function (d) {
      return x(d.value.min);
    })
    .attr("x2", function (d) {
      return x(d.value.max);
    })
    .attr("y1", function (d) {
      return y(d.key) + y.bandwidth() / 2;
    })
    .attr("y2", function (d) {
      return y(d.key) + y.bandwidth() / 2;
    })
    .attr("stroke", "black")
    .style("width", 40);

  // rectangle for the main box
  svg2
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      // console.log(x(d.value.q1)) ;
      return x(d.value.q1);
    }) // console.log(x(d.value.q1)) ;
    .attr("width", function (d) {
      return x(d.value.q3) - x(d.value.q1);
    }) //console.log(x(d.value.q3)-x(d.value.q1))
    .attr("y", function (d) {
      return y(d.key);
    })
    .attr("height", y.bandwidth())
    .attr("stroke", "black")
    .style("fill", "#4cae49")
    .style("opacity", 0.6);

  // Show the median
  svg2
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
    .attr("y1", function (d) {
      return y(d.key);
    })
    .attr("y2", function (d) {
      return y(d.key) + y.bandwidth() / 2;
    })
    .attr("x1", function (d) {
      return x(d.value.median);
    })
    .attr("x2", function (d) {
      return x(d.value.median);
    })
    .attr("stroke", "black")
    .style("width", 80);

  // create a tooltip
  var tooltipA2T2 = d3
    .select("#chart2")
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
  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseoverA2T2 = function (d) {
    tooltipA2T2.transition().duration(200).style("opacity", 1);
    tooltipA2T2
      .html("<span style='color:grey'>Height (m): </span>" + d["Height (m)"]) // + d.Prior_disorder + "<br>" + "HR: " +  d.HR)
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY + "px");
  };
  var mousemoveA2T2 = function (d) {
    tooltipA2T2
      .style("left", event.pageX + 30 + "px")
      .style("top", event.pageY + "px");
  };
  var mouseleaveA2T2 = function (d) {
    tooltipA2T2.transition().duration(200).style("opacity", 0);
  };

  // Add individual points with jitter
  var jitterWidth = 50;
  svg2
    .selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d["Height (m)"]);
    })
    .attr("cy", function (d) {
      return (
        y(d.Name) +
        y.bandwidth() / 2 -
        jitterWidth / 2 +
        Math.random() * jitterWidth
      );
    })
    .attr("r", 4)
    .style("fill", function (d) {
      return myColor(+d["Height (m)"]);
    })
    .attr("stroke", "black")
    .on("mouseover", mouseoverA2T2)
    .on("mousemove", mousemoveA2T2)
    .on("mouseleave", mouseleaveA2T2);
});

d3.select("#treeSizeMeasures_for_taskA2_2").on("change", function () {
  let selectedText_task2 = this.value;
  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 50, left: 260 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  d3.select("#the_SVG_ID_taskA2_2").remove();
  // append the svg object to the body of the page
  var svg2_new = d3
    .select("#chart2")
    .append("svg")
    .attr("id", "the_SVG_ID_taskA2_2")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 800 600`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("/DataVisualization/Data/top_6_treesMeasures.csv", function (data) {
    data.forEach(function (d) {
      d[selectedText_task2] = parseFloat(d[selectedText_task2]);
    });
    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = d3
      .nest() // nest function allows to group the calculation per level of a factor
      .key(function (d) {
        return d.Name;
      })
      .rollup(function (d) {
        q1 = d3.quantile(
          d
            .map(function (g) {
              return g[selectedText_task2];
            })
            .sort(d3.ascending),
          0.25
        );
        median = d3.quantile(
          d
            .map(function (g) {
              return g[selectedText_task2];
            })
            .sort(d3.ascending),
          0.5
        );
        q3 = d3.quantile(
          d
            .map(function (g) {
              return g[selectedText_task2];
            })
            .sort(d3.ascending),
          0.75
        );
        interQuantileRange = q3 - q1;
        min = q1 - 0.4 * interQuantileRange;
        max = q3 + 0.4 * interQuantileRange;
        return {
          q1: q1,
          median: median,
          q3: q3,
          interQuantileRange: interQuantileRange,
          min: min,
          max: max,
        };
      })
      .entries(data);

    // Show the Y scale
    var y = d3
      .scaleBand()
      .range([height, 0])
      .domain([
        "Aesculus hippocastanum",
        "Carpinus betulus",
        "Celtis australis",
        "Platanus x hispanica",
        "Tilia cordata",
        "Tilia x europaea",
      ])
      .padding(0.4);
    svg2_new
      .append("g")
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain")
      .remove();

    // Show the X scale
    var x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d[selectedText_task2];
        }),
      ])
      .range([0, width]);
    svg2_new
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(5))
      .select(".domain")
      .remove();

    // Color scale
    var myColor = d3
      .scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain([
        0,
        d3.max(data, function (d) {
          return +d[selectedText_task2];
        }),
      ]);

    // Add X axis label:
    svg2_new
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 30)
      .text(selectedText_task2);

    // Show the main vertical line
    svg2_new
      .selectAll("vertLines")
      .data(sumstat)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return x(d.value.min);
      })
      .attr("x2", function (d) {
        return x(d.value.max);
      })
      .attr("y1", function (d) {
        return y(d.key) + y.bandwidth() / 2;
      })
      .attr("y2", function (d) {
        return y(d.key) + y.bandwidth() / 2;
      })
      .attr("stroke", "black")
      .style("width", 40);

    // rectangle for the main box
    svg2_new
      .selectAll("boxes")
      .data(sumstat)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        // console.log(x(d.value.q1)) ;
        return x(d.value.q1);
      }) // console.log(x(d.value.q1)) ;
      .attr("width", function (d) {
        return x(d.value.q3) - x(d.value.q1);
      }) //console.log(x(d.value.q3)-x(d.value.q1))
      .attr("y", function (d) {
        return y(d.key);
      })
      .attr("height", y.bandwidth())
      .attr("stroke", "black")
      .style("fill", "#4cae49")
      .style("opacity", 0.6);

    // Show the median
    svg2_new
      .selectAll("medianLines")
      .data(sumstat)
      .enter()
      .append("line")
      .attr("y1", function (d) {
        return y(d.key);
      })
      .attr("y2", function (d) {
        return y(d.key) + y.bandwidth() / 2;
      })
      .attr("x1", function (d) {
        return x(d.value.median);
      })
      .attr("x2", function (d) {
        return x(d.value.median);
      })
      .attr("stroke", "black")
      .style("width", 80);

    // create a tooltip
    var tooltipA2T2 = d3
      .select("#chart2")
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
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseoverA2T2 = function (d) {
      tooltipA2T2.transition().duration(200).style("opacity", 1);
      tooltipA2T2
        .html(
          `<span style='color:grey'>${selectedText_task2}: </span>` +
            d[selectedText_task2]
        ) // + d.Prior_disorder + "<br>" + "HR: " +  d.HR)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + "px");
    };
    var mousemoveA2T2 = function (d) {
      tooltipA2T2
        .style("left", event.pageX + 30 + "px")
        .style("top", event.pageY + "px");
    };
    var mouseleaveA2T2 = function (d) {
      tooltipA2T2.transition().duration(200).style("opacity", 0);
    };

    // Add individual points with jitter
    var jitterWidth = 50;
    svg2_new
      .selectAll("indPoints")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d[selectedText_task2]);
      })
      .attr("cy", function (d) {
        return (
          y(d.Name) +
          y.bandwidth() / 2 -
          jitterWidth / 2 +
          Math.random() * jitterWidth
        );
      })
      .attr("r", 4)
      .style("fill", function (d) {
        return myColor(+d[selectedText_task2]);
      })
      .attr("stroke", "black")
      .on("mouseover", mouseoverA2T2)
      .on("mousemove", mousemoveA2T2)
      .on("mouseleave", mouseleaveA2T2);
  });
});
