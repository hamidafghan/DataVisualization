// set the dimensions and margins of the graph
var margin = { top: 30, right: 80, bottom: 30, left: 50 },
    width = 580 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg1 = d3.select("#A4chart1")
    .append("svg")
    .attr('id', 'SVG_ID_A4T1')
    .attr("viewBox", `0 0 750 550`)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

const categories = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

//Read the data
d3.csv("../../DataVisualization/Data/daily_temp_data.csv",


    // When reading the csv, I must format variables:
    function (d) {
        return {
            year: d.year,
            month: d.month,
            mean: d.mean,
            max: d.max,
            min: d.min
        }
    }).then((data) => {
        const selectedYear = 2021;
        data = data.filter(function (row) {
            return row.year == selectedYear;
        });

        data.forEach(function (d) {
            d.mean = parseFloat(d.mean);
            d.max = parseFloat(d.max);
            d.min = parseFloat(d.min);


        });

        // Add X axis --> it is a date format
        var x = d3.scaleBand()
            .domain(categories)
            .range([0, width]);
        svg1.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "translate(-10,0)rotate(45)")
            .style("text-anchor", "start");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([d3.min(data, d => d.min), d3.max(data, d => d.max)])
            .range([height, 0]);
        svg1.append("g")
            .attr("transform", "translate(-5,0)")
            .call(d3.axisLeft(y).tickSizeOuter(0))

        svg1.append("text")
            .attr("text-anchor", "end")
            .attr("x", 50)
            .attr("y", -10)
            .text("Temperature (°C)")
            .style('font-size', '10px');


        //Tooltip
        var tooltipA4T1 = d3.select("#A4chart1")
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
        const mouseoverA4T1_max = function (e,d) {
            tooltipA4T1
                .transition()
                .duration(200)
                .style("opacity", 1)
            tooltipA4T1
                .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Max Temp (°C): </span>" + d.max)
        }
        let mouseoverA4T1_min = function (e,d) {
            tooltipA4T1
                .transition()
                .duration(200)
                .style("opacity", 1)
            tooltipA4T1
                .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Min Temp (°C): </span>" + d.min)
        }
        let mouseoverA4T1_mean = function (e,d) {
            tooltipA4T1
                .transition()
                .duration(200)
                .style("opacity", 1)
            tooltipA4T1
                .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Mean Temp (°C): </span>" + d.mean)
        }
        let mousemoveA4T1 = function (e,d) {
            tooltipA4T1
                .style('left', (event.pageX + 20) + 'px')
                .style('top', (event.pageY + 10) + 'px')

        }
        let mouseleaveA4T1 = function (e,d) {
            tooltipA4T1
                .transition()
                .duration(200)
                .style("opacity", 0);
        }

        // Add the line- Drawing the maximum
        svg1.append("path")
            .datum(data)
            .attr("class", "path-line")
            .attr("id", "pathMax")
            .attr("fill", "none")
            .attr("stroke", "#fd7e14")
            .attr("stroke-width", 4)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(
                        d.month)
                })
                .y(function (d) {
                    return y(d.max)
                })
            )
        //Drawing minimum
        svg1.append("path")
            .datum(data)
            .attr("class", "path-line")
            .attr("id", "pathMin")
            .attr("fill", "none")
            .attr("stroke", "#74c0fc")
            .attr("stroke-width", 4)
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d.month)
                })
                .y(function (d) {
                    return y(d.min)
                })
            )

        // Add dots
        svg1.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "circle-line")
            .attr("id", "circleMax")
            .attr("fill", "#fd7e14")
            .attr("stroke", "white")
            .attr("cx", function (d) {
                return x(d.month)
            })
            .attr("cy", function (d) {
                return y(d.max)
            })
            .attr("r", 3)
            .on("mouseover", mouseoverA4T1_max)
            .on("mousemove", mousemoveA4T1)
            .on("mouseleave", mouseleaveA4T1);

        svg1.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "circle-line")
            .attr("id", "circleMin")
            .attr("fill", "#74c0fc")
            .attr("stroke", "white")
            .attr("cx", function (d) {
                return x(d.month)
            })
            .attr("cy", function (d) {
                return y(d.min)
            })
            .attr("r", 3)
            .on("mouseover", mouseoverA4T1_min)
            .on("mousemove", mousemoveA4T1)
            .on("mouseleave", mouseleaveA4T1);


        svg1.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "circle-line")
            .attr("id", "circleMean")
            .attr("cx", function (d) {

                return x(d.month);
            })
            .attr("cy", function (d) {
                return y(d.mean);
            })
            .attr("r", 3)
            .style("fill", 'green')
            .attr('stroke', "white")
            .on("mouseover", mouseoverA4T1_mean)
            .on("mousemove", mousemoveA4T1)
            .on("mouseleave", mouseleaveA4T1);

        var highlight = function (e,d) {
            // reduce opacity of all groups
            d3.selectAll(".path-line").style("opacity", .01)
            d3.selectAll(`.circle-line`).style("opacity", .01)

            // expect the one that is hovered
            console.log(e,d)
            d3.selectAll(`#circle${d}`).style("opacity", 1)
            d3.selectAll(`#path${d}`).style("opacity", 1)
        }

        // And when it is not hovered anymore
        var noHighlight = function (e,d) {
            d3.selectAll(".path-line").style("opacity", 1)
            d3.selectAll(`.circle-line`).style("opacity", 1)
        }

        var allgroups = ["Max", "Mean", "Min"]
        let color2 = ['#fd7e14', 'green', '#74c0fc']
        var size = 20
        var moveX = 100
        var moveY = 50
        var xCircle = 390 + moveX
        var xLabel = 440 + moveX
        svg1.selectAll("myrect")
            .data(allgroups)
            .enter()
            .append("circle")
            .attr("cx", xCircle)
            .attr("cy", function (d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function (d, i) { return color2[i] })
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

        // Add labels beside legend dots
        svg1.selectAll("mylabels")
            .data(allgroups)
            .enter()
            .append("text")
            .attr("x", xCircle + size * .8)
            .attr("y", function (d, i) { return i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function (d, i) { return color2[i] })
            .text(function (d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
    }).catch((err) => {
        console.error(err);
    });


d3.select("#yearsA4T1").on("change", function () {

    let selectedYear = this.value
    var margin = { top: 30, right: 80, bottom: 30, left: 50 },
        width = 580 - margin.left - margin.right,
        height = 320 - margin.top - margin.bottom;

    d3.select("#SVG_ID_A4T1").remove()
    // append the svg object to the body of the page
    var svg1 = d3.select("#A4chart1")
        .append("svg")
        .attr('id', 'SVG_ID_A4T1')
        .attr("viewBox", `0 0 620 480`)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    d3.csv("../../DataVisualization/Data/daily_temp_data.csv",

        // When reading the csv, I must format variables:
        function (d) {
            return {
                year: d.year,
                month: d.month,
                mean: d.mean,
                max: d.max,
                min: d.min
            }
        }).then((data) => {
            
        
            data = data.filter(function (row) {
                return row.year == selectedYear;
            });

            data.forEach(function (d) {
                d.mean = parseFloat(d.mean);
                d.max = parseFloat(d.max);
                d.min = parseFloat(d.min);

            });

            // Add X axis --> it is a date format
            var x = d3.scaleBand()
                .domain(categories)
                .range([0, width]);
            svg1.append("g")
                .attr("transform", "translate(0," + (height) + ")")

                .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0)).selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "translate(-10,0)rotate(45)")
                .style("text-anchor", "start");

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([d3.min(data, d => d.min), d3.max(data, d => d.max)])
                .range([height, 0]);
            svg1.append("g")
                .attr("transform", "translate(-5,0)")
                .call(d3.axisLeft(y).tickSizeOuter(0));

            svg1.append("text")
                .attr("text-anchor", "end")
                .attr("x", 50)
                .attr("y", -10)
                .text("Temperature (°C)")
                .style('font-size', '10px');

            //Tooltip
            var tooltipA4T1 = d3.select("#A4chart1")
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
            const mouseoverA4T1_max = function (e,d) {
                tooltipA4T1
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                tooltipA4T1
                    .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Max Temp (°C): </span>" + d.max)
            }
            let mouseoverA4T1_min = function (e,d) {
                tooltipA4T1
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                tooltipA4T1
                    .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Min Temp (°C): </span>" + d.min)
            }
            let mouseoverA4T1_mean = function (e,d) {
                tooltipA4T1
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                tooltipA4T1
                    .html("<span style='color:grey'>Year: </span> " + d.year + "<br><span style='color:grey'>Month: </span> " + d.month + "<br><span style='color:grey'>Mean Temp (°C): </span>" + d.mean)
            }
            let mousemoveA4T1 = function (e,d) {
                tooltipA4T1
                    .style('left', (event.pageX + 20) + 'px')
                    .style('top', (event.pageY + 10) + 'px')

            }
            let mouseleaveA4T1 = function (e,d) {
                tooltipA4T1
                    .transition()
                    .duration(200)
                    .style("opacity", 0);
            }

            // Add the line- Drawing the maximum
            svg1.append("path")
                .datum(data)
                .attr("class", "path-line")
                .attr("id", "pathMax")
                .attr("fill", "none")
                .attr("stroke", "#fd7e14")
                .attr("stroke-width", 4)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(
                            d.month)
                    })
                    .y(function (d) {
                        return y(d.max)
                    })
                )
            //Drawing minimum
            svg1.append("path")
                .datum(data)
                .attr("class", "path-line")
                .attr("id", "pathMin")
                .attr("fill", "none")
                .attr("stroke", "#74c0fc")
                .attr("stroke-width", 4)
                .attr("d", d3.line()
                    .x(function (d) {
                        return x(d.month)
                    })
                    .y(function (d) {
                        return y(d.min)
                    })
                )

            // Add dots
            svg1.selectAll("myCircles")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "circle-line")
                .attr("id", "circleMax")
                .attr("fill", "#fd7e14")
                .attr('stroke', "white")
                .attr("cx", function (d) {
                    return x(d.month)
                })
                .attr("cy", function (d) {
                    return y(d.max)
                })
                .attr("r", 3)
                .on("mouseover", mouseoverA4T1_max)
                .on("mousemove", mousemoveA4T1)
                .on("mouseleave", mouseleaveA4T1);

            svg1.selectAll("myCircles")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "circle-line")
                .attr("id", "circleMin")
                .attr("fill", "#74c0fc")
                .attr('stroke', "white")
                .attr("cx", function (d) {
                    return x(d.month)
                })
                .attr("cy", function (d) {
                    return y(d.min)
                })
                .attr("r", 3)
                .on("mouseover", mouseoverA4T1_min)
                .on("mousemove", mousemoveA4T1)
                .on("mouseleave", mouseleaveA4T1);

            svg1.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "circle-line")
                .attr("id", "circleMean")
                .attr("cx", function (d) {

                    return x(d.month);
                })
                .attr("cy", function (d) {
                    return y(d.mean);
                })
                .attr("r", 3)
                .style("fill", 'green')
                .attr('stroke', "white")
                .on("mouseover", mouseoverA4T1_mean)
                .on("mousemove", mousemoveA4T1)
                .on("mouseleave", mouseleaveA4T1);


            var highlight = function (e,d) {
                // reduce opacity of all groups
                d3.selectAll(".path-line").style("opacity", .01)
                d3.selectAll(`.circle-line`).style("opacity", .01)

                // expect the one that is hovered
                console.log(e,d)
                d3.selectAll(`#circle${d}`).style("opacity", 1)
                d3.selectAll(`#path${d}`).style("opacity", 1)
            }

            // And when it is not hovered anymore
            var noHighlight = function (e,d) {
                d3.selectAll(".path-line").style("opacity", 1)
                d3.selectAll(`.circle-line`).style("opacity", 1)
            }

            var allgroups = ["Max", "Mean", "Min"]
            let color2 = ['#fd7e14', 'green', '#74c0fc']
            var size = 20
            var moveX = 40
            var moveY = 50
            var xCircle = 390 + moveX
            var xLabel = 440 + moveX
            svg1.selectAll("myrect")
                .data(allgroups)
                .enter()
                .append("circle")
                .attr("cx", xCircle)
                .attr("cy", function (d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 6)
                .style("fill", function (d, i) { return color2[i] })
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

            // Add labels beside legend dots
            svg1.selectAll("mylabels")
                .data(allgroups)
                .enter()
                .append("text")
                .attr("font-size", 12 + "px")
                .attr("x", xCircle + size * .8)
                .attr("y", function (d, i) { return i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function (d, i) { return color2[i] })
                .text(function (d) { return d })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)

        }).catch((err) => {
            console.error(err);
        });;

});

