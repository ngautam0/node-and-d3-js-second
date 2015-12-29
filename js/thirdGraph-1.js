InitChart();

function InitChart() {


d3.json("./jsonfiles/graphDataContinentPopulation.json", function (data){
  var vis = d3.select('#visualisation1'),
    WIDTH = 1000,
    HEIGHT = 450,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 100
    },

  tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "Counrty : " + d["Continent"] + "</span> <br/>" +
    "Population : " + parseFloat(d["Population (Millions) - 2013"]).toExponential(3) + "   Millions"+"</span>";
  })

  vis.call(tip);

    xRange = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1).domain(data.map(function (d) {
      return d["Continent"];
    })),


    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,
      d3.max(data, function (d) {
        return parseFloat(d["Population (Millions) - 2013"]);
      })
    ]),

    xAxis = d3.svg.axis()
      .scale(xRange)
      .tickSize(5)
      .tickSubdivide(true),

    yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(5)
      .orient("left")
      .tickSubdivide(true);


  vis.append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
        return "rotate(-45)"
        });

vis.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y",MARGINS.left/3)
    .attr("x",0-(HEIGHT/2) )
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Population (Millions) - 2013");

  vis.append('svg:g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
    .call(yAxis);


  vis.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return xRange(d["Continent"]);
    })
    .attr('y', function (d) {
      return yRange(d["Population (Millions) - 2013"]);
    })
    .attr('width', xRange.rangeBand())
    .attr('height', function (d) {
      return ((HEIGHT - MARGINS.bottom) - yRange(d["Population (Millions) - 2013"]));
    })
    // .attr('fill', 'grey')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    ;


});
}
