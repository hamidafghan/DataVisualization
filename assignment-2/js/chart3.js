// set the dimensions and margins of the graph
var margin = { top: 40, right: 30, bottom: 0, left: 140 },
  width = 500 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg3 = d3
  .select("#chart3")
  .append("svg")
  .attr("id", "the_SVG_ID")
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", `0 0 800 500`)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("/DataVisualization/Data/top_6_treesMeasuresScatter.csv", function (data) {
  let selectedText_task3 = "Height (m)";
  data.forEach(function (d) {
    d[selectedText_task3] = parseFloat(d[selectedText_task3]);
    d["Gross Carbon Sequestration (kg/yr)"] = parseFloat(
      d["Gross Carbon Sequestration (kg/yr)"]
    );
  });

  //get names as keys
  var keys = d3
    .map(data, function (d) {
      return d.Name;
    })
    .keys();

  // Add X axis

  var x = d3.scaleLinear().domain([0, 0]).range([0.0, width]);
  svg3
    .append("g")
    .attr("class", "myXaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg3
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 50)
    .text("Height (m)");

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) => d["Gross Carbon Sequestration (kg/yr)"]) + 1.0,
    ])
    .range([height, 0]);
  svg3.append("g").call(d3.axisLeft(y));

  svg3
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 50)
    .attr("y", -20)
    .text("CO2 Subtraction (kg/yr)");

  var domain = keys;
  // Color scale: give me a specie name, I return a color
  let trees = [
    "Aesculus hippocastanum",
    "Carpinus betulus",
    "Celtis australis",
    "Platanus x hispanica",
    "Tilia cordata",
    "Tilia x europaea",
  ];
  let color_list = [
    "#440154ff",
    "#febbd9",
    "#fde725ff",
    "#f00034",
    "#52a163",
    "#0d6efc",
  ];
  // let tree_color_map = {}
  // for (i in trees)
  //     tree_color_map[trees[i]] = color_list[i]
  var color = d3.scaleOrdinal().domain(trees).range(color_list);

  var tooltipA2T3 = d3
    .select("#chart3")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("font-size", "16px");

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseoverA2T3 = function (d) {
    let treeType3 = d.Name;

    tooltipA2T3.transition().duration(200).style("opacity", 1);
    tooltipA2T3.html(
      "<span style='color:grey'>Tree Type: </span> " +
        treeType3 +
        "<br> <span style='color:grey'>Tree Height (m): </span>" +
        d[selectedText_task3] +
        "<br><span style='color:grey'>CO2 Subtraction (kg/yr): </span>" +
        d["Gross Carbon Sequestration (kg/yr)"]
    );
  };
  const mousemoveA2T3 = function (d) {
    tooltipA2T3
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY + 10 + "px");
  };
  const mouseleaveA2T3 = function (d) {
    tooltipA2T3.transition().duration(200).style("opacity", 0);
  };

  // Add dots
  svg3
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", function (d) {
      return "dot " + d.Name;
    })
    .attr("cx", function (d) {
      return x(d[selectedText_task3]);
    })
    .attr("cy", function (d) {
      return y(d["Gross Carbon Sequestration (kg/yr)"]);
    })
    .attr("r", 3)
    .style("fill", function (d) {
      return color(d.Name);
    })
    // .on("mouseover", highlight)
    // .on("mouseleave", doNotHighlight)
    .on("mouseover", mouseoverA2T3)
    .on("mousemove", mousemoveA2T3)
    .on("mouseleave", mouseleaveA2T3);

  // new X axis
  x.domain([0, d3.max(data, (d) => d[selectedText_task3])]);
  svg3
    .select(".myXaxis")
    .transition()
    .duration(1500)
    .attr("opacity", "1")
    .call(d3.axisBottom(x));

  svg3
    .selectAll("circle")
    .transition()
    .delay(function (d, i) {
      return i * 3;
    })
    .duration(1500)
    .attr("cx", function (d) {
      return x(d[selectedText_task3]);
    })
    .attr("cy", function (d) {
      return y(d["Gross Carbon Sequestration (kg/yr)"]);
    });

  // ---------------------------//
  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  var highlight = function (d) {
    // reduce opacity of all groups
    d3.selectAll(".dot").style("opacity", 0.1);
    // expect the one that is hovered
    d3.selectAll(".dot." + d.replaceAll(" ", "."))
      .style("opacity", 1)
      .style("stroke-width", "1px")
      .style("stroke", "black");
  };

  // And when it is not hovered anymore
  var noHighlight = function (d) {
    d3.selectAll(".dot").style("opacity", 1).style("stroke-width", "0px");
  };

  // ---------------------------//
  //       LEGEND              //
  // ---------------------------//

  // Add one dot in the legend for each name.
  var xCircle = 420;
  var size = 20;

  // var allgroups = keys
  var allgroups = [
    "Aesculus hippocastanum",
    "Carpinus betulus",
    "Celtis australis",
    "Platanus x hispanica",
    "Tilia cordata",
    "Tilia x europaea",
  ];

  svg3
    .selectAll("myrect")
    .data(allgroups)
    .enter()
    .append("rect")
    .attr("rx", 100)
    .attr("ry", 100)
    .attr("x", xCircle)
    .attr("y", function (d, i) {
      return +i * (size + 5);
    })
    .attr("width", 12)
    .attr("height", 12)
    .attr("stroke", "black")
    .attr("fill", "white")
    // .append("circle")
    // .attr("x", xCircle)
    // .attr("y", function (d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
    // .attr("r", 7)
    .style("fill", function (d) {
      return color(d);
    })
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight);

  d3.select("rect").transition().duration(1000).attr("rx", 0).attr("ry", 0);

  // Add labels beside legend dots
  svg3
    .selectAll("mylabels")
    .data(allgroups)
    .enter()
    .append("text")
    .attr("x", xCircle + size * 0.8)
    .attr("y", function (d, i) {
      return i * (size + 5) + size / 2;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d) {
      return color(d);
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight);
});

d3.select("#treeSizeMeasures_taskA2_3").on("change", function () {
  let selectedText_task3 = this.value;
  var margin = { top: 40, right: 30, bottom: 30, left: 140 },
    width = 640 - margin.left - margin.right,
    height = 440 - margin.top - margin.bottom;

  console.log("I amf ine here");

  d3.select("#the_SVG_ID").remove();

  var svg3_new = d3
    .select("#chart3")
    .append("svg")
    .attr("id", "the_SVG_ID")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 800 500`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("/DataVisualization/Data/top_6_treesMeasuresScatter.csv", function (data) {
    data.forEach(function (d) {
      d[selectedText_task3] = parseFloat(d[selectedText_task3]);
      d["Gross Carbon Sequestration (kg/yr)"] = parseFloat(
        d["Gross Carbon Sequestration (kg/yr)"]
      );
    });

    //get names as keys
    var keys = d3
      .map(data, function (d) {
        return d.Name;
      })
      .keys();

    console.log(width);
    // Add X axis
    var x_new = d3.scaleLinear().domain([0, 0]).range([0.0, width]);
    svg3_new
      .append("g")
      .attr("class", "myXaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_new));

    svg3_new
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 50)
      .text(selectedText_task3);

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => d["Gross Carbon Sequestration (kg/yr)"]) + 1.0,
      ])
      .range([height, 0]);
    svg3_new.append("g").call(d3.axisLeft(y));

    svg3_new
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", 50)
      .attr("y", -20)
      .text("CO2 Substraction (kg/yr)");

    // Color scale: give me a specie name, I return a color
    var domain = keys;
    // Color scale: give me a specie name, I return a color
    let trees = [
      "Aesculus hippocastanum",
      "Carpinus betulus",
      "Celtis australis",
      "Platanus x hispanica",
      "Tilia cordata",
      "Tilia x europaea",
    ];
    let color_list = [
      "#440154ff",
      "#febbd9",
      "#fde725ff",
      "#f00034",
      "#52a163",
      "#0d6efc",
    ];

    var color = d3.scaleOrdinal().domain(trees).range(color_list);

    var tooltipA2T3 = d3
      .select("#chart3")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-size", "16px");
    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseoverA2T3 = function (d) {
      let treeType3 = d.Name;

      tooltipA2T3.transition().duration(200).style("opacity", 1);
      tooltipA2T3.html(
        `<span style='color:grey'>${selectedText_task3}: </span>` +
          d[selectedText_task3] +
          "<br><span style='color:grey'>CO2 Subtraction (kg/yr): </span>" +
          d["Gross Carbon Sequestration (kg/yr)"]
      );
    };
    const mousemoveA2T3 = function (d) {
      tooltipA2T3
        .style("left", event.pageX + 20 + "px")
        .style("top", event.pageY + 10 + "px");
    };
    const mouseleaveA2T3 = function (d) {
      tooltipA2T3.transition().duration(200).style("opacity", 0);
    };

    // Add dots
    svg3_new
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", function (d) {
        return "dot " + d.Name;
      })
      .attr("cx", function (d) {
        return x_new(d[selectedText_task3]);
      })
      .attr("cy", function (d) {
        return y(d["Gross Carbon Sequestration (kg/yr)"]);
      })
      .attr("r", 3)
      .style("fill", function (d) {
        return color(d.Name);
      })
      .on("mouseover", mouseoverA2T3)
      .on("mousemove", mousemoveA2T3)
      .on("mouseleave", mouseleaveA2T3);

    // new X axis
    x_new.domain([0, d3.max(data, (d) => d[selectedText_task3])]);
    svg3_new
      .select(".myXaxis")
      .transition()
      .duration(1500)
      .attr("opacity", "1")
      .call(d3.axisBottom(x_new));

    svg3_new
      .selectAll("circle")
      .transition()
      .delay(function (d, i) {
        return i * 3;
      })
      .duration(1500)
      .attr("cx", function (d) {
        return x_new(d[selectedText_task3]);
      })
      .attr("cy", function (d) {
        return y(d["Gross Carbon Sequestration (kg/yr)"]);
      });

    var highlight = function (d) {
      // reduce opacity of all groups
      d3.selectAll(".dot").style("opacity", 0.1);
      // expect the one that is hovered
      d3.selectAll(".dot." + d.replaceAll(" ", "."))
        .style("opacity", 1)
        .style("stroke-width", "1px")
        .style("stroke", "black");
    };

    // And when it is not hovered anymore
    var noHighlight = function (d) {
      d3.selectAll(".dot").style("opacity", 1).style("stroke-width", "0px");
    };

    // Add one dot in the legend for each name.
    var xCircle = 460;
    var size = 20;

    // var allgroups = keys
    var allgroups = [
      "Aesculus hippocastanum",
      "Carpinus betulus",
      "Celtis australis",
      "Platanus x hispanica",
      "Tilia cordata",
      "Tilia x europaea",
    ];

    svg3_new
      .selectAll("myrect")
      .data(allgroups)
      .enter()
      .append("rect")
      .attr("rx", 100)
      .attr("ry", 100)
      .attr("x", xCircle)
      .attr("y", function (d, i) {
        return +i * (size + 5);
      })
      .attr("width", 12)
      .attr("height", 12)
      .attr("stroke", "black")
      .attr("fill", "white")
      // .append("circle")
      // .attr("x", xCircle)
      // .attr("y", function (d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
      // .attr("r", 7)
      .style("fill", function (d) {
        return color(d);
      })
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight);

    d3.select("rect").transition().duration(1000).attr("rx", 0).attr("ry", 0);

    // Add labels beside legend dots
    svg3_new
      .selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
      .attr("x", xCircle + size * 0.8)
      .attr("y", function (d, i) {
        return i * (size + 5) + size / 2;
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function (d) {
        return color(d);
      })
      .text(function (d) {
        return d;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight);
  });
});
