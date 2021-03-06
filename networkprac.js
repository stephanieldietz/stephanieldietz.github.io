
var nodes = {};
d3.csv("Mindmap.csv", function (data) {
	nodes = data;

	var links = [{
			source : 0,
			target : 1
		}, {
			source : 0,
			target : 2
		}, {
			source : 2,
			target : 11
		}, {
			source : 2,
			target : 12
		}, {
			source : 2,
			target : 13
		}, {
			source : 2,
			target : 14
		}, {
			source : 1,
			target : 19
		}, {
			source : 1,
			target : 20
		}, {
			source : 1,
			target : 21
		}, {
			source : 1,
			target : 22
		}, {
			source : 1,
			target : 23
		}, {
			source : 19,
			target : 9
		}, {
			source : 19,
			target : 7
		}, {
			source : 19,
			target : 15
		}, {
			source : 19,
			target : 17
		}, {
			source : 20,
			target : 7
		}, {
			source : 20,
			target : 10
		}, {
			source : 20,
			target : 15
		}, {
			source : 21,
			target : 5
		}, {
			source : 21,
			target : 6
		}, {
			source : 21,
			target : 8
		}, {
			source : 21,
			target : 17
		}, {
			source : 21,
			target : 18
		}, {
			source : 22,
			target : 9
		}, {
			source : 22,
			target : 7
		}, {
			source : 22,
			target : 15
		}, {
			source : 22,
			target : 17
		}, {
			source : 23,
			target : 7
		}, {
			source : 23,
			target : 16
		}, {
			source : 23,
			target : 18
		},
	];

	d3.selection.prototype.moveToFront = function () {
		return this.each(function () {
			this.parentNode.appendChild(this);
		});
	};
	// Compute the distinct nodes from the links.


	links.forEach(function (link) {
		link.source = nodes[link.source] || (nodes[link.source] = {
					name : link.source
				});
		link.target = nodes[link.target] || (nodes[link.target] = {
					name : link.target
				});
	});

	var width = 1000,
	height = 1000;

	var svg = d3.select("body").append("svg")
		.attr({
			"width" : "60%",
			"height" : "100%"
		})
		.attr("viewBox", "0 0 " + width + " " + height)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.attr("pointer-events", "all")
		.call(d3.behavior.zoom().on("zoom", redraw));

	var vis = svg
		.append('svg:g');

	function redraw() {
		vis.attr("transform",
			"translate(" + d3.event.translate + ")"
			 + " scale(" + d3.event.scale + ")");
	}

	var force = d3.layout.force()
		.nodes(d3.values(nodes))
		.links(links)
		.size([width, height])
		.linkDistance(3)
		.charge(-3500)
		.on("tick", tick)
		.start();

	var link = svg.selectAll(".link")
		.data(force.links())
		.enter().append("line")
		.attr("class", "link");

	var page = function (d) {
		return (d.page);
	}

	var node = svg.selectAll(".node")
		.data(force.nodes())
		.enter().append("g")
		.attr("class", "node")
		.on("mouseover", mouseover)
		.on("mouseout", mouseout)
		.on("click", function (page) {
			window.open(page.page)
		});

	node.append("circle")
	.attr("r", function (d) {
		return (parseInt(d.r) * 4);
	})
	.attr("fill", function (d) {
		return (d.fill);
	})
	.style("stroke", "#C0C0C0")
	.style("stroke-width", 5)
	.style("fill-opacity", 1)
	//.attr("stroke-width", 2};


	node.append("text")
	//.attr("x", -30)
	//.attr("y", -30)
	.html(function (d) {
		if (d.r > 9) {
			return "<tspan x='0' dy = '-1%'>" +
			d.name.split("<br>").join("</tspan><tspan x='0' dy='2%'>") +
			"</tspan>";
		}
	})
	.attr("text-anchor", "middle")
	.attr("fill", "#FFF")
	.attr("font-size", function (d) {
		return parseInt(d.t);
	})
	.attr("font-family", "sans-serif");

	function tick() {
		link
		.attr("x1", function (d) {
			return d.source.x;
		})
		.attr("y1", function (d) {
			return d.source.y;
		})
		.attr("x2", function (d) {
			return d.target.x;
		})
		.attr("y2", function (d) {
			return d.target.y;
		});

		node
		.attr("transform", function (d) {
			return "translate(" + d.x + "," + d.y + ")";
		});
	}

	function mouseover() {
		var element = d3.select(this);
		var circle = element.select('circle');
		element.moveToFront();
		circle.transition()
		.duration(750)
		.attr("fill", "#FF6666")
		.attr("r",
			function (d) {
			return parseInt(d.r) * 10;
		});
		element.select("text").html(function (d) {
			return "<tspan x='0' dy = '-1%'>" +
			d.name.split("<br>").join("</tspan><tspan x='0' dy='2%'>") +
			"</tspan>";
		})
		d3.select(this)
		.select("text")
		.transition()
		.duration(750)
		.attr("font-size", function (d) {
			return parseInt(d.t) * 2;
		})
		.attr("font-family", "sans-serif");
		//.attr("stroke", "#000")
		//.attr("stroke-width", 1)
	};

	function mouseout() {
		console.log("mouseout");
		d3.select(this)
		.select("circle")
		.transition()
		.duration(750)
		.attr("r", function (d) {
			return (parseInt(d.r) * 4);
		})
		.attr("fill", function (d) {
			return (d.fill);
		});
		d3.select(this)
		.select("text")
		.transition()
		.duration(700)
		.attr("font-size", function (d) {
			if (d.r < 9) {
				return 0;
			} else {
				return d.t;
			}
		});
	}
});
