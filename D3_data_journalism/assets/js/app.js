// D3 Animated Scatter Plot

//Section 1: Pre-Data setup
//Before coding need to setup width and height for margins of graph.
// add room for labels and text as well for text padding

//Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

//Designate the height of the graph
var height = width - width / 3.9;

//Margin for spacing the graph
var margin = 20;

// Space for placing words
var labelArea = 110;


// padding for text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

// Create actual canvas for the graph
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

// Set the radius for each dot that will appear in graph
//Note: Making this a function allows us to easily call
// it is in the mobility section of code.
var cirRadius;
function crGet() {
    if(width <= 530) {
        circRadius = 5;
    }
    else {
        circRadius = 10;
    }
}
crGet();

// The labels for axes
//====================

// created a group of elements to nest at bottom of axes labels.
svg.append("g").attr("class", "xText");
// xText will allow to seelect the group without excess code.
var xText = d3.select(".xText");

//Give xText a transform property that places it at the bottom of chart
//By nesting this attribute in a function, easily chante the loc
//whenever the width of window changes
function xTextRefresh() {
    xText.attr(
        "transfrom",
        "translate(" +
        ((width - labelArea) / 2 + labelArea) +
        ", " +
        (height - margin - tPadBot) +
        ")"
    );
}
xTextRefresh();

// Use xText to append three text SVG files, with y coord specifies
// 1. Poverty
xText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("In Poverty(%)");

// 2. Age
xText
    .append("text")
    .attr("y", 0)
    .attr("data-name", "age")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Age (Median)");

    // 3. Income
xText   
    .append("text")
    .attr("y", 26)
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Household Income (Median)");

// B) Left Axis
//=============

// Specifying the variables likje this allows to make transform attributes
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// Adding a second lable group this time ofr the axis left of chart
svg.append("g").attr("class", "yText");

// yText will allow to select the group without excess code.
var yText = d3.select(".yText");

// Similiar as before, nesting the groups transform attr in a function
// make changing it on window change an easy operation
function yTextRefresh() {
    yText.attr(
        "transform",
        "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
    );
}
yTextRefresh();

// Append to text
// 1. Obesity
yText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "obesity")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Obese (%)");

// 2. Smokes
yText
    .append("text")
    .attr("x", 0)
    .attr("data-name", "smokes")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Smokes (%)");

// 3. Lacks Healthcare
yText
    .append("text")
    .attr("y", 26)
    .attr("data-name", "healthcare")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Lacks Healthcare (%)");

// 2. Import csv file
//====================
//This data includes state by state demos data from us census
// and measuresments from health risks obtained.
// by the beahvorial risks factor survelliance system.

//Import csv data with d3's .csv improt method.
d3.csv("assets/data/data.csv").then(function(data) {
    //visualize the data
    visualize(data);
});

// 3. Create our visualization function
//======================================
// We called a visualize funciton on the data obtained with d3's.csv method
//This function handles the visual manipulation of all elements dependent on the
function visualize(theData) {
    //Part 1
    //==============================
    //curX and curY will determine what data gets represetned in each axis
    //as the headings in their matching .csv data file.
    var curX = "poverty";
    var curY = "obesity";

    //we also save empty variables for our min and max values of xy
    //this will allo w to alter the values in functionans and remove reps
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    //this function allows us to eset up a tooltipe rules (see d3-tip.js).
    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([40, -60])
        .html(function(d) {
            // xkey
            var theX;
            //Grab the state name.
            var theState = "<div>" + d.state + "</div>";
            // Snatch the y values key and value.
            var theY = "<div>" + curY + ": " + d[curX] + "%</div>";
            // If the x key is poverty
            if (curX === "poverty") {
                // Grab the x key and a verison of the value fomratted to show %
                theX = "<div>" + curX + ": " + d[curX] + "%</div>";
            }
            else {
                //Otherwise grab the x ky and a vversion of the value formatted
                theX = "<div>" + 
                curX +
                ": " +
                parseFloat(d[curX]).toLocaleString("en") +
                "</div>";
            }
            // Display what we capture
            return theState + theX + theY;
        });
    // Call the toolTip function
    svg.call(toolTip);

    // PART 2: D.R.Y!
    //===============
    //These functions remove some repitition from later code.
    //This will be more obvious in parts 3 and 4

    // a. change the min and max for x
    function xMinMax() {
        //min will grab the smallest datum from the selected column. 
        xMin = d3.min(theData, function(d) {
            return parseFloat(d[curX]) * 0.90;
        });

        //.max will grab the largest datum from the selected column.
        xMax = d3.ma(theData, function(d) {
            return parseFloat(d[curX]) * 1.10;
        });
    }

    
    
    //b. change the min and max for y
    function yMinMax() {
        //min will grab the smallest datum form the selected column.
        yMin = d3.min(theData, function(d) {
            return parseFloat(d[curY]) * 0.90;
        });

        //.max will grab the largest datum form the selected column.
        yMax = d3.max(theData, function(d) {
            return parseFloat(d[curY]) * 1.10;
        }); 
    }

    // c. change the classes and appearance fo the label text when clicked.
    function labelChange(axis, clickedText) {
        // Switch the currently active to inactive.
        d3
            .selectAll(".aText")
            .filter("." + axis)
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);

        // Switch the text just clicked to active.
        clickedText.classed("inactive", false).classed("active", true);
    }

    // Part 3: Instantaiate teh scatter plot
    //======================================
    //This will add the first placement o four data and axes to the plot

    //First grab the min and max values of xy
    xMinMax();
    yMinMax();

    // With the min and max values now difined, create the scales
    // Observe the range method and how to include the margin and word area.
    //This teslls d3 to place our circles in an area starting after the margin
    var xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([margin + labelArea, width - margin]);
    var yScale = d3
        .scaleLinear()
        .domain([uMin, yMax])
        //Height is inversed due to how d3 calcs yaxis placement
        .range([height - margin - labelArea, margin]);

    //Pass the scales inot the ais methods to create the axes.
    // Note: d3 4.0 made this a lot less cumbersome than before. 
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Determine xy tick counts
    //Note : Save as a function for easy mobile updates.
    function tickCount() {
        if (width <= 500) {
            xAxis.ticks(5);
            yAxis.ticks(5);
        }
        else {
            xAxis.ticks(10);
            yAxis.ticks(10);
        }
    }
    tickCount();





}















