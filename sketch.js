let regions = [];
let selectedRegion = null;
let correctAnswers = ["Region1", "Region2", "Region3", "Region4"]; // Replace with actual region names
let svgFiles = ["WHAP/path3.svg", "WHAP/path5.svg", "WHAP/path6.svg", "WHAP/path7.svg", "WHAP/path8.svg", "WHAP/path9.svg", "WHAP/path10.svg", "WHAP/path11.svg", "WHAP/path12.svg", "WHAP/path13.svg", "WHAP/path14.svg", "WHAP/path15.svg", "WHAP/path16.svg", "WHAP/path17.svg", "WHAP/path18.svg", "WHAP/path19.svg", "WHAP/path20.svg", "WHAP/path21.svg", "WHAP/path22.svg", "WHAP/path23.svg", "WHAP/path24.svg", "WHAP/path25.svg", "WHAP/path26.svg", "WHAP/path27.svg", "WHAP/path28.svg", "WHAP/path29.svg", "WHAP/path30.svg", "WHAP/path31.svg", "WHAP/path32.svg", "WHAP/path33.svg"]; // Add paths to your SVG files
let svgImages = [];

function preload() {
  // Load SVG files
  for (let file of svgFiles) {
    loadStrings(file, parseSVG);
  }
}

function parseSVG(data) {
  // Combine loaded strings into a single SVG string
  let svgString = data.join('\n');

  // Parse the SVG to extract path data
  let parser = new DOMParser();
  let svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  let paths = svgDoc.getElementsByTagName('path');

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];
    let d = path.getAttribute('d'); // Get the path data
    regions.push({
      name: `Region${(regions.length % 4) + 1}`, // Assign names dynamically
      path: d,
      state: "default"
    });
  }
}

function setup() {
  createCanvas(1123, 794);

  // Define regions with their names and corresponding SVG images
  regions.push({ name: "Region1", image: svgImages[0], state: "default" });
  regions.push({ name: "Region2", image: svgImages[1], state: "default" });
  regions.push({ name: "Region3", image: svgImages[2], state: "default" });
  regions.push({ name: "Region4", image: svgImages[3], state: "default" });
  regions.push({ name: "Region1", image: svgImages[4], state: "default" });
  regions.push({ name: "Region2", image: svgImages[5], state: "default" });
  regions.push({ name: "Region3", image: svgImages[6], state: "default" });
  regions.push({ name: "Region4", image: svgImages[7], state: "default" });
  regions.push({ name: "Region1", image: svgImages[8], state: "default" });
  regions.push({ name: "Region2", image: svgImages[9], state: "default" });
  regions.push({ name: "Region3", image: svgImages[10], state: "default" });
  regions.push({ name: "Region4", image: svgImages[11], state: "default" });
  regions.push({ name: "Region1", image: svgImages[12], state: "default" });
  regions.push({ name: "Region2", image: svgImages[13], state: "default" });
  regions.push({ name: "Region3", image: svgImages[14], state: "default" });
  regions.push({ name: "Region4", image: svgImages[15], state: "default" });
  regions.push({ name: "Region1", image: svgImages[16], state: "default" });
  regions.push({ name: "Region2", image: svgImages[17], state: "default" });
  regions.push({ name: "Region3", image: svgImages[18], state: "default" });
  regions.push({ name: "Region4", image: svgImages[19], state: "default" });
  regions.push({ name: "Region1", image: svgImages[20], state: "default" });
  regions.push({ name: "Region2", image: svgImages[21], state: "default" });
  regions.push({ name: "Region3", image: svgImages[22], state: "default" });
  regions.push({ name: "Region4", image: svgImages[23], state: "default" });
  regions.push({ name: "Region1", image: svgImages[24], state: "default" });
  regions.push({ name: "Region2", image: svgImages[25], state: "default" });
  regions.push({ name: "Region3", image: svgImages[26], state: "default" });
  regions.push({ name: "Region4", image: svgImages[27], state: "default" });
  regions.push({ name: "Region1", image: svgImages[28], state: "default" });
  regions.push({ name: "Region2", image: svgImages[29], state: "default" });
}

function draw() {
  background(220);

  // Draw the SVG images with color based on their state
  for (let region of regions) {
    // Set the color based on the state
    if (region.state === "default") {
      tint(255); // Original color
    } else if (region.state === "selected") {
      tint(255, 255, 0); // Yellow
    } else if (region.state === "correct") {
      tint(0, 255, 0); // Green
    } else if (region.state === "incorrect") {
      tint(255, 0, 0); // Red
    }

    // Draw the path for the region
    drawSVGPath(region.path);
  }
}

function drawSVGPath(pathData) {
  beginShape();
  let commands = split(pathData, ' '); // Split the path data by spaces
  let currentPos = createVector(0, 0); // Starting position for 'M'
  let controlPoint1 = createVector(0, 0); // First control point for curve
  let controlPoint2 = createVector(0, 0); // Second control point for curve

  for (let command of commands) {
    if (command.startsWith('M')) {
      // Move to command
      let coords = command.substring(1).split(',');
      currentPos.set(parseFloat(coords[0]), parseFloat(coords[1]));
      vertex(currentPos.x, currentPos.y);
    } else if (command.startsWith('L')) {
      // Line to command
      let coords = command.substring(1).split(',');
      currentPos.set(parseFloat(coords[0]), parseFloat(coords[1]));
      vertex(currentPos.x, currentPos.y);
    } else if (command.startsWith('C')) {
      // Cubic Bezier curve command
      let coords = command.substring(1).split(',');
      controlPoint1.set(parseFloat(coords[0]), parseFloat(coords[1]));
      controlPoint2.set(parseFloat(coords[2]), parseFloat(coords[3]));
      let endPoint = createVector(parseFloat(coords[4]), parseFloat(coords[5]));

      // Draw the cubic bezier curve
      vertex(controlPoint1.x, controlPoint1.y);
      vertex(controlPoint2.x, controlPoint2.y);
      vertex(endPoint.x, endPoint.y);
      // You may want to interpolate points along the curve instead of just using vertex()
      // For a better curve, consider using curveVertex() or similar techniques
    }
    // Add more commands (like Q for quadratic curves) as necessary
  }

  endShape(CLOSE);
}

function mousePressed() {
  let regionClicked = false;

  for (let region of regions) {
    if (isMouseInRegion(region)) {
      regionClicked = true;

      // If another region is selected, reset its state
      if (selectedRegion && selectedRegion !== region) {
        if (selectedRegion.state === "selected") {
          selectedRegion.state = "default"; // Reset previous selection
        }
      }

      // Set the new selected region to yellow
      selectedRegion = region;
      region.state = "selected"; // Highlight the new selected region
      document.getElementById("answer").focus();
    }
  }

  // If no region is clicked, reset the previously selected region to grey
  if (!regionClicked && selectedRegion) {
    selectedRegion.state = "default";
    selectedRegion = null;
  }
}

// Function to check if the mouse click is inside the region
function isMouseInRegion(region) {
  let x = mouseX;
  let y = mouseY;
  let inside = false;

  // Use the ray-casting algorithm to check if mouse is inside the polygon
  let commands = split(region.path, ' ');
  for (let i = 0, j = commands.length - 1; i < commands.length; j = i++) {
    let coordsA = commands[i].substring(1).split(',');
    let coordsB = commands[j].substring(1).split(',');

    let xi = parseFloat(coordsA[0]);
    let yi = parseFloat(coordsA[1]);
    let xj = parseFloat(coordsB[0]);
    let yj = parseFloat(coordsB[1]);

    let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    checkAnswer(); // Call the answer check function when Enter is pressed
  }
}

function checkAnswer() {
  let answer = document.getElementById("answer").value;
  if (selectedRegion && answer === selectedRegion.name) {
    selectedRegion.state = "correct"; // Turn green if correct
    document.getElementById("feedback").innerText = "Correct!";
  } else if (selectedRegion) {
    selectedRegion.state = "incorrect"; // Turn red if incorrect
    document.getElementById("feedback").innerText = "Try again.";
  }
  document.getElementById("answer").value = ""; // Clear input
}
