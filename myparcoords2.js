var index = [-1,1,2,3,4];
// var color = ["red","Green","Green","blue","blue"];
var red = d3.lab(58,71,71),
    green = d3.lab(88,-79,79),
    blue = d3.lab(58,0,-66);
var color = [red,green,green,blue,blue];
var center = "VLPN800_0";
var svg,projection,line;
var dimensions,dimension,yAxis,x;
var dataset={};
show("speed.csv");
var blue_to_brown = d3.scaleLinear()
.domain(index)
.range(color)
.interpolate(d3.interpolateLab);
// interpolate 插值器 可以插值的对象包括整数，数组，颜色，字符串
/*
var i = d3.interpolateNumber(10, 20);
i(0.0); // 10 
i(0.2); // 12
i(0.5); // 15
i(1.0); // 20.
*/
function show(filename)
{
    d3.selectAll("svg > *").remove();
    var margin = {top: 0 , right: 40, bottom: 30, left: 80},
    width = window.innerWidth *0.5,
    //height = 500 - margin.top - margin.bottom;
    height = window.innerHeight*0.8;
    dimensions = [
        {
          name: "-10(min)",
          //scale: d3.scale.linear().range([0, height]),
          //^v3 
          scale: d3.scaleLinear().range([height, 0]).domain([100,0]),
          type: Number
        },
        {
          name: "-5(min)",
          //scale: d3.scale.linear().range([height, 0]),
          //^v3 
          scale: d3.scaleLinear().range([height, 0]),
          type: Number
        },
        {
          name: "Now",
          //scale: d3.scale.sqrt().range([height, 0]),
          //^v3 
          scale: d3.scaleLinear().range([height, 0]),
          type: Number
        },
        {
          name: "5(min)",
          //scale: d3.scale.linear().range([height, 0]),
          //^v3
          scale: d3.scaleLinear().range([height, 0]),
          type: Number
        },
        {
          name: "10(min)",
          //scale: d3.scale.linear().range([height, 0]),
          //^v3
          scale: d3.scaleLinear().range([height, 0]),
          type: Number
        }, 
        {
          name: "15(min)",
          //scale: d3.scale.linear().range([height, 0]),
          //^v3
          scale: d3.scaleLinear().range([height, 0]),
          type: Number
        }                   
      ];
    
    x = d3.scalePoint()
    .domain(dimensions.map(function(d) { return d.name; }))
    .range([0, width*0.8]);
    
    line = d3.line()
    .defined(function(d) { return !isNaN(d[1]); });
    // isNaN() check the item if a number or not, if not a number return true
    
    yAxis = d3.axisLeft();
    //set the axis orient
    
    svg = d3.select("#main")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");
    
    dimension = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; });
    document.getElementById("title").innerHTML=filename.split('.')[0];//split the string csv
    d3.csv('/data/parcoords/data/'+filename, function(data) {
        //console.log(filename);
        var value;
        for( value in data )
        {
            var key = data[value].VD_Name;
            dataset[key] = data[value];
        }
        console.log(dataset["VLPN800_0"]);
        var max = new Array(); ;
        dimensions.forEach(function(dimension) {
            max.push(d3.max(data, function(d) {return +d[dimension.name]; }));
        }); 
        dimensions.forEach(function(dimension) {
            dimension.scale.domain([0,d3.max(max)]);
        }); 
        //set the dimensions domain 
        svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(data)
            .style("stroke",function(d){
                if( d['is_Plane'] == "True" )
                {
                return blue_to_brown(d['lane_amount']); 
                }
                else if(d['is_Plane'] == "False" )
                {
                return blue_to_brown(-1); 
                }
            }).style("stroke-width","2px")
            .enter().append("path")
            .attr("d", draw);
                
        svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .style("stroke",function(d){              
                if( d['is_Plane'] == "True" )
                {
                    return blue_to_brown(d['lane_amount']); 
                }
                else if(d['is_Plane'] == "False" )
                {
                    return blue_to_brown(-1); 
                }
                }).style("stroke-width","2px")
            .attr("d", draw);

        dimension.append("g")
            .attr("class", "axis")
            .each(function(d) {d3.select(this).call(yAxis.scale(d.scale)); });

        dimension.append("g")
                .attr("class", "title")
                .append("text")
                .attr("class", "title")
                .attr("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d) { return d.name; });              
    
        // Rebind the axis data to simplify mouseover.
        svg.select(".axis").selectAll("text:not(.title)")
                    .attr("class", "label")
                    .data(data, function(d) { return d.name || d; });
            
                projection = svg.selectAll(".axis text,.background path,.foreground path")
                    .on("mouseover", mouseover)
                    .on("mouseout", mouseout);
    });       
}
function mouseover(d) {
    //console.log(d);
    svg.classed("active", true);
    projection.classed("inactive", function(p) {return p !== d; });
    projection.filter(function(p) { return p === d; }).each(moveToFront).style("opacity",1);
    center = d.VD_Name;
    newLocation();
}
    
function mouseout(d) {
    svg.classed("active", false);
    projection.classed("inactive", false)
    projection.filter(function(p) { return p === d; }).each(moveToFront).style("opacity",0.2);
    //svg.selectAll("text").style("font","13px").style("opacity",1.0);
    markers[merge].setAnimation(null);
}
    
function moveToFront() {
        this.parentNode.appendChild(this);
}
function draw(d) {
    return line(dimensions.map(function(dimension) {return [x(dimension.name), dimension.scale(d[dimension.name])];}));
}
function map_highlight(d)
{
    svg.classed("active", true);
    projection.classed("inactive", function(p) {return p !== dataset[d]; });
    projection.filter(function(p) { return p === dataset[d]; }).each(moveToFront).style("opacity",1);
}
function map_unhighlight(d)
{
    svg.classed("active", false);
    projection.classed("inactive", false)
    projection.filter(function(p) { return p === dataset[d]; }).each(moveToFront).style("opacity",0.2);
}
