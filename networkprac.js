
var nodes= {};
d3.csv("Mindmap.csv", function(data){
nodes = data;

var links = [
{source: 0, target: 1},
{source: 0, target: 2},
{source: 0, target:3},
{source: 0, target:4},
	{source:4, target:5},
	{source:4, target:6},
	{source:4, target:7},
	{source:4, target:8},
	{source:4, target:9},
	{source:4, target:10},
	
		{source:2, target:11},
		{source: 2, target:12},
		{source: 2, target:13},
		{source: 2, target:14},
			{source:3, target:15},
			{source:3, target:16},
			{source:3, target:17},
			{source:3, target:18},
				{source:1, target:19},
				{source:1, target:20},
				{source:1, target:21},
				{source:1, target:22},
				{source:1, target:23}
				
		
		
];

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
// Compute the distinct nodes from the links.


links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

var width = "100%",
    height = "100%";

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(10)
    .charge(-5000)
    .on("tick", tick)
    .start();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll(".link")
    .data(force.links())
  .enter().append("line")
    .attr("class", "link");
	
var page = function(d){return (d.page);}

var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
	.on ("mousedown", function(page){window.open(page.page)});
	//.on("mousedown", mousedown)
    //.call(force.drag);
	
node.append("circle")
    .attr ("r", function(d) {return (parseInt(d.r)*5);})
	.attr ("fill", function(d) {return (d.fill);})
	.style("stroke", "#C0C0C0")
	.style("stroke-width", 5)
	 .style("fill-opacity", 1)
	//.attr("stroke-width", 2};



node.append("text")
    //.attr("x", -30)
    //.attr("y", -30)
    .text(function(d) 
	{if (d.r > 10)
	{ return d.name; }
})
.attr("text-anchor", "middle")
	.attr("fill", "white")
	.attr("font-size",function(d) {return parseInt(d.t);})
	//.attr("stroke-width",.5)
	//.attr("stroke", "#000000");

function tick() {
  link
     .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
     .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function mouseover() {
	var element = d3.select(this);
	var circle = element.select('circle');
	element.moveToFront();
	circle.transition()
		   .duration(750)
		   .attr("fill", "#FF6666")
           .attr("r", 
				function(d) {
					return parseInt(d.r) * 10;
				}
			);
	element.select("text").text(function(d) {
		return d.name;
	})
	d3.select(this)
		.select("text")
		.transition()
		.duration(750)
		.attr("font-size", function(d) {return parseInt(d.t)*2;})
  };

function mouseout() {
  d3.select(this)
  .select("circle")
	.transition()
      .duration(750)
      .attr ("r", function(d) {return (parseInt(d.r)*5);})
	  .attr ("fill", function(d) {return (d.fill);}); 
  d3.select(this)
		.select("text")
		.transition()
		.duration(700)
		.attr("font-size", function(d) {return parseInt(d.t);})
  d3.select(this)
   .select("text")
   .text(function(d) {
        if (d.r>10) {
		return d.name;}
   });
}
});
