let regions = [];
let selectedRegion = null;
let correctAnswers = ["Region1", "Region2", "Region3", "Region4"]; // Replace with actual region names
let svgFiles = ["WHAP/path3", "WHAP/path5", "WHAP/path6", "WHAP/path7"]; // Add paths to your SVG files
let svgImages = [];

function preload() {
  // Load SVG files
  for (let file of svgFiles) {
    svgImages.push(loadImage(file));
  }
}

function setup() {
  createCanvas(800, 600);

  // Define regions with their names and corresponding SVG images
  regions.push({ name: "Region1", image: svgImages[0], state: "default" });
  regions.push({ name: "Region2", image: svgImages[1], state: "default" });
  regions.push({ name: "Region3", image: svgImages[2], state: "default" });
  regions.push({ name: "Region4", image: svgImages[3], state: "default" });
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

    // Draw the SVG image
    image(region.image, 0, 0); // Positioning may need to be adjusted
  }
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
  let img = region.image;
  img.loadPixels();

  let x = mouseX;
  let y = mouseY;

  if (x < 0 || x >= img.width || y < 0 || y >= img.height) {
    return false; // Outside image bounds
  }

  // Check the alpha channel to see if the pixel is not transparent
  let index = (x + y * img.width) * 4; // 4 channels per pixel
  return img.pixels[index + 3] > 0; // Check if pixel is not transparent
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
