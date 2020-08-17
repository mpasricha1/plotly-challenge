function init(){ 
	var dropDownMenu = d3.select("#selDataset"); 

	d3.json("samples.json").then(data => {
		console.log(data.names);

		data.names.forEach(function(name){
			dropDownMenu.append("option").text(name).property("value");
		})
	console.log(data.names[0]);
	generateDemoData(data.names[0]); 
	generateBarPlot(data.names[0])
	});


}

function optionChanged(id){
	generateBarPlot(id);
	generateDemoData(id);
}; 

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

function generateBarPlot(id){

	d3.json("samples.json").then(data => { 
		var sampleInfo = data.samples; 

		var filteredData = sampleInfo.filter(sample => sample.id === id)[0]; 
		var samples = filteredData.sample_values.slice(0,10)
		console.log(samples)
		var otus = filteredData.otu_ids.slice(0,10)
		var labels = filteredData.otu_labels.slice(0,10)

		var data = [{
			x: samples,
			y: otus,
			text: labels,
			type: "bar",
			orientation: "h"
		}]; 

		var layout = { 
			yaxis: {
        		autorange: true,
        		type: "linear"
      		}
		};
		
		Plotly.newPlot("bar", data, layout);

	})
}

init();