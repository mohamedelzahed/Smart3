// مصفوفة الوحدات والبادئات بناءً على الصور المرفقة
const prefixData = [
    { label: "cm", factor: 1e-2, unit: "m" },
    { label: "pm", factor: 1e-12, unit: "m" },
    { label: "km", factor: 1e3, unit: "m" },
    { label: "mm", factor: 1e-3, unit: "m" },
    { label: "μm", factor: 1e-6, unit: "m" },
    { label: "nm", factor: 1e-9, unit: "m" },
    { label: "kHz", factor: 1e-3, unit: "MHz" }, // مثال من الصورة 9
    { label: "kg", factor: 1e3, unit: "g" }
];

let state = { level: 1, score: 0, correctCount: 0, currentQ: null, gameActive: true };

document.getElementById("beginGameBtn").onclick = function() {
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("mainWrapper").classList.remove("hidden");
    render(); 
};

function generateQuestion() {
    // اختيار نوع عشوائي من التحويلات الموجودة في الصور
    const type = prefixData[Math.floor(Math.random() * prefixData.length)];
    let val, correctVal, answers = [];

    if (type.label === "kHz") {
        val = 750;
        correctVal = "0.75 MHz";
        answers = ["0.75 MHz", "7.5 MHz", "75 MHz", "0.075 MHz"];
    } else if (type.label === "kg") {
        val = (Math.random() * 5 + 1).toFixed(1);
        correctVal = (val * 1000) + " g";
        answers = [correctVal, (val * 100) + " g", (val * 10) + " g", (val / 1000) + " g"];
    } else {
        // تحويلات المتر باستخدام الأسس العلمية (مثل صورة 34)
        val = (Math.random() * 50 + 1).toFixed(1);
        let scientific = (val * type.factor).toExponential(2).replace("e", " × 10<sup>") + "</sup>";
        correctVal = scientific + " m";
        
        answers = [
            correctVal,
            (val * type.factor * 10).toExponential(2).replace("e", " × 10<sup>") + "</sup> m",
            (val * type.factor / 10).toExponential(2).replace("e", " × 10<sup>") + "</sup> m",
            val + " m"
        ];
    }

    return {
        qText: `${val} ${type.label} = <span class="dots">....</span> ${type.unit}`,
        correct: correctVal,
        answers: shuffle(answers)
    };
}

function render() {
    if(!state.gameActive) return;
    state.currentQ = generateQuestion();
    document.getElementById("questionCard").innerHTML = `<div class="math-q">${state.currentQ.qText}</div>`;
    const box = document.getElementById("optionsBox");
    box.innerHTML = "";
    document.getElementById("nextBtn").disabled = true;
    document.getElementById("feedback").textContent = "";

    state.currentQ.answers.forEach(ans => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = ans;
        btn.onclick = () => check(ans, btn);
        box.appendChild(btn);
    });
}

function check(ans, btn) {
    if(ans === state.currentQ.correct) {
        btn.style.background = "#4caf50"; btn.style.color = "white";
        state.score += 20; state.correctCount++;
        document.getElementById("feedback").textContent = "✅ إجابة صحيحة!";
    } else {
        btn.style.background = "#f44336"; btn.style.color = "white";
        document.getElementById("feedback").textContent = "❌ حاول مجدداً!";
    }
    document.querySelectorAll(".option-btn").forEach(b => b.disabled = true);
    document.getElementById("nextBtn").disabled = false;
    updateStats();
}

function updateStats() {
    document.getElementById("level").textContent = state.level;
    document.getElementById("score").textContent = state.score;
    document.getElementById("correctCount").textContent = state.correctCount;
}

document.getElementById("nextBtn").onclick = () => {
    if(state.correctCount >= 5) {
        state.level++; state.correctCount = 0;
        alert("رائع! انتقلت للمرحلة التالية");
    }
    render();
};

document.getElementById("endBtn").onclick = () => {
    state.gameActive = false;
    document.getElementById("questionCard").innerHTML = `<h2 style="font-size:2rem;">انتهى الاختبار! 🏆<br>نقاطك: ${state.score}</h2>`;
    document.getElementById("optionsBox").innerHTML = "";
};

function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }
document.getElementById("restartBtn").onclick = () => location.reload();