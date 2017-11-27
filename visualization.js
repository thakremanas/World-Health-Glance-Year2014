

var margin = {top: 50, right: 20, bottom: 60, left: 70},
    width = 1050 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  
var x = d3.scale.linear()
          .range([0, width]);

var y = d3.scale.linear()
          .range([height, 0]);

var color = d3.scale.category10();

var tooltip = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);


var AxisFactors = {HealthcareGDPperCapita: 'Health GDP per Capita', InfantMortalityRate: 'IMR per 1000 live births', BirthRate: 'Births per 1000 people', Fertility: 'Fertility'};

//X axis svg
var X_Axis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

//Y axis svg
var Y_Axis = d3.svg.axis()
            .scale(y)
            .orient("left");

var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//reading data from csv
d3.csv("ZCountryData.csv", function (error, data) {

			  data.forEach(function(d) {
				d.HealthcareGDPperCapita = +d.HealthcareGDPperCapita;
				d.InfantMortalityRate = +d.InfantMortalityRate;
				d.BirthRate = +d.BirthRate;
				d.Fertility = +d.Fertility;
			  });

				x.domain(d3.extent(data, function(d) { return d.HealthcareGDPperCapita; })).nice();
				y.domain(d3.extent(data, function(d) { return d.InfantMortalityRate; })).nice();

			svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(X_Axis)
			  .append("text")
			  .attr("class", "label")
			  .attr("x", width)
			  .attr("y", 44)
			  .style("text-anchor", "end")
			  .text("HealthcareGDPperCapita");

			svg.append("g")
			  .attr("class", "y axis")
			  .call(Y_Axis)
			  .append("text")
			  .attr("class", "label")
			  .attr("transform", "rotate(-90)")
			  .attr("y", -34)
			  .style("text-anchor", "end")
			  .text("InfantMortalityRate")

var circles = svg.selectAll(".dot")
				  .data(data)
				  .enter().append("circle")
				  .attr("class", "dot")
				  .attr("r", 5)
				  .attr("cx", function(d) { return x(d.HealthcareGDPperCapita); })
				  .attr("cy", function(d) { return y(d.InfantMortalityRate); })
				  .style("fill", function(d) { return color(d.EconomicStatus); })
				  .style("opacity", 1)	
				  .on("mouseover", handleMouseOn)
				  .on("mouseout", handleMouseOut);

//function to change the circles when hovering the mouse and shows the tootltip and enhanced radius
  function handleMouseOn(d,i) {
								d3.select(this)
								  .transition()
								  .duration(200)
								  .attr("r", 12);
								tooltip.transition()
								  .duration(200)
								  .style("opacity", 1);
								tooltip.html(d.Country + "  :  " + d.EconomicStatus )
								  .style("left", (d3.event.pageX + 5) + "px")
								  .style("top", (d3.event.pageY - 28) + "px");
							  }
//function to change the circles when mouse is taken out.
  function handleMouseOut(d,i) {
								d3.select(this)
								  .transition()
								  .duration(200)
								  .attr("r", 5);
								tooltip.transition()
								  .duration(200)
								  .style("opacity", 0);
							  }


	d3.selectAll("[name=type]").on("change", function() {
				var selected = this.value;
				display = this.checked ? "inline" : "none";
				svg.selectAll(".dot")
				.filter(function(d) {return selected == d.EconomicStatus;})
				.attr("display", display);
			});


	d3.select("[name=X_Name]").on("change", function() {
				ValX = this.value;
				x.domain(d3.extent(data, function(d) { return d[ValX]; })).nice();
				svg.select(".x.axis").transition().call(X_Axis);
				svg.selectAll(".dot").transition().duration(1500).ease('linear').attr("cx", function(d) { 
				return x(d[ValX]);});
				svg.selectAll(".x.axis").selectAll("text.label").text(AxisFactors[ValX]);
			});


	d3.select("[name=Y_Name]").on("change", function() {
				ValY = this.value;
				y.domain(d3.extent(data, function(d) { return d[ValY]; })).nice();
				svg.select(".y.axis").transition().call(Y_Axis);
				svg.selectAll(".dot").transition().duration(1500).ease('linear').attr("cy", function(d) { 
				return y(d[ValY]);});
				svg.selectAll(".y.axis").selectAll("text.label").text(AxisFactors[ValY]);
			});

});