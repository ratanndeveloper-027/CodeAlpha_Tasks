// =======================================================
// Phishing Awareness Training - JavaScript
// CodeAlpha Cybersecurity Internship
// =======================================================

// Quiz questions list
const questions = [
    {
        question: "1. What is the primary goal of a phishing attack?",
        answers: [
            "To steal sensitive information like passwords and bank details",
            "To speed up your computer's internet speed",
            "To update your computer hardware"
        ],
        correct: 0,
        explanation: "Phishing is designed to trick you into revealing private credentials or banking data."
    },
    {
        question: "2. What should you do if you receive an urgent suspicious email?",
        answers: [
            "Click the link immediately to verify your account",
            "Verify the sender through an official, independent channel",
            "Reply with your login details and password"
        ],
        correct: 1,
        explanation: "Always verify suspicious emails by contacting the official organization directly."
    },
    {
        question: "3. Which of these sender addresses is a fake phishing email impersonating Bank of Baroda?",
        answers: [
            "alerts@bankofbaroda.in",
            "kyc-support@bob-netbanking-alert.com",
            "customercare@bankofbaroda.com"
        ],
        correct: 1,
        explanation: "Notice 'bob-netbanking-alert.com' is a fake external domain. Official Bank of Baroda emails end with 'bankofbaroda.in' or 'bankofbaroda.com'."
    },
    {
        question: "4. Should you ever share your OTP (One-Time Password) with someone on phone or email?",
        answers: [
            "Yes, if they claim to be from bank customer support",
            "Yes, if they verify your account number",
            "No, never share your OTP with anyone"
        ],
        correct: 2,
        explanation: "Legitimate banks and organizations will NEVER ask for your confidential OTP."
    },
    {
        question: "5. How can you safely check where a link in an email leads before clicking?",
        answers: [
            "Hover your mouse over the link to preview the actual destination URL",
            "Click it quickly and close it if it looks suspicious",
            "Forward it to all your friends to test it"
        ],
        correct: 0,
        explanation: "Hovering your cursor over any hyperlink previews the real destination URL in the status bar."
    }
];

// Quiz state variables
let currentIndex = 0;
let score = 0;
let isAnswered = false;

// Function to display current question and answer options
function showQuestion() {
    isAnswered = false;
    const currentQ = questions[currentIndex];

    // Update question text and counters
    document.getElementById("question").textContent = currentQ.question;
    document.getElementById("quizCounter").textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    document.getElementById("scoreText").textContent = `Score: ${score}`;

    // Reset feedback and action buttons
    const feedbackEl = document.getElementById("feedback");
    feedbackEl.textContent = "";
    feedbackEl.className = "quiz-feedback";

    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("restartBtn").style.display = "none";

    // Create answer buttons
    const answersContainer = document.getElementById("answers");
    answersContainer.innerHTML = "";

    currentQ.answers.forEach((answerText, index) => {
        const btn = document.createElement("button");
        btn.className = "quiz-btn";
        btn.textContent = answerText;
        btn.onclick = function() {
            checkAnswer(index);
        };
        answersContainer.appendChild(btn);
    });
}

// Function to check if the user selected the right answer
function checkAnswer(selectedIndex) {
    if (isAnswered) return; // Prevent multiple clicks on same question
    isAnswered = true;

    const currentQ = questions[currentIndex];
    const buttons = document.querySelectorAll("#answers .quiz-btn");

    // Disable all options and highlight correct/wrong
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === currentQ.correct) {
            btn.classList.add("correct");
        } else if (index === selectedIndex) {
            btn.classList.add("wrong");
        }
    });

    // Update score and show explanation
    const feedbackEl = document.getElementById("feedback");
    if (selectedIndex === currentQ.correct) {
        score++;
        document.getElementById("scoreText").textContent = `Score: ${score}`;
        feedbackEl.textContent = "✅ Correct! " + currentQ.explanation;
        feedbackEl.classList.add("correct-msg");
    } else {
        feedbackEl.textContent = "❌ Incorrect. " + currentQ.explanation;
        feedbackEl.classList.add("wrong-msg");
    }

    // Show Next Button
    document.getElementById("nextBtn").style.display = "inline-block";
}

// Function to go to next question or show results
function nextQuestion() {
    currentIndex++;

    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        showFinalResults();
    }
}

// Function to display final quiz results
function showFinalResults() {
    document.getElementById("quizCounter").textContent = "Completed!";
    document.getElementById("question").textContent = `🎉 Quiz Completed! You scored ${score} out of ${questions.length}.`;
    document.getElementById("answers").innerHTML = "";

    const feedbackEl = document.getElementById("feedback");
    if (score >= 4) {
        feedbackEl.textContent = "🏆 Excellent cybersecurity awareness! You know how to stay safe from phishing.";
        feedbackEl.className = "quiz-feedback correct-msg";
    } else {
        feedbackEl.textContent = "⚠️ Keep practicing! Make sure to always verify sender details and suspicious links.";
        feedbackEl.className = "quiz-feedback wrong-msg";
    }

    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("restartBtn").style.display = "inline-block";
}

// Function to restart quiz from beginning
function restartQuiz() {
    currentIndex = 0;
    score = 0;
    showQuestion();
}

// Function to toggle red flags in the phishing email simulator
function toggleRedFlags() {
    const clueBox = document.getElementById("clueBox");
    const emailBox = document.getElementById("emailBox");

    if (clueBox.style.display === "none" || clueBox.style.display === "") {
        clueBox.style.display = "block";
        emailBox.classList.add("highlight-flags");
    } else {
        clueBox.style.display = "none";
        emailBox.classList.remove("highlight-flags");
    }
}

// Load first question when page starts
showQuestion();
