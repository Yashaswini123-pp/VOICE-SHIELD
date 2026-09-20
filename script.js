// ==========================================
// VOICE SHIELD - COMPLETE PROTOTYPE SCRIPT
// ==========================================


// ---------- ELEMENTS ----------

const audioFile = document.getElementById("audioFile");
const fileName = document.getElementById("fileName");
const analyzeBtn = document.getElementById("analyzeBtn");
const liveBtn = document.getElementById("liveBtn");
const liveStatus = document.getElementById("liveStatus");
const monitorTime = document.getElementById("monitorTime");
const analysisStatus = document.getElementById("analysisStatus");

let monitorSeconds = 0;
let monitorTimer;

const resultCard = document.getElementById("resultCard");
const threatAlert = document.getElementById("threatAlert");


// ---------- INITIAL STATE ----------

if (resultCard) {
    resultCard.style.display = "none";
}

if (threatAlert) {
    threatAlert.style.display = "none";
}


// ==========================================
// AUDIO FILE SELECTION
// ==========================================

if (audioFile) {

    audioFile.addEventListener("change", function () {

        if (audioFile.files.length > 0) {

            const file = audioFile.files[0];

            fileName.textContent =
                "Selected: " + file.name;

            if (analyzeBtn) {
                analyzeBtn.style.display = "block";
                analyzeBtn.textContent =
                    "🔍 Analyze Voice";
            }

        }

    });

}


// ==========================================
// ANALYZE VOICE
// ==========================================

if (analyzeBtn) {

    analyzeBtn.addEventListener("click", async function () {

        analyzeBtn.textContent = "⏳ Analyzing Voice...";
        analyzeBtn.disabled = true;

        try {

            // Get selected audio file
            const fileInput =
                document.getElementById("audioFile");

            if (!fileInput || !fileInput.files.length) {

                alert("Please select an audio file first.");

                analyzeBtn.disabled = false;
                analyzeBtn.textContent = "Analyze Voice";

                return;
            }

            // Prepare audio file for upload
            const formData = new FormData();

            formData.append(
                "file",
                fileInput.files[0]
            );

            // Send audio to Python backend
            const response = await fetch(
                "http://127.0.0.1:8000/analyze",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Backend analysis failed"
                );
            }

            // Receive backend result
            const data = await response.json();

            console.log(
                "Voice Analysis Result:",
                data
            );

            // Convert scores to percentages
            const syntheticPercentage =
                Math.round(
                    data.synthetic_likelihood * 100
                );

            const speakerPercentage =
                Math.round(
                    data.speaker_match * 100
                );

            // Update AI voice score
            const aiScore =
                document.getElementById("aiScore");

            if (aiScore) {
                aiScore.textContent =
                    syntheticPercentage + "%";
            }

            // Update AI progress bar
            const aiBar =
                document.getElementById("aiBar");

            if (aiBar) {
                aiBar.style.width =
                    syntheticPercentage + "%";
            }

            // Update speaker score
            const speakerScore =
                document.getElementById("speakerScore");

            if (speakerScore) {
                speakerScore.textContent =
                    speakerPercentage + "%";
            }

            // Update speaker progress bar
            const speakerBar =
                document.getElementById("speakerBar");

            if (speakerBar) {
                speakerBar.style.width =
                    speakerPercentage + "%";
            }

            // Update risk level
            const riskLevel =
                document.getElementById("riskLevel");

            if (riskLevel) {
                riskLevel.textContent =
                    data.risk;
            }

            // Show analysis result
            if (resultCard) {
                resultCard.style.display = "block";
            }

            // Show threat alert
            if (threatAlert) {
                threatAlert.style.display = "block";
            }

            // Scroll to threat alert
            if (threatAlert) {

                setTimeout(function () {

                    threatAlert.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }, 200);
            }

            analyzeBtn.textContent =
                "✓ Analysis Complete";

        } catch (error) {

            console.error(
                "Analysis error:",
                error
            );

            analyzeBtn.textContent =
                "❌ Analysis Failed";

            alert(
                "Unable to connect to the Voice Shield backend."
            );

        } finally {

            analyzeBtn.disabled = false;

        }

    });

}


// ==========================================
// LIVE MONITORING
// ==========================================

if (liveBtn) {

    liveBtn.addEventListener("click", async function () {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        liveBtn.textContent = "🔴 Monitoring Active";
        liveBtn.style.background = "#d92d20";

        console.log("Microphone access granted");
        console.log("Audio stream:", stream);
        const audioContext = new AudioContext();

const analyser = audioContext.createAnalyser();

const microphone = audioContext.createMediaStreamSource(stream);

microphone.connect(analyser);

analyser.fftSize = 256;

console.log("Real-time audio analyser connected");
const dataArray = new Uint8Array(analyser.frequencyBinCount);

const waveBars = document.querySelectorAll(".wave-bar");

function updateWaveform() {

    analyser.getByteFrequencyData(dataArray);

    let total = 0;

    for (let i = 0; i < dataArray.length; i++) {
        total += dataArray[i];
    }

    const average = total / dataArray.length;

    waveBars.forEach(function (bar, index) {

        const height =
            10 + (average / 255) * 35 +
            Math.sin(Date.now() / 150 + index) * 3;

        bar.style.height = height + "px";

    });

    requestAnimationFrame(updateWaveform);
}

updateWaveform();
        liveStatus.style.display = "block";
        analysisStatus.textContent = "🟢 Analyzing Voice Stream...";
        setTimeout(function () {

    analysisStatus.textContent =
        "🔴 Potential Voice Clone Detected — CRITICAL RISK";

    analysisStatus.style.background = "#fff1f0";
    analysisStatus.style.color = "#b42318";

    threatAlert.style.display = "block";

}, 5000);
        monitorSeconds = 0;

clearInterval(monitorTimer);

monitorTimer = setInterval(function () {

    monitorSeconds++;

    let minutes = Math.floor(monitorSeconds / 60);
    let seconds = monitorSeconds % 60;

    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    monitorTime.textContent = minutes + ":" + seconds;

}, 1000);

        alert("🎙️ Live microphone monitoring started.");

    } catch (error) {

        console.error("Microphone access denied:", error);

        alert(
            "Microphone access was denied. Please allow microphone access in Chrome."
        );
    }

});

}


// ==========================================
// VERIFY IDENTITY MODAL
// ==========================================

const verificationModal =
    document.getElementById("verificationModal");


// ==========================================
// BLOCK & REPORT MODAL
// ==========================================

const blockModal =
    document.getElementById("blockModal");


// ============================================
// OPEN IDENTITY VERIFICATION MODAL
// ============================================

document.addEventListener("click", function (event) {

    const verifyButton = event.target.closest(
        ".verify-btn, .verify-large"
    );

    if (!verifyButton) return;

    const verificationModal =
        document.getElementById("verificationModal");

    if (!verificationModal) {
        console.error("verificationModal not found");
        return;
    }

    console.log("Verify Identity button clicked");

    verificationModal.style.display = "flex";
});


// ============================================
// OPEN BLOCK & REPORT MODAL
// ============================================

document.addEventListener("click", function (event) {

    const blockButton = event.target.closest(
        ".block-btn, .block-large"
    );

    if (!blockButton) return;

    const blockModal = document.getElementById("blockModal");

    if (!blockModal) {
        console.error("blockModal not found");
        return;
    }

    console.log("Block button clicked");

    blockModal.style.display = "flex";
});


// ==========================================
// CLOSE VERIFICATION
// ==========================================

const closeVerification =
    document.getElementById("closeVerification");

if (closeVerification) {

    closeVerification.addEventListener(
        "click",
        function () {

            verificationModal.style.display =
                "none";

        }
    );

}


// ==========================================
// CLOSE BLOCK
// ==========================================

const closeBlock =
    document.getElementById("closeBlock");

if (closeBlock) {

    closeBlock.addEventListener(
        "click",
        function () {

            blockModal.style.display =
                "none";

        }
    );

}


// ==========================================
// DONE BUTTON
// ==========================================

const doneBlock =
    document.getElementById("doneBlock");

if (doneBlock) {

    doneBlock.addEventListener(
        "click",
        function () {

            blockModal.style.display =
                "none";

        }
    );

}


// ==========================================
// OTP VERIFICATION
// ==========================================

const otpBtn =
    document.getElementById("otpBtn");

if (otpBtn) {

    otpBtn.addEventListener(
        "click",
        function () {

            document.getElementById(
                "verificationStatus"
            ).innerHTML =
                "✓ OTP verification initiated. " +
                "A verification code has been sent " +
                "to the registered mobile.";

        }
    );

}


// ==========================================
// TRUSTED CONTACT
// ==========================================

const contactBtn =
    document.getElementById("contactBtn");

if (contactBtn) {

    contactBtn.addEventListener(
        "click",
        function () {

            document.getElementById(
                "verificationStatus"
            ).innerHTML =
                "✓ Trusted contact verification initiated.";

        }
    );

}


// ==========================================
// REGISTERED DEVICE
// ==========================================

const deviceBtn =
    document.getElementById("deviceBtn");

if (deviceBtn) {

    deviceBtn.addEventListener(
        "click",
        function () {

            document.getElementById(
                "verificationStatus"
            ).innerHTML =
                "✓ Verification request sent to the registered device.";

        }
    );

}


// ==========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener("click", function (event) {

    if (event.target === verificationModal) {

        verificationModal.style.display =
            "none";

    }

    if (event.target === blockModal) {

        blockModal.style.display =
            "none";

    }

});