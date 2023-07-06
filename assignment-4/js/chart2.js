//RadarChart

function angleToCoordinate(angle, value) {
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return { "x": 300 + x, "y": 300 - y };
}

let years = ["1993", "1997", "2001", "2005", "2009", "2013", "2017", "2021"];
const features = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
let colors = ["darkorange", "gray", "navy", "blue", "red", "green", "black", "yellow"];


let svgA4T2 = d3.select("#A4chart2").append("svg")
    .attr("viewBox", `0 0 950 950`)
    // .style("margin-bottom", -450 + "px")
// .attr("width", 600)
// .attr("height", 600);

let radialScale = d3.scaleLinear()
    .domain([-10, 30])
    .range([0, 250]);
let ticks = [-10, 0, 10, 20, 30];
ticks.forEach(t =>
    svgA4T2.append("circle")
        .attr("cx", 300)
        .attr("cy", 300)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("r", radialScale(t))
);
ticks.forEach(t =>
    svgA4T2.append("text")
        .attr("x", 305)
        .attr("y", 300 - radialScale(t))
        .text(t.toString())
);


for (var i = 0; i < features.length; i++) {
    let ft_name = features[i];
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    let line_coordinate = angleToCoordinate(angle, 30);
    let label_coordinate = angleToCoordinate(angle, 32);

    //draw axis line
    svgA4T2.append("line")
        .attr("x1", 300)
        .attr("y1", 300)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke", "black");

    //draw axis label
    svgA4T2.append("text")
        .attr("x", label_coordinate.x)
        .attr("y", label_coordinate.y)
        .text(ft_name);
}
let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);


function getPathCoordinates(data_point) {
    let coordinates = [];
    for (var i = 0; i < features.length + 1; i++) {
        let ft_name = features[i % features.length];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        coordinates.push(angleToCoordinate(angle, parseFloat(data_point[ft_name])));
    }
    return coordinates;
}

// ---------------------------//
//       HIGHLIGHT GROUP      //
// ---------------------------//

// What to do when one group is hovered
var highlight = function (e,d) {
    // reduce opacity of all groups
    d3.selectAll("path").style("opacity", .01)
    d3.selectAll(".circle-mean").style("opacity", .01)

    // expect the one that is hovered
    console.log(d)
    d3.select(`#Year${d}`).style("opacity", 1)
    d3.selectAll(`#mean${d}`).style("opacity", 1)
}

// And when it is not hovered anymore
var noHighlight = function (e,d) {
    d3.selectAll("path").style("opacity", 1)
    d3.selectAll(".circle-mean").style("opacity", 1)
}

// ---------------------------//
//     INTERACTIVE LEGEND     //
// ---------------------------//


// Add one dot in the legend for each name.
var size = 20
var moveX = 300
var moveY = 50
var xCircle = 390 + moveX
var xLabel = 440 + moveX

// var allgroups = keys
var allgroups = ["1993", "1997", "2001", "2005", "2009", "2013", "2017", "2021"]

svgA4T2.selectAll("myrect")
    .data(allgroups)
    .enter()
    .append("circle")
    .attr("cx", xCircle)
    .attr("cy", function (d, i) { return 10 + i * (size + 5) + 200 }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d, i) { return colors[i] })
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

// Add labels beside legend dots
svgA4T2.selectAll("mylabels")
    .data(allgroups)
    .enter()
    .append("text")
    .attr("x", xCircle + size * .8)
    .attr("y", function (d, i) { return i * (size + 5) + (size / 2) + 202 }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d, i) { return colors[i] })
    .text(function (d) { return d })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)




d3.csv("../../DataVisualization/data/daily_temp_data.csv",

    function (d) {
        return {
            year: d.year,
            month: d.month,
            mean: d.mean,

        }
    }).then((data) => {
          //Tooltip
          var tooltipA4T1 = d3.select("#A4chart2")
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "10px")
          .style("font-size", "16px");

      let mouseoverA4T2_mean = function (e,d) {
          console.log(d)
          tooltipA4T1
              .transition()
              .duration(200)
              .style("opacity", 1)
          tooltipA4T1
              .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Mean Temp (°C): </span>" + d.mean)
          d3.selectAll("path").style("opacity", .01)
          d3.selectAll(".circle-mean").style("opacity", .01)

          // expect the one that is hovered
          console.log(d)
          d3.select(`#Year${d.year}`).style("opacity", 1)
          d3.selectAll(`#mean${d.year}`).style("opacity", 1)
      }
      let mousemoveA4T2 = function (e,d) {
          tooltipA4T1
              .style('left', (event.pageX + 20) + 'px')
              .style('top', (event.pageY + 10) + 'px')

      }
      let mouseleaveA4T2 = function (e,d) {
          tooltipA4T1
              .transition()
              .duration(200)
              .style("opacity", 0);
          d3.selectAll("path").style("opacity", 1)
          d3.selectAll(".circle-mean").style("opacity", 1)
      }
      count = 0
      for (i = 0; i < years.length; i++) {

          let temp_year = data.filter(function (row) {
              return row.year == years[i];
          });

          let dict = {}
          temp_year.forEach(function (d) {
              dict[d.month] = d.mean;
          });
          // console.log(dict);
          let color = colors[i];
          let coordinates = getPathCoordinates(dict);
          //draw the path element
          svgA4T2.append("path")
              .datum(coordinates)
              .attr("d", line)
              .attr("id", "Year" + years[i])
              .attr("stroke-width", 3)
              .attr("stroke", color)
              .attr("fill", "none")
              .attr("stroke-opacity", 1)
              .attr("opacity", 1);

          for ([key, value] of Object.entries(dict)) {

              svgA4T2
                  .append("circle")
                  // it doubles line [*]

                  .attr("id", function () { return "mean" + years[i] })
                  .attr("class", "circle-mean")             // full notation for the node    // [*] selection.classed() method for classes,
                  // but you can omit this line because you wrote .selectAll(".datapoints") above
                  .attr("fill", color)  // you must make big dots 
                  // to be clickable for people
                  .attr("stroke", "white")
                  // .attr("stroke-width", "1")
                  .attr("cx", function () {

                      let angle = (Math.PI / 2) + (2 * Math.PI * count / features.length);
                      return angleToCoordinate(angle, value).x

                  })
                  .attr("cy", function () {

                      let angle = (Math.PI / 2) + (2 * Math.PI * count / features.length);
                      return angleToCoordinate(angle, value).y

                  })
                  .attr("r", 3)

              count++
          }

      }

      d3.selectAll(".circle-mean").data(data)
          .on("mouseover", mouseoverA4T2_mean)
          .on("mousemove", mousemoveA4T2)
          .on("mouseleave", mouseleaveA4T2);
    }).catch((err) => {
       console.error(err); 
    });;