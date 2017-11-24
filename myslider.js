function getvalue(src){
    console.log(src.value());
}
var s1 = slider();
s1.value(1.);
d3.select("#slider").call(s1);
s1.callback(function(){getvalue(s1);});