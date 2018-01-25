/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/
function pc(data){

    function axesDims(height){
        return [
            {
              name: "Country",
              scale: d3.scaleBand().range([0, height]),
              type: "string"
            },
            {
              name: "Household_income",
              scale: d3.scaleLinear().range([0, height]),
              type: "number"
            },
            {
              name: "Employment_rate",
              scale: d3.scaleLinear().range([height, 0]),
              type: "number"
            },
            {
              name: "Unemployment_rate",
              scale: d3.scaleLinear().range([height, 0]),
              type: "number"
            },
            {
              name: "Personal_earnings",
              scale: d3.scaleLinear().range([height, 0]),
              type: "number"
            },
            {
              name: "Quality_of_support_network",
              scale: d3.scaleLinear().range([height, 0]),
              type: "number"
            },
            {
              name: "Student_skills",
              scale: d3.scaleLinear().range([height, 0]),
              type: "number"
            },
            {
              name: "Water_quality",
              scale: d3.scaleLinear().range([height, 0]),
              type: "number"
            },
            {
              name: "Voter_turnout",
              scale: d3.scaleLinear().range([height, 0]),
              type: "number"
            },
            {
              name: "Self_reported_health",
              scale: d3.scaleLinear().range([height, 0]),
              type: "number"
            },
            {
              name: "Life_satisfaction",
              scale: d3.scaleLinear().range([height, 0]),
              type: "number"
            },
        ];
    }

	
  this.data = data;
  var div = '#pc-chart';
  var colors = d3.scaleOrdinal(d3.schemeCategory20);

  var parentWidth = $(div).parent().width();
  var margin = {top: 40, right: 0, bottom: 10, left: 100},
      width = parentWidth - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var dimensions = axesDims(height);
  dimensions.forEach(function(dim) {
    dim.scale.domain(dim.type === "number"
        ? d3.extent(data, function(d) { return +d[dim.name]; })
        : data.map(function(d) { return d[dim.name]; }).sort());
  });

  //Tooltip
  var tooltip = d3.select(div).append("div")
       .attr("class", "tooltip")
       .style("opacity", 0);

  var line = d3.line()
     .defined(function(d) { return !isNaN(d[1]); });

  //Y axis orientation
  var yAxis = d3.axisLeft();

  var svg = d3.select(div).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Scaling the x axis
  var x = d3.scaleBand()
      .domain(dimensions.map(function(d){ return d.name;}))
      .range([0, width]);
	  
  //Add the x-axis
  var axes = svg.selectAll(".axes")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });
	
	axes.append("g")
    .attr("class", "axis")
    .each(function(d) { d3.select(this).call(yAxis.scale(d.scale)); })
    .append("text")
    .attr("class", "title")
    .style('fill','black')
    .style('font-size','9px')
    .attr("text-anchor", "middle")
    .attr("y", -9)
    .text(function(d) { return d.name; });


    //Mapping each country to a color
    var cc = [];
	  data.forEach(function(d){
	  cc.push(  d.Country );
	  })

	  cc.forEach(function(country, index){
		cc[country] = colors(index);
	  });


    var background = svg.append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(data)
      .enter().append("path")
      .attr("d", draw); 

    var foreground = svg.append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(data)
      .enter().append("path")
      .attr("d", draw) 
      .style("stroke", function(d) { return cc[d.Country]; }) //Assigning each line with the country color
	   	
	 var brush1 = d3.brushY()
      .extent([[-10, 0], [10, height]])
      .on("start",brushstart)
      .on("brush",brush)
      .on("end",brush);
	
    /* ~~ Task 9 Add and store a brush for each axis. ~~*/
    axes.append("g")
        .attr("class", "brush")
		    .call(brush1)		
        .selectAll("rect")
        .attr("x", -10)
        .attr("width", 20);

    //Select lines for mouseover and mouseout
    var projection = svg.selectAll(".background path, .foreground path")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);


    function mouseover(d) {

      //Only show then active..
      tooltip.transition().duration(200).style("opacity", .9);
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

      tooltip.attr(
        "style",
        "left:"+(mouse[0]+30)+
        "px;top:"+(mouse[1]+40)+"px")
        .html(d.Country);

      svg.classed("active", true);

      // this could be more elegant
      if (typeof d === "string") {
        projection.classed("inactive", function(p) { return p.name !== d; });
        projection.filter(function(p) { return p.name === d; }).each(moveToFront);

      } else {
        projection.classed("inactive", function(p) { return p !== d; });
        projection.filter(function(p) { return p === d; }).each(moveToFront);
      }
    }

    function mouseout(d) {

      tooltip.transition()
          .duration(500)
          .style("opacity", 0);

      svg.classed("active", false);
      projection.classed("inactive", false);
      
    }

    function moveToFront() {
      this.parentNode.appendChild(this);
    }

    function draw(d) {
      return line(dimensions.map(function(dim) {
        return [x(dim.name), dim.scale(d[dim.name])];
      }));
    }

    function brushstart() {
      d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush(d) {

      var actives = [];
      svg.selectAll(".dimension .brush").filter(function(d) {
        return d3.brushSelection(this);
      })
      .each(function(d) {
        actives.push({
          dim: d,
          extent: d3.brushSelection(this)
        });
      });

      foreground.style("display", function (d) {
          return actives.every(function (active) {
             var dim = active.dim;
             var ext = active.extent;
             var l = within(d, ext, dim);
             return l;
          }) ? null : "none";
      });

      function within(d, extent, dim) {
        var w =  dim.scale(d[dim.name]) >= extent[0]  && dim.scale(d[dim.name]) <= extent[1];

        if(w){
            console.log(d);
            map.selectCountry(d);
            sp.selectDots(d);
        }

        return w;
      };


    } //Brush

    //Select all the foregrounds send in the function as value
    this.selectLine = function(value){
        //if only one object is selected (e.g. from map)
        if( typeof value === 'string' ) {
            foreground.each(function(d){
              if(d.Country == value) {
                  d3.select(this).style('stroke-width', '4');
              }
              else
                d3.select(this).style('stroke-width', '1');
              })
        } 
        //if multiple values are selected (in scatter plot)
        else {
            foreground.each(function(d){
                let country = this;

                if(value.length == 0) {
                  d3.select(country).style( 'stroke-width', '1'); 
                  return;
                }
                
                value.forEach(function(object){
                    if(d.Country == object.Country) 
                        d3.select(country).style('stroke-width', '4');

                });
            });

          }
    };


}
