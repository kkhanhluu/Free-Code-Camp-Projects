$(function () {
    "use strict";
    const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
    const margin = {
        top: 30,
        right: 20,
        bottom: 30,
        left: 60
    };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // svg container
    let svgContainer = d3.select("body").append("svg")
        .attr("x", margin.right).attr("y", margin.top)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
        .attr("transform", "translate(280, 0)")
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // color scheme 
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // overlay 
    let overlay = d3.select(".visholder").append("div").attr("class", "overlay");
    d3.json(url).then(function (data) {
        // time set
        const timeset = data.map(val => {
            const parsedtime = val.Time.split(":");
            return new Date(Date.UTC(1970, 0, 1, 0, parsedtime[0], parsedtime[1]));
        });
        // years
        const years = data.map(val => val.Year);

        const maxTime = new Date(d3.max(timeset));
        const yScale = d3.scaleTime().domain(d3.extent(timeset)).range([0, height]);

        const xScale = d3.scaleTime().domain([d3.min(years) - 1, d3.max(years) + 1]).range([0, width]);

        // x axis
        let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        svgContainer.append("g").attr("id", "x-axis")
            .call(xAxis).attr("transform", "translate(0, " + (height) + ")");
        svgContainer.append("text").style("text-anchor", "middle")
            .attr("x", width / 2).attr("y", height + 30).text("Year");


        // y axis
        let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
        svgContainer.append("g").attr("id", "y-axis").call(yAxis);
        svgContainer.append("text").style("text-anchor", "middle")
            .attr("x", -100).attr("y", -45).attr("transform", "rotate(-90)").text("Time in Minutes");

        // dots
        d3.select("svg").selectAll(".dot").data(timeset).enter()
            .append("circle").attr("class", "dot").attr("cx", (val, i) => xScale(years[i]) + margin.left)
            .attr("cy", val => yScale(val) + margin.top).attr("r", 6)
            .attr("fill", (val, i) => {
                if (data[i].Doping === "") {
                    return color(0);
                }
                return color(1);
            })
            .on("mouseover", function(val, i) {
                let textDisplay = data[i].Name + ": " + data[i].Nationality + "<br>"; 
                textDisplay += "Year: " + data[i].Year + ", Time: " + data[i].Time + "<br>";
                textDisplay += data[i].Doping;
                d3.select(".overlay")
                .html(`<span>${textDisplay}</span`)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("opacity", 0.9)
                .style("position", "absolute")
                .style("width", 20)
                .style("height", 40)
                .style("background-color", "#4C92C3");
            })
            .on("mouseout", function(val, i) {
                d3.select(".overlay").style("opacity", 0);
            });

        // explaination no allergation
        svgContainer.append("text").attr("x", width - 180).attr("y", height / 2)
            .text("No doping allergation");
        svgContainer.append("rect").attr("y", height / 2 - 15)
            .attr("x", width - 20).attr("width", 20).attr("height", 20).attr("fill", color(0));

        // explaination with allergation
        svgContainer.append("text").attr("x", width - 240).attr("y", height / 2 + 30)
            .text("Riders with doping allergation");
        svgContainer.append("rect").attr("y", height / 2 + 15)
            .attr("x", width - 20).attr("width", 20).attr("height", 20).attr("fill", color(1));
    });
});