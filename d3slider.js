var item = document.getElementById("Slider");

var svg2 = d3.select("#Slider");
var margin2 = {right: 10, left: 10},
    width2 = parseInt(window.getComputedStyle(item,null).getPropertyValue("width"),10)-50,
    height2 = parseInt(window.getComputedStyle(item,null).getPropertyValue("height"),10);

//set a initial scale linear function
var x_slider = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width2])
    .clamp(true);
// control the value exceed the initial 

var slider = svg2.append("g")
.attr("class", "slider")
.attr("transform", "translate(" + margin2.left + "," + height2 / 2 + ")");

slider.append("line")
.attr("class", "track")
.attr("x1", x_slider.range()[0])
.attr("x2", x_slider.range()[1])
.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
.attr("class", "track-inset");


slider.append("g")
.attr("class", "ticks")
.attr("transform", "translate(0," + 15 + ")")
.selectAll("text")
.data(x_slider.ticks(5))
.enter().append("text")
.attr("x", x_slider)
.attr("text-anchor", "middle")
.text(function(d) { return d ; });
//append add a item at the end of the select object
//but if use insert , you can add a item at a position 
//by select a new oeject 

var handle = slider.append("circle")
    .attr("class", "handle")
    .attr("r", 9)
    .attr("cx",x_slider(1))
    .call(d3.drag()
    .on("start.interrupt", function() { slider.interrupt(); })
    .on("start drag", function() { 
      handle.attr("cx",x_slider(x_slider.invert(d3.event.x)));
      filter(current_file,x_slider.invert(d3.event.x));
    }));

// slider.transition() // Gratuitous intro!
//     .tween("ok",function() {
//       var i = d3.interpolate(0, 70);
//       return function(t) { console.log(t);ok(i(t)); };
//     });

// function ok(i){

// }    