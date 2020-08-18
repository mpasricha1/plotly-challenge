// Initialized the page with the ID of the first value in the data source
// This also sets up the drop down menu for the page 
// 4 functions are called, one for each plot
function init(){ 
	var dropDownMenu = d3.select("#selDataset"); 

	d3.json("samples.json").then(data => {
		console.log(data.names);

		data.names.forEach(function(name){
			dropDownMenu.append("option").text(name).property("value");
		})
	generateDemoData(data.names[0]); 
	generateBarPlot(data.names[0]);
	generateBubblePlot(data.names[0]);
	generateGauge(data.names[0]);
	});
}

// This function handles what happens when a drop down item is selected
//Function takes one argument id from the dropdown
function optionChanged(id){
	generateBarPlot(id);
	generateBubblePlot(id);
	generateDemoData(id);
	generateGauge(id);
}; 

//Function takes one argument the id from the dropdown
//Grabs the metadata from the dataset and filter by the id 
//Loops through the filtered values and appends the key/value pair to the demo box
function generateDemoData(id){
	var demoBox = d3.select("#sample-metadata")

	d3.json("samples.json").then(data => {
		var metaData = data.metadata; 

		var demoInfo = metaData.filter(meta => meta.id.toString() === id)[0]; 
		demoBox.html("")
		Object.entries(demoInfo).forEach(function([key,value]){
			demoBox.append("h5").text(`${key} : ${value}`);
		});
	});
};

//Function takes one argument id from the dropdown
//Grabs the sample data from the dataset and takes only the top 10 results filters by the id 
//Data is then use to create the bar chart
function generateBarPlot(id){

	d3.json("samples.json").then(data => { 
		var sampleInfo = data.samples; 

		var filteredData = sampleInfo.filter(sample => sample.id === id)[0]; 
		var samples = filteredData.sample_values.slice(0,10);
		var otus = filteredData.otu_ids.slice(0,10);
		var otusIDs = otus.map(d => "OTU " + d);
		var labels = filteredData.otu_labels.slice(0,10);

		var data = [{
			x: samples,
			y: otusIDs,
			text: labels,
			type: "bar",
			orientation: "h"
		}]; 

		var layout = {
			title: `OTU's For Sample ${id}`,
		};
		
		Plotly.newPlot("bar", data, layout);

	});
}; 

//Function takes one argument id from the dropdown
//Grabs the sameple data and filters by the id
//Filtered data is then used to crate the bubble plot
function generateBubblePlot(id){ 
	d3.json("samples.json").then(data => {
		var sampleInfo = data.samples; 

		var filteredData = sampleInfo.filter(sample => sample.id === id)[0];

		var samples = filteredData.sample_values; 
		var otus = filteredData.otu_ids; 
		var labels = filteredData.otu_labels; 

		var data = [{
			x: otus, 
			y: samples,
			text: labels,
			mode: "markers", 
			marker: {
				size: samples, 
				color: otus,
			} 	
		}]; 

		Plotly.newPlot("bubble",data)
	});
};

//Function takes one argument id from the dropdown
//Grabs the metadata and filters by the id
//Filtered data is then used to create the Gauge 
function generateGauge(id){
	d3.json("samples.json").then(data => {
		var sampleInfo = data.metadata; 

		var filteredData = sampleInfo.filter(sample => sample.id.toString() === id)[0]; 

		var wfreq = filteredData.wfreq;

		var data = [{
			type: "indicator",
			title: { text: "Belly Button Washing Frequency" },
			value: wfreq,
			mode: "gauge+number",
			text: ["0-1", "1-2","2-3", "3-4", "4-5","5-6","6-7", "7-8", "8-9"],
			gauge: {
				axis: {range: [0,9], tickwidth: 1},
				steps: [
					{ range: [0,1], color:"#ffffff"}, 
					{ range: [1,2], color:"#f0f5f5"},
					{ range: [2,3], color:"#e0ebeb"},
					{ range: [3,4], color:"#d1e0e0"},
					{ range: [4,5], color:"#c2d6d6"},
					{ range: [5,6], color:"#b3cccc"},
					{ range: [6,7], color:"#a3c2c2"},
					{ range: [7,8], color:"#94b8b8"},
					{ range: [8,9], color:"#85adad"}
				]
			}
		}]

		var layout =[{
			height: 400, 
			width: 400
		}]

		Plotly.newPlot("gauge",data, layout)
	})
}

//Calls init when the page loads
init();