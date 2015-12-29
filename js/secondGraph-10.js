(function(){var n = 4; // number of layers

// console.log("hello");
var margin = {top: 20, right: 50, bottom: 100, left: 75},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("#visualisation1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("./jsonfiles/graphDataHighPopulation.json", function (data){
    var headers = [
                  "Population (Millions) - 2010",
                  "Population (Millions) - 2011",
                  "Population (Millions) - 2012",
                  "Population (Millions) - 2013"
                  ];
    var layers = d3.layout.stack()(headers.map(function(populationRange) {
        return data.map(function(d) {
          return {x: d["Country Name"], y: +d[populationRange]};
        });
    }));

    // console.log(data.countryName);
    var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "Country : " + d.x + "</span> <br/>" +
    "Population : " + parseFloat(d.y).toExponential(3) + " M"+"</span>";
  })

  svg.call(tip);
// console.log(layers);
    var yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); });
    var yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });
// console.log(yGroupMax);
// console.log(yStackMax);
    var xScale = d3.scale.ordinal()
        .domain(layers[0].map(function(d) { return d.x; }))
        .rangeRoundBands([25, width], .5);

    var y = d3.scale.linear()
        .domain([0,yStackMax])
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .domain(headers)
        .range(["#000d33", "#002db3", "#668cff","#ccd9ff"]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSize(0)
        .tickPadding(6)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var layer = svg.selectAll(".layer")
        .data(layers)
        .enter().append("g")
        .attr("class", "layer")
        .style("fill", function(d, i) {return color(i); });




    var rect = layer.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return xScale(d.x); })
        .attr("y", height)
        .attr("width", xScale.rangeBand())
        .attr("height", 0)
        .on('mouseover', tip.show)
    .on('mouseout', tip.hide);


    rect.transition()
        .delay(function(d, i) { return i * 50; })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

    //********** AXES ************
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text").style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                  return "rotate(-45)"
                });

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(20,0)")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr({"x": -height/3, "y": -70})
        .attr("dy", ".75em")
        .style("text-anchor", "end")
        .text("Population (Millions)");


    var legend = svg.selectAll(".legend")
        .data(headers.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(50," + i * 20 + ")"; })

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d;  });


});
})();
