/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/

function sp(data){

    //console.log(data);
    this.data = data;
    var div = '#scatter-plot';

    var height = 500;
    var parentWidth = $(div).parent().width();
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = parentWidth - margin.right - margin.left,
        height = height - margin.top - margin.bottom;

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    /*
    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0.9);
    */

    // change data strings into number format
    data.forEach(function(d) {
        d['Water_quality'] = +d['Water_quality'];
        d['Life_satisfaction'] = +d['Life_satisfaction'];
        d['Self_reported_health'] = +d['Self_reported_health'];
        //console.log(d);
    });

    circleSizeScale = d3.scaleLinear().range([0, d3.max(data, function(d) { return d['Self_reported_health']; })]);

    var xValue = (d) => { return d['Water_quality'] },
        xScale = d3.scaleLinear().range([0, width]),
        xMap = (d) => { return xScale( xValue(d) ) },
        xAxis = d3.axisBottom().scale(xScale);

    var yValue = function(d) { return d["Life_satisfaction"];}, 
        yScale = d3.scaleLinear().range([height, 0]), 
        yMap = function(d) { return yScale( yValue(d)) }, 
        yAxis = d3.axisLeft().scale(yScale);

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    xScale.domain(d3.extent(data, function(d) { return d['Water_quality']; })).nice();
    yScale.domain(d3.extent(data, function(d) { return d['Life_satisfaction']; })).nice();
    circleSizeScale.domain(d3.extent(data, function(d) { return d['Self_reported_health']; })).nice();


    // Add x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
            .attr("class", "label")
            .attr("x", width/2)
            .attr("y", -6)
            .style("font-size", 20)
            .style("color", '#000000')
            .attr("text-anchor", "end")
            .text("Student Skills");

    // Add y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
            .attr("class", "label")
            .attr("y", 6)
            .attr("dy", ".71em")
            .text("Life Satisfaction");

    //Add scatter dots
    var circles = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "non_brushed")
        .attr("r", function(d) {return circleSizeScale( d['Self_reported_health'] ) / 7 })
        .attr("cx", function(d) { return xScale(d['Water_quality']); })
        .attr("cy", function(d) { return yScale(d['Life_satisfaction']); })
        .style("fill", function(d) { return color( d['Country'] ) } );
        

    var brush = d3.brush()
    .on("brush end",highlightBrushedCircles);
    
    svg.append("g")
        .call(brush);
		
    //Handle highlighted scatter dots by the brush
    function highlightBrushedCircles() {

        if (d3.event.selection != null) {
            // revert circles to initial style
            circles.attr("class", "non_brushed");
            var brush_coords = d3.brushSelection(this);
            // style brushed circles
            circles.filter(function (){
                    var cx = d3.select(this).attr("cx");
                    var cy = d3.select(this).attr("cy");
                    return isBrushed(brush_coords, cx, cy);
            })
            .attr("class", "brushed");
            var d_brushed =  d3.selectAll(".brushed").data();
			
            map.selectCountry(d_brushed);
            pc.selectLine(d_brushed);

        }
    }

    function isBrushed(brush_coords, cx, cy) {
        var x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    //Linking the 3 plots, enabling filtering
    this.selectDots = function(value){

    /*
    * (Input value == object)
    * Countries selected in the parallel coordinates plot.  Loop though all scatter dots
    * and manipulate the dots corresponding to the selected ones in parallel coordinates plot
    */
    if( typeof value === 'object' ){
        svg.selectAll('.non_brushed').each(function(d){
            if( d.Country == value.Country ) {
                d3.select(this)
                    .style( 'stroke', 'red')
                    .style('stroke-width', '3');
            }
        });
    }
    /*
    * (Input value == string [country name])
    * Countries selected in the map plot. Same logic as above.
    */
    else {

        svg.selectAll(".non_brushed").each(function (d) {
            var dataPoint = this;
    
            if(d.Country == value){
                d3.select(dataPoint)
                .style( 'stroke', 'red')
                .style('stroke-width', '3');
            }
            else 
                d3.select(dataPoint).style( 'stroke', 'none'); 				  
        });	
    }		
    };

}
