class LineChart {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, _legend) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 240,
            margin: _config.margin || {
                top: 25,
                right: 30,
                bottom: 30,
                left: 50
            }
        }
        this.data = _data;
		this.legend = _legend;
        this.initVis();
    }

    /**
     * Initialize scales/axes and append static chart elements
     */
    initVis() {
        let vis = this;
		
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.xScale = d3.scaleTime()
            .range([0, vis.width])
			.domain([1980, 2021]);

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])
            .nice()
			.domain([0,300]);
		
		vis.prev = vis.data;
        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(6)
            .tickSizeOuter(0)
            .tickPadding(10);
        //.tickFormat(d => d + ' km');

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(4)
            .tickSizeOuter(0)
            .tickPadding(10);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Append empty x-axis group and move it to the bottom of the chart
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        // Append y-axis group
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');
			
		vis.colorScale = d3.scaleOrdinal()
			.range(['red', 'blue', 'yellow', 'green', 'orange', 'grey']);

        // We need to make sure that the tracking area is on top of other chart elements
        vis.marks = vis.chart.append('g');
        vis.trackingArea = vis.chart.append('rect')
            .attr('width', vis.width)
            .attr('height', vis.height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all');
			
		vis.tooltip = vis.chart.append('g')
			.attr('class', 'tooltip')
			.style('display', 'none');

		vis.tooltip.append('circle')
			.attr('r', 4);

		vis.tooltip.append('text');
			
		if (this.legend) {
			vis.svg.append("circle").attr("cx",650).attr("cy",7).attr("r", 5).style("fill", "red");
			vis.svg.append("circle").attr("cx",650).attr("cy",18).attr("r", 5).style("fill", "blue");
			vis.svg.append("circle").attr("cx",650).attr("cy",29).attr("r", 5).style("fill", "yellow");
			vis.svg.append("circle").attr("cx",650).attr("cy",40).attr("r", 5).style("fill", "green");
			vis.svg.append("circle").attr("cx",650).attr("cy",51).attr("r", 5).style("fill", "orange");
			vis.svg.append("circle").attr("cx",650).attr("cy",62).attr("r", 5).style("fill", "grey");
			vis.svg.append("text").attr("x", 660).attr("y", 7).text("median/CO").style("font-size", "15px").attr("alignment-baseline","middle");
			vis.svg.append("text").attr("x", 660).attr("y", 19).text("90th/NO2").style("font-size", "15px").attr("alignment-baseline","middle");
			vis.svg.append("text").attr("x", 660).attr("y", 31).text("Max/Ozone").style("font-size", "15px").attr("alignment-baseline","middle");
			vis.svg.append("text").attr("x", 660).attr("y", 43).text("PM 2.5").style("font-size", "15px").attr("alignment-baseline","middle");
			vis.svg.append("text").attr("x", 660).attr("y", 55).text("SO2").style("font-size", "15px").attr("alignment-baseline","middle");
			vis.svg.append("text").attr("x", 660).attr("y", 67).text("PM 10").style("font-size", "15px").attr("alignment-baseline","middle");
			vis.svg.append('text').attr('x', 360).attr('y', 235).text('Year').style("font-size", "15px").attr("alignment-baseline","middle");
		}
    }

    updateVisAQI() {
		
        let vis = this;
		
		vis.group = d3.groups(vis.data, d => d.type);
		console.log(vis.prev);
		
		vis.xScale.domain(d3.extent(vis.data, d => d.year));
		//vis.yScale.domain([0, d3.max(vis.group[], d => d[1])]);
		
        vis.renderVisAQI();
    }

    renderVisAQI() {
        let vis = this;


		/* LINE TRANSITION
		let linePath = vis.chart.selectAll('.line-path')
			.data([vis.previous],  d => d.year)
			.join('path')
			.attr('id', 'linePathElement')
			.attr('stroke',  '#8693a0')
			.attr('stroke-width', 2)
			.attr('fill', 'none')
			.attr('d', vis.line(vis.previous))
							.transition()
			.attr('d', vis.line(vis.data));

		*/
        // Add line path
        vis.chart.selectAll('.chart-line')
				.data(vis.group)
            .join('path')
				.attr('class', 'chart-line')
				.attr('stroke-width', 2)
				.attr('d', function(d){
					console.log(d)
					return d3.line()
						.x(function(d) { return vis.xScale(d.year);})
						.y(function(d) { return vis.yScale(d.value);})
						(d[1])
				})
				.attr('stroke', function(d, i) { return vis.colorScale(i); })
			
			
		/*vis.trackingArea
			.on('mouseenter', () => {
			  vis.tooltip.style('display', 'block');
			})
			.on('mouseleave', () => {
			  vis.tooltip.style('display', 'none');
			})
			.on('mousemove', function(event) {
			  // Get date that corresponds to current mouse x-coordinate
			  const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
			  const date = vis.xScale.invert(xPos);

			  // Find nearest data point
			  const index = vis.bisectDate(vis.data, year, 1);
			  const a = vis.data[index - 1];
			  const b = vis.data[index];
			  const d = b && (date - a.year > b.year - year) ? b : a; 

			  // Update tooltip
			  vis.tooltip.select('circle')
				  .attr('transform', `translate(${vis.xScale(d.year)},${vis.yScale(d.value)})`);
			  
			  vis.tooltip.select('text')
				  .attr('transform', `translate(${vis.xScale(d.year)},${(vis.yScale(d.value) - 15)})`)
				  .text(Math.round(d.value));
			});*/
		vis.prev = vis.group;
		
        // Update the axes
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }
	
}