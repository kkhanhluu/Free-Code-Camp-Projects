$(function () {
    "use strict";
    // costants
    const yMargin = 40,
        width = 800,
        height = 400,
        barWidth = width / 275;

    // svg container
    let svgContainer = d3.select(".visholder").append("svg")
        .attr("width", width + 100)
        .attr("height", height + 60);
    svgContainer.append("text").text("Gross Domestic Product")
        .attr("x", -300).attr("y", 80)
        .attr("transform", "rotate(-90)");

    // tooltip element 
    let tooltip = d3.select(".visholder").append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);
    
    // information text
    svgContainer.append("text").text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
        .attr("y", 455)
        .attr("x", width - 250)
        .style("font-size", "1rem")
    d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
        .then(function (result) {
            // years 
            let years = result.data.map((val, i) => new Date(val[0]));
            let xMax = new Date(d3.max(years));
            // scale x axis
            var xScale = d3.scaleTime().domain([d3.min(years), xMax]).range([0, width]);
            // x axis
            var xAxis = d3.axisBottom().scale(xScale);
            svgContainer.append("g").call(xAxis).attr("id", "x-Axis")
                .attr("transform", "translate(60, 420)");

            // gdp dataset 
            let gdp = result.data.map((val, i) => val[1]);
            const gdpMax = d3.max(gdp);
            let linearScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);
            const scaledGDP = gdp.map((gdp, i) => linearScale(gdp));
            // bars
            d3.select("svg").selectAll("rect").data(scaledGDP).enter().append("rect")
                .attr("x", (val, i) => i * barWidth)
                .attr("y", val => val)
                .attr("width", barWidth)
                .attr("height", val => height - val)
                .attr("class", "bar")
                .attr("data-gdp", gdp => gdp)
                .attr("data-date", (gdp, i) => years[i])
                .style("fill", "#33ADFF")
                .attr("transform", "translate(60, 20)")
                .on("mouseover", function (val, i) {
                    // highlight the bar, which is hovered
                    $(`[data-gdp="${val}"]`).css("fill", "white");

                    tooltip.transition()
                        .duration(200)
                        .style('opacity', 0.9);
                    let textDisplay = years[i].getFullYear(); 
                    if (years[i].getMonth() < 3) {
                        textDisplay += " Q1";
                    }
                    else if (years[i].getMonth() < 6) {
                        textDisplay += " Q2";
                    }
                    else if (years[i].getMonth() < 9) {
                        textDisplay += " Q3";
                    }
                    else {
                        textDisplay += " Q4";
                    }
                    tooltip.html(textDisplay + '<br>' + '$' + gdp[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
                        .attr('data-date', result.data[i][0])
                        .style('left', (i * barWidth) + 30 + 'px')
                        .style('top', height - 100 + 'px')
                        .style('transform', 'translateX(60px)')
                        .style("position", "absolute");

                })
                .on("mouseout", function(val,i) {
                    $(`[data-gdp="${val}"]`).css("fill", "#33ADFF");
                    tooltip.transition()
                    .duration(200)
                    .style('opacity', 0);
    
                });

            // y-axis 
            var yAxis = d3.axisLeft().scale(linearScale);
            svgContainer.append("g").call(yAxis).attr("id", "y-axis").attr("transform", "translate(60, 20)");
        });


});