// DOM elements
const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const audioPlayer = document.getElementById("audioPlayer");
const downloadLink = document.getElementById("downloadLink");

// MediaRecorder and data storage
let mediaRecorder;
let audioChunks = [];

// Request access to the microphone
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    // Create MediaRecorder using mic stream
    mediaRecorder = new MediaRecorder(stream);

    // Store audio data chunks as they arrive
    mediaRecorder.ondataavailable = e => {
      audioChunks.push(e.data);
    };

    // When recording stops
    mediaRecorder.onstop = () => {
      // Combine chunks into a single Blob
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      audioChunks = [];

      // Create a playable URL
      const audioURL = URL.createObjectURL(audioBlob);

      // Set audio player source
      audioPlayer.src = audioURL;

      // Prepare download link
      downloadLink.href = audioURL;
      downloadLink.style.display = "inline";
    };
  })
  .catch(err => {
    alert("Microphone access denied");
    console.error(err);
  });

// Start recording
recordBtn.addEventListener("click", () => {
  mediaRecorder.start();
  recordBtn.disabled = true;
  stopBtn.disabled = false;
});

// Stop recording
stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  recordBtn.disabled = false;
  stopBtn.disabled = true;
});
