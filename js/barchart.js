class BarChart {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
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
        this.initVis();
  }
  
  /**
   * Initialize scales/axes and append static chart elements
   */
  initVis() {
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleBand()
        .range([0, vis.width])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]);
    
    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale);
    vis.yAxis = d3.axisLeft(vis.yScale).ticks(6);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');
		
  }
  
  updateVis() {
	let vis = this;
	
	vis.chart.selectAll('rect')
            .data([])
            .exit().remove();
	
	vis.xScale.domain(d3.map(vis.data, d => d.type));
	vis.yScale.domain([0,d3.max(vis.data, d => d.value)]);
	
	vis.renderVis();
  
  }
  
  renderVis() {
	let vis = this;
	
	console.log(vis.data);
	
	vis.chart//.selectAll('.bar')
      /*  .data(vis.data)
	  .join('g')*/
	  .selectAll('bar')
		.data(vis.data)
      .join('rect')
		.attr('class', 'bar')
        .attr('x', d => vis.xScale(d.type))
        .attr('y', vis.height)
		.attr('width', vis.xScale.bandwidth())
		.attr('fill', 'red')
		.transition()
		.duration(1000)
		.attr('height', d => vis.height - vis.yScale(d.value))
		.attr('y', d => vis.yScale(d.value));
		
		
	
	
	vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}
  
  
  
  