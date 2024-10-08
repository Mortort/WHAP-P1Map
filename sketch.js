let regions = [];
let selectedRegion = null;
let correctAnswers = ["Region1", "Region2", "Region3", "Region4"]; // Replace with actual region names
let svgFiles = ["WHAP/path3.svg", "WHAP/path5.svg", "WHAP/path6.svg", "WHAP/path7.svg", "WHAP/path8.svg", "WHAP/path9.svg", "WHAP/path10.svg", "WHAP/path11.svg", "WHAP/path12.svg", "WHAP/path13.svg", "WHAP/path14.svg", "WHAP/path15.svg", "WHAP/path16.svg", "WHAP/path17.svg", "WHAP/path18.svg", "WHAP/path19.svg", "WHAP/path20.svg", "WHAP/path21.svg", "WHAP/path22.svg", "WHAP/path23.svg", "WHAP/path24.svg", "WHAP/path25.svg", "WHAP/path26.svg", "WHAP/path27.svg", "WHAP/path28.svg", "WHAP/path29.svg", "WHAP/path30.svg", "WHAP/path31.svg", "WHAP/path32.svg", "WHAP/path33.svg"]; // Add paths to your SVG files
let svgImages = [];

function loadSVG(path) {
  return new Promise((resolve, reject) => {
    fetch(path)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, 'image/svg+xml');
        const paths = svgDoc.querySelectorAll('path');
        let allVertices = [];
        
        paths.forEach(path => {
          const d = path.getAttribute('d');
          const vertices = parsePathData(d);
          allVertices = allVertices.concat(vertices); // Combine all vertices
        });

        resolve(allVertices);
      })
      .catch(reject);
  });
}

function parsePathData(d) {
  const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g);
  let vertices = [];
  let currentX = 0, currentY = 0;

  commands.forEach(command => {
    const type = command[0];
    const values = command.slice(1).trim().split(/[\s,]+/).map(Number);
    
    for (let i = 0; i < values.length; i += 2) {
      if (type === 'M' || type === 'm') {
        currentX = (type === 'M' ? values[i] : currentX + values[i]);
        currentY = (type === 'M' ? values[i + 1] : currentY + values[i + 1]);
        vertices.push({ x: currentX, y: currentY });
      } else if (type === 'L' || type === 'l') {
        currentX = (type === 'L' ? values[i] : currentX + values[i]);
        currentY = (type === 'L' ? values[i + 1] : currentY + values[i + 1]);
        vertices.push({ x: currentX, y: currentY });
      } else if (type === 'C' || type === 'c') {
        // Cubic Bezier curve, using the end point
        currentX = (type === 'C' ? values[i + 4] : currentX + values[i + 4]);
        currentY = (type === 'C' ? values[i + 5] : currentY + values[i + 5]);
        vertices.push({ x: currentX, y: currentY });
      }
      // Add more commands as necessary
    }
  });
  
  return vertices;
}

function setup() {
  createCanvas(1123, 794);

  // Loop through the svgFiles array
  for (let i = 0; i < svgFiles.length; i++) {
    const filePath = svgFiles[i];
    const regionName = `Region${i + 1}`; // Assuming naming convention "Region1", "Region2", etc.

    // Load the SVG and add the region with its name and vertices
    loadSVG(filePath).then(vertices => {
      regions.push({
        name: regionName,
        vertices: vertices // Use the parsed vertices
      });
      console.log(`Loaded ${regionName}:`, vertices);
    }).catch(err => {
      console.error(`Error loading SVG from ${filePath}:`, err);
    });
  }
}


function draw() {
  background(220);

  // Draw the vector-shaped regions
  for (let region of regions) {
    fill(200, 100, 100);
    beginShape();
    for (let v of region.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);

    // Highlight selected region
    if (selectedRegion === region) {
      fill(100, 200, 100);
      beginShape();
      for (let v of region.vertices) {
        vertex(v.x, v.y);
      }
      endShape(CLOSE);
    }
  }
}

function mousePressed() {
  for (let region of regions) {
    if (isMouseInRegion(region)) {
      selectedRegion = region;
      document.getElementById("answer").focus();
    }
  }
}

// Function to check if the mouse click is inside the region
function isMouseInRegion(region) {
  let x = mouseX;
  let y = mouseY;
  let inside = false;
  let vertices = region.vertices;

  // Using ray-casting algorithm to check if mouse is inside the polygon
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    let xi = vertices[i].x, yi = vertices[i].y;
    let xj = vertices[j].x, yj = vertices[j].y;

    let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

function checkAnswer() {
  let answer = document.getElementById("answer").value;
  if (selectedRegion && answer === selectedRegion.name) {
    document.getElementById("feedback").innerText = "Correct!";
  } else {
    document.getElementById("feedback").innerText = "Try again.";
  }
  document.getElementById("answer").value = ""; // Clear input
}

