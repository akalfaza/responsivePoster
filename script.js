// =================================================
// ✅ ➊ Paste your model URL
// =================================================
const URL = "https://teachablemachine.withgoogle.com/models/pTRugZ3WN/";


// =================================================
// ✔️ Initialize the model and webcam
// =================================================
// ⁉️ Assign variables
let model, webcam, labelContainer, maxPredictions;
// ⁉️ Tracks if a window has already been opened
let hasOpenedWindow = false;
// ⁉️ Probability threshold (80%) for triggering an action
const THRESHOLD = 0.9;
const DEFAULT_BG = "#FF0000"; // your current blue
const ACTIVE_BG = "#03d503";  // green



// Images ===========================================


async function init() {
   // =================================================
   // ❌ No need to change
   // =================================================
   // ⁉️ URL + "model.json": Construct the model URL
   // ⁉️ URL + "metadata.json": Construct the metadata URL
   const modelURL = URL + "model.json";
   const metadataURL = URL + "metadata.json";

   // ⁉️ Load the model and get the number of prediction classes
   model = await tmImage.load(modelURL, metadataURL);
   maxPredictions = model.getTotalClasses();

   // =================================================
   // ✅ ➋ new tmImage.Webcam(400, 400, true): 400x400 resolution
   //      🫲 true: mirror the webcam (flipped)
   //      🫱 false: showing the image as it is captured (not be flipped)
   // =================================================
   webcam = new tmImage.Webcam(400, 400, true);

   // =================================================
   // ❌ No need to change
   // =================================================
   // ⁉️ Request access to the webcam
   await webcam.setup();
   // ⁉️ Start the webcam stream
   await webcam.play();
   // ⁉️ Start the loop function for continuous prediction
   requestAnimationFrame(loop);

   // =================================================
   // ✔️ Create the webcam and label containers
   // =================================================
   // ⁉️ Append webcam canvas to the container
   $("#webcam-container").append(webcam.canvas);
   // ⁉️ Select the label container for predictions
   labelContainer = $("#label-container");
   // ⁉️ Create a placeholder for each prediction label
   for (let i = 0; i < maxPredictions; i++) {
      labelContainer.append("<div></div>");
   }
}


// =================================================
// ❌ No need to change: continuously updates the webcam feed and runs predictions in real-time
// =================================================
async function loop() {
   // ⁉️ Update the webcam frame
   webcam.update();
   // ⁉️ Run prediction on the current frame
   await predict();
   // ⁉️ Continue the loop function for real-time updates
   requestAnimationFrame(loop);
}



// =================================================
// ✔️ Runs the model’s prediction on the current webcam frame
// =================================================
async function predict() {
   // ⁉️ Get predictions for the current webcam frame
   const prediction = await model.predict(webcam.canvas);
   // ⁉️ Create an array of probabilities from the prediction results
   const probabilities = prediction.map(p => p.probability);

   // ⁉️ Find the highest probability value
   let maxProb = Math.max(...probabilities);
   // ⁉️ Find the index of the highest probability class
   let maxIndex = probabilities.indexOf(maxProb);

   // =================================================
   // ✅ ➌ Apply _____ when a specific model is detected
   // =================================================

   // 1) clear all every frame
   ["name", "occupation", "date", "location", "websites"].forEach(id => {
      const el = document.getElementById(id);
      if (el)
         el.classList.remove("active");
   });

   // 2) only trigger if confident
   if (maxProb < 0.9) {
      document.body.style.backgroundColor = DEFAULT_BG;
      document.querySelector("#img1").style.display = "none";
      document.querySelector("#img2").style.display = "none";
      return;
   }

   // 3) debug: what class is detected?
   console.log("Detected:", prediction[maxIndex].className, maxProb.toFixed(2));
   
   // 4) activate based on index
   if (maxIndex === 0) {
      document.getElementById("name")?.classList.add("active");
      document.getElementById("occupation")?.classList.add("active");
      document.body.style.backgroundColor = ACTIVE_BG;
      document.querySelector("#img1").style.display = "block";
      document.querySelector("#img2").style.display = "block";
      document.querySelector("#img1").style.left = "16vw"
      document.querySelector("#img1").style.top = "22vh";
      document.querySelector("#img2").style.left = "88vw";
      document.querySelector("#img2").style.top = "72vh";
      document.querySelector("#img2").style.display = "block";
      document.querySelector("#img1").src = "img/tiri_1.jpg";
      document.querySelector("#img2").src = "img/tiri_2.jpg";
   } else if (maxIndex === 1) {
      document.getElementById("date")?.classList.add("active");
      document.body.style.backgroundColor = ACTIVE_BG;
      document.querySelector("#img1").style.display = "block";
      document.querySelector("#img2").style.display = "block";
      document.querySelector("#img1").style.left = "15vw";
      document.querySelector("#img1").style.top = "18vh";
      document.querySelector("#img2").style.left = "88vw";
      document.querySelector("#img2").style.top = "20vh";
      document.querySelector("#img1").src = "img/morakana_cumulus.png";
      document.querySelector("#img2").src = "img/morakana_deeptalking.jpg";
   } else if (maxIndex === 2) {
      document.getElementById("location")?.classList.add("active");
      document.body.style.backgroundColor = ACTIVE_BG;
      document.querySelector("#img1").style.display = "block";
      document.querySelector("#img2").style.display = "block";
      document.querySelector("#img1").style.left = "20vw";
      document.querySelector("#img1").style.top = "78vh";
      document.querySelector("#img2").style.left = "80vw";
      document.querySelector("#img2").style.top = "75vh";
      document.querySelector("#img1").src = "img/tiri_oracle1.jpg";
      document.querySelector("#img2").src = "img/tiri_oracle2.jpg";
   } else if (maxIndex === 3) {
      document.getElementById("websites")?.classList.add("active");
      document.body.style.backgroundColor = ACTIVE_BG;
      document.querySelector("#img1").style.display = "block";
      document.querySelector("#img2").style.display = "block";
      document.querySelector("#img1").style.left = "12vw";
      document.querySelector("#img1").style.top = "50vh";
      document.querySelector("#img2").style.left = "88vw";
      document.querySelector("#img2").style.top = "35vh";
      document.querySelector("#img1").src = "img/website_1.png";
      document.querySelector("#img2").src = "img/website_2.png";
   }
   console.log("Detected:", prediction[maxIndex].className, maxProb.toFixed(2));
   // =================================================
   // ✔️ Display prediction results on the screen
   // =================================================
   $("#label-container").children().each((index, element) => {
      $(element).text(prediction[index].className + ": " + prediction[index].probability.toFixed(2));
   });

   // =================================================
}

// =================================================
// ❌ No need to change: automatically run init() after the page loads
// =================================================
$(document).ready(init);