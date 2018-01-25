/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/
function map(data, world_map_json){

    this.data = data;
    this.world_map_json = world_map_json;

    var div = '#world-map';
    var parentWidth = $(div).parent().width();
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = parentWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //Init color variable - scale with schemeCategory20
    var colors = d3.scaleOrdinal(d3.schemeCategory20);

    //initialize zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on('zoom', move);

    //initialize tooltip
    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Initialize projection and path variable
    var projection = d3.geoMercator()
        .center([60, 40])
        .scale(120);

    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var g = svg.append("g");

    var countries = topojson.feature(world_map_json,
        world_map_json.objects.countries).features;

    var country = g.selectAll(".country").data(countries);

    //Map each country to a color 
    var cc = [];
    data.forEach(function(d){
        cc.push(  d.Country );
    })

    cc.forEach(function(country, index){
    cc[country] = colors(index);
    });

    country.enter().insert("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("id", function(d) { return d.id; })
        .attr("title", function(d) { return d.properties.name; })
        .style("fill", function(d) { return cc[d.properties.name]; })

        //tooltip
        .on("mousemove", function(d) {

            d3.select(this).style('stroke','red');

            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

            tooltip
                .attr("style", "left:"+(mouse[0]+30)+"px;top:"+(mouse[1]+30)+"px")
                .html(d.properties.name);

        })
        .on("mouseout",  function(d) {
            
            d3.select(this).style('stroke','none');
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        //Filter the other plots when selecting a country by click
        .on("click",  function(d) {
            sp.selectDots(d.properties.name);
            pc.selectLine(d.properties.name);
        });

    function move() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform);
    }

    // Highlight countries when filtering in the other graphs
    this.selectCountry = function(value){  

        /*
         * Countries selected in parallel coordinates plot. Loop through each country
         * and manipulate only the countries selected in the parallel coordinates plot
         */

        if(value.length == undefined){
            g.selectAll('.country').each(function(d){

                if(d.properties.name == value.Country) 
                    d3.select(this).style( 'stroke', 'red');

            });
        }
        /*
        * Countries selected in scatter plot. Loop through the array of selected objects in the scatter plot
        * and the countries in the map, manipulate only the countries selected in the scatter plot.
        */
        
        else {
            g.selectAll(".country").each(function (d) {
                
                var country = this;
                
                if(value.length == 0) {
                    d3.select(country).style( 'stroke', 'none'); 
                    return;
                }
                value.forEach(function(object){
                    if(d.properties.name == object.Country)
                        d3.select(country).style( 'stroke', 'red');
                });
            });
        }
    }

}
