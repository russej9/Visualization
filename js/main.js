

let data, lineChart, barChartH, barChartP, lineChartDay, lineChart2, barChartH2, barChartP2, lineChartDay2;
let pol = 0;

d3.csv('data/data.csv')
  .then(_data => {
    _data.forEach(d => {
      d.Year = +d.Year;
	  d.Days_with_AQI = +d.Days_with_AQI;
      d.Good_Days = +d.Good_Days;
	  d.Moderate_Days = +d.Moderate_Days;
	  d.Unhealthy_for_Sensitive_Groups_Days = +d.Unhealthy_for_Sensitive_Groups_Days;
	  d.Unhealthy_Days = +d.Unhealthy_Days;
	  d.Very_Unhealthy_Days = +d.Very_Unhealthy_Days;
	  d.Hazardous_Days = +d.Hazardous_Days;
	  d.Max_AQI = +d.Max_AQI;
	  d.nth_Percentile_AQI = +d.nth_Percentile_AQI;
	  d.median_AQI = +d.median_AQI;
	  d.Days_CO = +d.Days_CO;
	  d.Days_NO2 = +d.Days_NO2;
	  d.Days_Ozone = +d.Days_Ozone;
	  d.Days_SO2 = +d.Days_SO2;
	  d.Days_PM25 = +d.Days_PM25;
	  d.Days_PM10 = +d.Days_PM10;
    });
	
	
    data = _data;
	let slisttemp = [];
	let states = [];
	data.forEach(function(d)
	{
		slisttemp.push(d.State);
	})
	
	slisttemp.forEach(d => {
		if(!states.includes(d)){ states.push(d); }
	});

	s1 = document.createElement("select");
	s1.name = "States";
	s1.id = "s1";
	for (const s of states)
	{
		var option = document.createElement("option");
		option.value = s;
		option.text = s;
		s1.appendChild(option);
	}
	var labels1 = document.createElement("label");
	labels1.innerHTML = "Select State: ";
	labels1.htmlFor = "s1";
	document.getElementById("container").appendChild(labels1).appendChild(s1);
	
	var county = document.getElementById("c1");
	if(typeof(county) != 'undefined' && county != null)
	{
		county.parentElement.removeChild(county);
	}
	county = document.createElement("select");
	county.name = "County";
	county.id = "c1";
	let countyList = [];
	let tempData = data.filter(function(d) {return d.State == s1.value});
	tempData.forEach(d => {
	if(!countyList.includes(d.County)){ countyList.push(d.County); }
	});
	console.log(countyList);
	for (const s of countyList)
	{
		var option = document.createElement("option");
		option.value = s;
		option.text = s;
		county.appendChild(option);
	}
	var labelc1 = document.createElement("label");
	labelc1.innerHTML = "Select County: ";
	labelc1.htmlFor = "c1";
	labelc1.id = 'labelc1';
	document.getElementById("container").appendChild(labelc1).appendChild(county);
	
	document.getElementById("s1").onchange = function(d) {
		var county = document.getElementById("c1");
		county.innerHTML = '';
		let countyList = [];
		let tempData = data.filter(function(d) {return d.State == s1.value});
			tempData.forEach(d => {
			if(!countyList.includes(d.County)){ countyList.push(d.County); }
		});
		console.log(countyList);
		for (const s of countyList)
		{
			var option = document.createElement("option");
			option.value = s;
			option.text = s;
			county.appendChild(option);
		}
		var labelc1 = document.createElement("label");
		document.getElementById("labelc1").appendChild(county);
		if (pol) {filterDataPol1();}
		else {filterDataAQI1();}
		filterDaysMissing1();
		filterDataBar1();
	}
	
	
    // Initialize and render chart
    lineChart = new LineChart({ parentElement: '#chart'}, data, 1);
	lineChartDay = new LineChart({ parentElement: '#chartDay'}, data), 0;
	let datas = [];
	  data.filter(function(d) {
		if(d.County == document.getElementById('c1').value && d.State == document.getElementById('s1').value)
		{
			datas.push({'year': d.Year, 'value': d.median_AQI, 'type': 'median'});
			datas.push({'year': d.Year, 'value': d.nth_Percentile_AQI, 'type': 'nth'});
			datas.push({'year': d.Year, 'value': d.Max_AQI, 'type': 'max'});
		}});
		lineChart.data = datas;
		lineChart.updateVisAQI();
		filterDaysMissing1();
	
	barChartH = new BarChart({ parentElement: '#barchartH'}, data);
	barChartP = new BarChart({ parentElement: '#barchartP'}, data);
	
	datas = [];
	    data.filter(function(d) {
			if(d.County == document.getElementById('c1').value && d.State == document.getElementById('s1').value && d.Year == document.getElementById('year-input').value)
			{
				datas.push({'value': d.Days_CO, 'type': 'CO'});
				datas.push({'value': d.Days_NO2, 'type': 'NO2'});
				datas.push({'value': d.Days_Ozone, 'type': 'Ozone'});
				datas.push({'value': d.Days_PM25, 'type': 'PM 2.5'});
				datas.push({'value': d.Days_SO2, 'type': 'SO2'});
				datas.push({'value': d.Days_PM10, 'type': 'PM 10'});
			}});
		barChartP.data = datas;
		barChartP.updateVis();
		
		datas = [];
		data.filter(function(d) {
			if(d.County == document.getElementById('c1').value && d.State == document.getElementById('s1').value && d.Year == document.getElementById('year-input').value)
			{
				datas.push({'value': d.Good_Days, 'type': 'Good'});
				datas.push({'value': d.Moderate_Days, 'type': 'Moderate'});
				datas.push({'value': d.Unhealthy_for_Sensitive_Groups_Days, 'type': 'Unhealthy for Sensitive'});
				datas.push({'value': d.Unhealthy_Days, 'type': 'Unhealthy'});
				datas.push({'value': d.Very_Unhealthy_Days, 'type': 'Very Unhealthy'});
				datas.push({'value': d.Hazardous_Days, 'type': 'Hazardous'});
			}});
		barChartH.data = datas;
		barChartH.updateVis();
	
	//update on county change
	document.getElementById("c1").onchange = function(d) {
		if (pol) {filterDataPol1();}
		else {filterDataAQI1();}
		filterDaysMissing1();
		filterDataBar1();
	}
	document.getElementById('year-input').onchange = function(d) {
		filterDataBar();
	}
	
	//Code for the second county
	let s2 = document.createElement("select");
	s2.name = "States";
	s2.id = "s2";
	for (const s of states)
	{
		var option = document.createElement("option");
		option.value = s;
		option.text = s;
		s2.appendChild(option);
	}
	var labels2 = document.createElement("label");
	labels2.innerHTML = "Select State: ";
	labels2.htmlFor = "s2";
	document.getElementById("container").appendChild(labels2).appendChild(s2);
	
	var county = document.getElementById("c2");
	if(typeof(county) != 'undefined' && county != null)
	{
		county.parentElement.removeChild(county);
	}
	county = document.createElement("select");
	county.name = "County";
	county.id = "c2";
	countyList = [];
	tempData = data.filter(function(d) {return d.State == s2.value});
	tempData.forEach(d => {
	if(!countyList.includes(d.County)){ countyList.push(d.County); }
	});
	console.log(countyList);
	for (const s of countyList)
	{
		var option = document.createElement("option");
		option.value = s;
		option.text = s;
		county.appendChild(option);
	}
	var labelc2 = document.createElement("label");
	labelc2.innerHTML = "Select County: ";
	labelc2.htmlFor = "c2";
	labelc2.id = 'labelc2';
	document.getElementById("container").appendChild(labelc2).appendChild(county);
	
	document.getElementById("s2").onchange = function(d) {
		var county = document.getElementById("c2");
		county.innerHTML = '';
		let countyList = [];
		let tempData = data.filter(function(d) {return d.State == s2.value});
			tempData.forEach(d => {
			if(!countyList.includes(d.County)){ countyList.push(d.County); }
		});
		console.log(countyList);
		for (const s of countyList)
		{
			var option = document.createElement("option");
			option.value = s;
			option.text = s;
			county.appendChild(option);
		}
		var labelc2 = document.createElement("label");
		document.getElementById("labelc2").appendChild(county);
		if (pol) {filterDataPol2();}
		else {filterDataAQI2();}
		filterDaysMissing2();
		filterDataBar2();
	}
	
	
    // Initialize and render chart
    lineChart2 = new LineChart({ parentElement: '#chart2'}, data, 1);
	lineChartDay2 = new LineChart({ parentElement: '#chartDay2'}, data), 0;
	datas = [];
	  data.filter(function(d) {
		if(d.County == document.getElementById('c2').value && d.State == document.getElementById('s2').value)
		{
			datas.push({'year': d.Year, 'value': d.median_AQI, 'type': 'median'});
			datas.push({'year': d.Year, 'value': d.nth_Percentile_AQI, 'type': 'nth'});
			datas.push({'year': d.Year, 'value': d.Max_AQI, 'type': 'max'});
		}});
		lineChart2.data = datas;
		lineChart2.updateVisAQI();
		filterDaysMissing2();
	barChartH2 = new BarChart({ parentElement: '#barchartH2'}, data);
	barChartP2 = new BarChart({ parentElement: '#barchartP2'}, data);
	
	datas = [];
	    data.filter(function(d) {
			if(d.County == document.getElementById('c2').value && d.State == document.getElementById('s2').value && d.Year == document.getElementById('year-input').value)
			{
				datas.push({'value': d.Days_CO, 'type': 'CO'});
				datas.push({'value': d.Days_NO2, 'type': 'NO2'});
				datas.push({'value': d.Days_Ozone, 'type': 'Ozone'});
				datas.push({'value': d.Days_PM25, 'type': 'PM 2.5'});
				datas.push({'value': d.Days_SO2, 'type': 'SO2'});
				datas.push({'value': d.Days_PM10, 'type': 'PM 10'});
			}});
		barChartP2.data = datas;
		barChartP2.updateVis();
		
		datas = [];
		data.filter(function(d) {
			if(d.County == document.getElementById('c2').value && d.State == document.getElementById('s2').value && d.Year == document.getElementById('year-input').value)
			{
				datas.push({'value': d.Good_Days, 'type': 'Good'});
				datas.push({'value': d.Moderate_Days, 'type': 'Moderate'});
				datas.push({'value': d.Unhealthy_for_Sensitive_Groups_Days, 'type': 'Unhealthy for Sensitive'});
				datas.push({'value': d.Unhealthy_Days, 'type': 'Unhealthy'});
				datas.push({'value': d.Very_Unhealthy_Days, 'type': 'Very Unhealthy'});
				datas.push({'value': d.Hazardous_Days, 'type': 'Hazardous'});
			}});
		barChartH2.data = datas;
		barChartH2.updateVis();
	
	//update on county change
	document.getElementById("c2").onchange = function(d) {
		if (pol) {filterDataPol2();}
		else {filterDataAQI2();}
		filterDaysMissing2();
		filterDataBar();
	}
	document.getElementById('year-input').onchange = function(d) {
		filterDataBar();
	}
	
  })
  .catch(error => console.error(error));
  
  function filterDataAQI()
  {
	  filterDataAQI1();
	  filterDataAQI2();
  }
  
  function filterDataPol()
  {
	  filterDataPol1();
	  filterDataPol2();
  }
  
  function filterDataAQI1() {
	  pol = 0;
	  lineChart.prev = lineChart.data;
	  let datas = [];
	  data.filter(function(d) {
		if(d.County == document.getElementById('c1').value && d.State == document.getElementById('s1').value)
		{
			datas.push({'year': d.Year, 'value': d.median_AQI, 'type': 'median'});
			datas.push({'year': d.Year, 'value': d.nth_Percentile_AQI, 'type': 'nth'});
			datas.push({'year': d.Year, 'value': d.Max_AQI, 'type': 'max'});
		}});
		lineChart.data = datas;
		lineChart.updateVisAQI();
	  
  }
  
  function filterDataAQI2() {
	  pol = 0;
	  lineChart.prev = lineChart.data;
	  let datas = [];
	  data.filter(function(d) {
		if(d.County == document.getElementById('c2').value && d.State == document.getElementById('s2').value)
		{
			datas.push({'year': d.Year, 'value': d.median_AQI, 'type': 'median'});
			datas.push({'year': d.Year, 'value': d.nth_Percentile_AQI, 'type': 'nth'});
			datas.push({'year': d.Year, 'value': d.Max_AQI, 'type': 'max'});
		}});
		lineChart2.data = datas;
		lineChart2.updateVisAQI();
  }
  
  
  function filterDataPol1() {
	  pol = 1;
	  lineChart.prev = lineChart.data;
	  let datas = [];
	  data.filter(function(d) {
		if(d.County == document.getElementById('c1').value && d.State == document.getElementById('s1').value)
		{
			datas.push({'year': d.Year, 'value': d.Days_CO, 'type': 'CO'});
			datas.push({'year': d.Year, 'value': d.Days_NO2, 'type': 'NO2'});
			datas.push({'year': d.Year, 'value': d.Days_Ozone, 'type': 'Ozone'});
			datas.push({'year': d.Year, 'value': d.Days_PM25, 'type': 'PM 2.5'});
			datas.push({'year': d.Year, 'value': d.Days_SO2, 'type': 'SO2'});
			datas.push({'year': d.Year, 'value': d.Days_PM10, 'type': 'PM 10'});
		}});
		console.log(datas);
		lineChart.data = datas;
		lineChart.updateVisAQI();
  }
  
  function filterDataPol2() {
	  pol = 1;
	  lineChart.prev = lineChart.data;
	  let datas = [];
	  data.filter(function(d) {
		if(d.County == document.getElementById('c2').value && d.State == document.getElementById('s2').value)
		{
			datas.push({'year': d.Year, 'value': d.Days_CO, 'type': 'CO'});
			datas.push({'year': d.Year, 'value': d.Days_NO2, 'type': 'NO2'});
			datas.push({'year': d.Year, 'value': d.Days_Ozone, 'type': 'Ozone'});
			datas.push({'year': d.Year, 'value': d.Days_PM25, 'type': 'PM 2.5'});
			datas.push({'year': d.Year, 'value': d.Days_SO2, 'type': 'SO2'});
			datas.push({'year': d.Year, 'value': d.Days_PM10, 'type': 'PM 10'});
		}});
		console.log(datas);
		lineChart2.data = datas;
		lineChart2.updateVisAQI();
  }
  
  function filterDataBar() {
	  filterDataBar1();
	  filterDataBar2();
  }
  
  function filterDataBar1() {
        barChartH.prev = barChartH.data;
		barChartP.prev = barChartP.data;
	    let datas = [];
	    data.filter(function(d) {
			if(d.County == document.getElementById('c1').value && d.State == document.getElementById('s1').value && d.Year == document.getElementById('year-input').value)
			{
				console.log('here');
				datas.push({'value': d.Days_CO, 'type': 'CO'});
				datas.push({'value': d.Days_NO2, 'type': 'NO2'});
				datas.push({'value': d.Days_Ozone, 'type': 'Ozone'});
				datas.push({'value': d.Days_PM25, 'type': 'PM 2.5'});
				datas.push({'value': d.Days_SO2, 'type': 'SO2'});
				datas.push({'value': d.Days_PM10, 'type': 'PM 10'});
			}});
		barChartP.data = datas;
		barChartP.updateVis();
		
		datas = [];
		data.filter(function(d) {
			if(d.County == document.getElementById('c1').value && d.State == document.getElementById('s1').value && d.Year == document.getElementById('year-input').value)
			{
				datas.push({'value': d.Good_Days, 'type': 'Good'});
				datas.push({'value': d.Moderate_Days, 'type': 'Moderate'});
				datas.push({'value': d.Unhealthy_for_Sensitive_Groups_Days, 'type': 'Unhealthy for Sensitive'});
				datas.push({'value': d.Unhealthy_Days, 'type': 'Unhealthy'});
				datas.push({'value': d.Very_Unhealthy_Days, 'type': 'Very Unhealthy'});
				datas.push({'value': d.Hazardous_Days, 'type': 'Hazardous'});
			}});
		barChartH.data = datas;
		barChartH.updateVis();
		
  }
  
  function filterDataBar2() {
        barChartH.prev = barChartH.data;
		barChartP.prev = barChartP.data;
	    let datas = [];
	    data.filter(function(d) {
			if(d.County == document.getElementById('c2').value && d.State == document.getElementById('s2').value && d.Year == document.getElementById('year-input').value)
			{
				datas.push({'value': d.Days_CO, 'type': 'CO'});
				datas.push({'value': d.Days_NO2, 'type': 'NO2'});
				datas.push({'value': d.Days_Ozone, 'type': 'Ozone'});
				datas.push({'value': d.Days_PM25, 'type': 'PM 2.5'});
				datas.push({'value': d.Days_SO2, 'type': 'SO2'});
				datas.push({'value': d.Days_PM10, 'type': 'PM 10'});
			}});
		barChartP2.data = datas;
		barChartP2.updateVis();
		
		datas = [];
		data.filter(function(d) {
			if(d.County == document.getElementById('c2').value && d.State == document.getElementById('s2').value && d.Year == document.getElementById('year-input').value)
			{
				datas.push({'value': d.Good_Days, 'type': 'Good'});
				datas.push({'value': d.Moderate_Days, 'type': 'Moderate'});
				datas.push({'value': d.Unhealthy_for_Sensitive_Groups_Days, 'type': 'Unhealthy for Sensitive'});
				datas.push({'value': d.Unhealthy_Days, 'type': 'Unhealthy'});
				datas.push({'value': d.Very_Unhealthy_Days, 'type': 'Very Unhealthy'});
				datas.push({'value': d.Hazardous_Days, 'type': 'Hazardous'});
			}});
		barChartH2.data = datas;
		barChartH2.updateVis();
		
  }
  
  function filterDaysMissing1() {
	  let datas = [];
	  data.filter(function(d) {
		if(d.County == document.getElementById('c1').value && d.State == document.getElementById('s1').value)
		{
			datas.push({'year': d.Year, 'value': 365 - d.Days_with_AQI, 'type': 'Day'});
		}});
		console.log(datas);
		lineChartDay.data = datas;
		lineChartDay.updateVisAQI();
  }
  
  function filterDaysMissing2() {
	  let datas = [];
	  data.filter(function(d) {
		if(d.County == document.getElementById('c2').value && d.State == document.getElementById('s2').value)
		{
			datas.push({'year': d.Year, 'value': 365 - d.Days_with_AQI, 'type': 'Day'});
		}});
		console.log(datas);
		lineChartDay2.data = datas;
		lineChartDay2.updateVisAQI();
  }
  
	function sequence() {
		
		
		//FOR LOOPS DONT WORK AAAAAAAAAHHHHHHHHHHHHH
		//NEITHER DO WHILE LOOPS WHYYYYYYYYYYYYYYYYYYYYYY
		
		  setTimeout(() => document.getElementById('year-input').value = 1980, 1 * 1500);
		  setTimeout(() => filterDataBar(), 1 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1981, 2 * 1500);
		  setTimeout(() => filterDataBar(), 2 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1982, 3 * 1500);
		  setTimeout(() => filterDataBar(), 3 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1983, 4 * 1500);
		  setTimeout(() => filterDataBar(), 4 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1984, 5 * 1500);
		  setTimeout(() => filterDataBar(), 5 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1985, 6 * 1500);
		  setTimeout(() => filterDataBar(), 6 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1986, 7 * 1500);
		  setTimeout(() => filterDataBar(), 7 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1987, 8 * 1500);
		  setTimeout(() => filterDataBar(), 8 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1988, 9 * 1500);
		  setTimeout(() => filterDataBar(), 9 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1989, 10 * 1500);
		  setTimeout(() => filterDataBar(), 10 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1990, 11 * 1500);
		  setTimeout(() => filterDataBar(), 11 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1991, 12 * 1500);
		  setTimeout(() => filterDataBar(), 12 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1992, 13 * 1500);
		  setTimeout(() => filterDataBar(), 13 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1993, 14 * 1500);
		  setTimeout(() => filterDataBar(), 14 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1994, 15 * 1500);
		  setTimeout(() => filterDataBar(), 15 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1995, 16 * 1500);
		  setTimeout(() => filterDataBar(), 16 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1996, 17 * 1500);
		  setTimeout(() => filterDataBar(), 17 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1997, 18 * 1500);
		  setTimeout(() => filterDataBar(), 18 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1998, 19 * 1500);
		  setTimeout(() => filterDataBar(), 19 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 1999, 20 * 1500);
		  setTimeout(() => filterDataBar(), 20 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2000, 21 * 1500);
		  setTimeout(() => filterDataBar(), 21 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2001, 22 * 1500);
		  setTimeout(() => filterDataBar(), 22 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2002, 23 * 1500);
		  setTimeout(() => filterDataBar(), 23 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2003, 24 * 1500);
		  setTimeout(() => filterDataBar(), 24 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2004, 25 * 1500);
		  setTimeout(() => filterDataBar(), 25 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2005, 26 * 1500);
		  setTimeout(() => filterDataBar(), 26 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2006, 27 * 1500);
		  setTimeout(() => filterDataBar(), 27 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2007, 28 * 1500);
		  setTimeout(() => filterDataBar(), 28 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2008, 29 * 1500);
		  setTimeout(() => filterDataBar(), 29 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2009, 30 * 1500);
		  setTimeout(() => filterDataBar(), 30 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2010, 31 * 1500);
		  setTimeout(() => filterDataBar(), 31 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2011, 32 * 1500);
		  setTimeout(() => filterDataBar(), 32 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2012, 33 * 1500);
		  setTimeout(() => filterDataBar(), 33 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2013, 34 * 1500);
		  setTimeout(() => filterDataBar(), 34 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2014, 35 * 1500);
		  setTimeout(() => filterDataBar(), 35 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2015, 36 * 1500);
		  setTimeout(() => filterDataBar(), 36 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2016, 37 * 1500);
		  setTimeout(() => filterDataBar(), 37 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2017, 38 * 1500);
		  setTimeout(() => filterDataBar(), 38 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2018, 39 * 1500);
		  setTimeout(() => filterDataBar(), 39 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2019, 40 * 1500);
		  setTimeout(() => filterDataBar(), 40 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2020, 41 * 1500);
		  setTimeout(() => filterDataBar(), 41 * 1500);
		  setTimeout(() => document.getElementById('year-input').value = 2021, 42 * 1500);
		  setTimeout(() => filterDataBar(), 42 * 1500);
	}
	