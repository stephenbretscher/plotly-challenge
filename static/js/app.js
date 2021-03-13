//Build demographics panel
function demographicInfo(sample) {
    //d3.json to read in sample data
    d3.json("samples.json").then((data) => {

        //call metadata from data file, 
      var demographics= data.metadata;
        //create filtered array from sample chosen 
      var resultsarray= demographics.filter(sampleobject => sampleobject.id == sample);
        //grab first result
      var result= resultsarray[0]

      //id = "sample-metadata" for selecting panel 
      var demographicPanel = d3.select("#sample-metadata");
      //reset panel before filling it
      demographicPanel.html("");

        //foreach loop to display each metadata value on panel
      Object.entries(result).forEach(([key, value]) => {
        demographicPanel.append("h4").text(`${key}: ${value}`);
      });
    });
}

//------------------------------------------------------------------


function plots(sample) {

  // Grab sample data to build first bubble chart then bar chart
  d3.json("samples.json").then((data) => {
    //grab from data.samples, pass to array and get first entry
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
    var result= resultsarray[0]

    //grab labels and values for graphs from result
    var ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;


    //----------------Bubble Chart-----------------------------------------
    var Data_Bubble = [
      {
        x: ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          color: ids,
          size: sample_values,
          }
      }
    ];

    var Layout_Bubble = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
    };

    Plotly.plot("bubble", Data_Bubble, Layout_Bubble);
    //----------------------------------------------------------------------
    //----------------Bar Chart---------------------------------------------
    var bar_data =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:sample_values.slice(0,10).reverse(),
        text:otu_labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"

      }
    ];

    var bar_Layout = {
      //fitting bar chart into div
      margin: { t: 20, l: 100 }
    };

    Plotly.newPlot("bar", bar_data, bar_Layout);
  });
}
//-------------------------------------------------------------------------
//
function init() {
  //#selDataset: html idea needed to select dropdown 
  var selector = d3.select("#selDataset");

  // creating list for dropdown of sample otu_ids
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Take zeroth item from listto populate site on first open
    const firstSample = sampleNames[0];
    plots(firstSample);
    demographicInfo(firstSample);
  });
}

//------------------------------------------------------------

// Grab new data and rerun functions each time a new sample is selected from dropdown
function optionChanged(newSample) {
  plots(newSample);
  demographicInfo(newSample);
}

//run init function
init();

