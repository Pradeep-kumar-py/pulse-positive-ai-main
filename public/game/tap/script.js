class FocusTapGame {
  constructor() {
    this.gameActive = false;
    this.gamePaused = false;
    this.gameStartTime = 0;
    this.currentTime = 0;

    // Performance metrics
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.level = 1;

    // Attention metrics
    this.correctTaps = 0;
    this.missedTargets = 0;
    this.falseAlarms = 0;
    this.totalTargets = 0;
    this.totalDistractors = 0;

    // Reaction time tracking
    this.reactionTimes = [];
    this.objectSpawnTimes = new Map();

    // Game configuration
    this.spawnInterval = 2000; // Base spawn interval
    this.objectLifetime = 3000; // How long objects stay on screen
    this.targetProbability = 0.6; // 60% targets, 40% distractors

    // Adaptive difficulty
    this.difficultyAdjustmentThreshold = 10;
    this.performanceWindow = [];

    // DOM elements
    this.gameArea = document.getElementById("game-area");
    this.objectsContainer = document.getElementById("objects-container");
    this.focusIndicator = document.getElementById("focus-indicator");

    // Timers
    this.gameTimer = null;
    this.spawnTimer = null;
    this.clockTimer = null;

    this.initializeGame();
    this.bindEvents();
  }

  initializeGame() {
    this.updateDisplay();
    this.showFocusIndicator();
  }

  bindEvents() {
    document
      .getElementById("start-btn")
      .addEventListener("click", () => this.startGame());
    document
      .getElementById("pause-btn")
      .addEventListener("click", () => this.pauseGame());
    document
      .getElementById("stop-btn")
      .addEventListener("click", () => this.stopGame());
    document
      .getElementById("resume-btn")
      .addEventListener("click", () => this.resumeGame());
    document
      .getElementById("retry-btn")
      .addEventListener("click", () => this.restartGame());
    document
      .getElementById("save-results-btn")
      .addEventListener("click", () => this.saveResults());
    document
      .getElementById("share-btn")
      .addEventListener("click", () => this.shareResults());

    // Prevent context menu on game area
    this.gameArea.addEventListener("contextmenu", (e) => e.preventDefault());

    // Handle clicks outside objects (impulse control tracking)
    this.gameArea.addEventListener("click", (e) => {
      if (this.gameActive && !e.target.classList.contains("game-object")) {
        this.handleMissClick();
      }
    });
  }

  startGame() {
    this.gameActive = true;
    this.gameStartTime = Date.now();
    this.currentTime = 0;

    // Hide start button, show pause/stop
    document.getElementById("start-btn").classList.add("hidden");
    document.getElementById("pause-btn").classList.remove("hidden");
    document.getElementById("stop-btn").classList.remove("hidden");

    // Hide focus indicator
    this.hideFocusIndicator();

    // Start timers
    this.startSpawning();
    this.startClock();

    // Show first instruction
    this.showGameInstruction();
  }

  pauseGame() {
    this.gamePaused = true;
    this.clearTimers();

    // Update pause modal with current stats
    document.getElementById("pause-performance").textContent = `${Math.round(
      this.calculateAccuracy()
    )}% accuracy`;
    document.getElementById("pause-focus").textContent =
      this.calculateAttentionLevel();

    document.getElementById("pause-modal").classList.remove("hidden");
  }

  resumeGame() {
    this.gamePaused = false;
    document.getElementById("pause-modal").classList.add("hidden");

    // Restart timers
    this.startSpawning();
    this.startClock();
  }

  stopGame() {
    this.gameActive = false;
    this.clearTimers();
    this.clearAllObjects();
    this.showResults();
  }

  startSpawning() {
    this.spawnTimer = setInterval(() => {
      if (!this.gamePaused && this.gameActive) {
        this.spawnObject();
      }
    }, this.spawnInterval);
  }

  startClock() {
    this.clockTimer = setInterval(() => {
      if (!this.gamePaused && this.gameActive) {
        this.currentTime = Date.now() - this.gameStartTime;
        this.updateDisplay();

        // Check for automatic difficulty adjustment
        if (
          this.totalTargets > 0 &&
          this.totalTargets % this.difficultyAdjustmentThreshold === 0
        ) {
          this.adjustDifficulty();
        }

        // Auto-stop after 5 minutes for assessment
        if (this.currentTime > 300000) {
          this.stopGame();
        }
      }
    }, 100);
  }

  spawnObject() {
    const isTarget = Math.random() < this.targetProbability;
    const object = this.createGameObject(isTarget);

    // Position object randomly, avoiding center area
    const gameAreaRect = this.gameArea.getBoundingClientRect();
    const margin = 60; // Object size
    const centerMargin = 100; // Avoid center focus area

    let x, y;
    do {
      x = Math.random() * (gameAreaRect.width - margin * 2) + margin;
      y = Math.random() * (gameAreaRect.height - margin * 2) + margin;
    } while (
      x > gameAreaRect.width / 2 - centerMargin &&
      x < gameAreaRect.width / 2 + centerMargin &&
      y > gameAreaRect.height / 2 - centerMargin &&
      y < gameAreaRect.height / 2 + centerMargin
    );

    object.style.left = x + "px";
    object.style.top = y + "px";

    // Track spawn time for reaction time calculation
    this.objectSpawnTimes.set(object.id, Date.now());

    // Add to container
    this.objectsContainer.appendChild(object);

    // Auto-remove after lifetime
    setTimeout(() => {
      if (object.parentNode) {
        if (isTarget) {
          this.handleMissedTarget(object);
        }
        this.removeObject(object);
      }
    }, this.objectLifetime);

    // Update counters
    if (isTarget) {
      this.totalTargets++;
    } else {
      this.totalDistractors++;
    }
  }

  createGameObject(isTarget) {
    const object = document.createElement("div");
    object.className = `game-object ${isTarget ? "target" : "distractor"}`;
    object.id = "obj_" + Date.now() + "_" + Math.random();
    object.dataset.isTarget = isTarget;

    // Add click handler
    object.addEventListener("click", (e) => {
      e.stopPropagation();
      this.handleObjectClick(object, isTarget);
    });

    return object;
  }

  handleObjectClick(object, isTarget) {
    if (!this.gameActive || this.gamePaused) return;

    // Calculate reaction time
    const spawnTime = this.objectSpawnTimes.get(object.id);
    const reactionTime = Date.now() - spawnTime;
    this.reactionTimes.push(reactionTime);

    if (isTarget) {
      // Correct tap on target
      this.handleCorrectTap(object, reactionTime);
    } else {
      // False alarm - clicked distractor
      this.handleFalseAlarm(object);
    }

    // Clean up
    this.objectSpawnTimes.delete(object.id);
  }

  handleCorrectTap(object, reactionTime) {
    this.correctTaps++;
    this.streak++;
    this.maxStreak = Math.max(this.maxStreak, this.streak);

    // Score calculation based on reaction time and streak
    let points = 100;
    if (reactionTime < 500) points += 50; // Fast reaction bonus
    if (reactionTime < 300) points += 50; // Very fast bonus
    points += Math.min(this.streak * 5, 50); // Streak bonus

    this.score += points;

    // Visual feedback
    object.classList.add("clicked-correct");
    this.showFeedback("correct", object, `+${points}`);

    // Remove object
    setTimeout(() => this.removeObject(object), 300);

    this.updateDisplay();
  }

  handleFalseAlarm(object) {
    this.falseAlarms++;
    this.streak = 0; // Break streak

    // Score penalty
    this.score = Math.max(0, this.score - 50);

    // Visual feedback
    object.classList.add("clicked-wrong");
    this.showFeedback("wrong", object, "-50");

    // Keep object visible briefly to reinforce mistake
    setTimeout(() => this.removeObject(object), 500);

    this.updateDisplay();
  }

  handleMissedTarget(object) {
    this.missedTargets++;
    this.streak = 0; // Break streak

    // Visual feedback
    object.classList.add("missed");
    this.showFeedback("missed", object, "MISSED");

    this.updateDisplay();
  }

  handleMissClick() {
    // Clicked empty area - mild impulse control issue
    this.score = Math.max(0, this.score - 10);
    this.updateDisplay();
  }

  showFeedback(type, object, text) {
    const feedback = document.createElement("div");
    feedback.className = "feedback-text";
    feedback.textContent = text;
    feedback.style.position = "absolute";
    feedback.style.left = object.style.left;
    feedback.style.top = object.style.top;
    feedback.style.color =
      type === "correct" ? "#2ecc71" : type === "wrong" ? "#e74c3c" : "#f39c12";
    feedback.style.fontSize = "1.2rem";
    feedback.style.fontWeight = "bold";
    feedback.style.pointerEvents = "none";
    feedback.style.zIndex = "200";
    feedback.style.animation = "feedback-float 1s ease-out forwards";

    this.objectsContainer.appendChild(feedback);

    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.remove();
      }
    }, 1000);
  }

  removeObject(object) {
    if (object.parentNode) {
      object.remove();
    }
    this.objectSpawnTimes.delete(object.id);
  }

  clearAllObjects() {
    this.objectsContainer.innerHTML = "";
    this.objectSpawnTimes.clear();
  }

  adjustDifficulty() {
    const accuracy = this.calculateAccuracy();
    const avgReaction = this.calculateAverageReactionTime();

    // Adjust spawn rate based on performance
    if (accuracy > 85 && avgReaction < 600) {
      // Increase difficulty
      this.spawnInterval = Math.max(800, this.spawnInterval - 100);
      this.objectLifetime = Math.max(2000, this.objectLifetime - 200);
      this.level++;
    } else if (accuracy < 60) {
      // Decrease difficulty
      this.spawnInterval = Math.min(3000, this.spawnInterval + 200);
      this.objectLifetime = Math.min(4000, this.objectLifetime + 300);
    }

    // Restart spawn timer with new interval
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
      this.startSpawning();
    }
  }

  calculateAccuracy() {
    const totalResponses = this.correctTaps + this.falseAlarms;
    return totalResponses > 0 ? (this.correctTaps / totalResponses) * 100 : 100;
  }

  calculateAverageReactionTime() {
    return this.reactionTimes.length > 0
      ? this.reactionTimes.reduce((a, b) => a + b, 0) /
          this.reactionTimes.length
      : 0;
  }

  calculateAttentionLevel() {
    const accuracy = this.calculateAccuracy();
    const missRate =
      this.totalTargets > 0
        ? (this.missedTargets / this.totalTargets) * 100
        : 0;
    const falseAlarmRate =
      this.totalDistractors > 0
        ? (this.falseAlarms / this.totalDistractors) * 100
        : 0;

    // Combined attention score (0-100)
    const attentionScore = Math.max(0, 100 - missRate - falseAlarmRate);

    if (attentionScore >= 90) return "Excellent";
    if (attentionScore >= 75) return "Good";
    if (attentionScore >= 60) return "Fair";
    return "Needs Improvement";
  }

  calculateADHDRisk() {
    const accuracy = this.calculateAccuracy();
    const avgReaction = this.calculateAverageReactionTime();
    const missRate =
      this.totalTargets > 0
        ? (this.missedTargets / this.totalTargets) * 100
        : 0;
    const falseAlarmRate =
      this.totalDistractors > 0
        ? (this.falseAlarms / this.totalDistractors) * 100
        : 0;

    let riskScore = 0;

    // High miss rate indicates attention deficits
    if (missRate > 30) riskScore += 3;
    else if (missRate > 15) riskScore += 2;
    else if (missRate > 5) riskScore += 1;

    // High false alarm rate indicates impulse control issues
    if (falseAlarmRate > 25) riskScore += 3;
    else if (falseAlarmRate > 15) riskScore += 2;
    else if (falseAlarmRate > 5) riskScore += 1;

    // Variable reaction times indicate attention inconsistency
    if (this.reactionTimes.length > 5) {
      const reactionVariability = this.calculateReactionTimeVariability();
      if (reactionVariability > 300) riskScore += 2;
      else if (reactionVariability > 200) riskScore += 1;
    }

    // Overall low accuracy
    if (accuracy < 70) riskScore += 2;
    else if (accuracy < 80) riskScore += 1;

    if (riskScore >= 6) return "High Risk";
    if (riskScore >= 3) return "Moderate Risk";
    return "Low Risk";
  }

  calculateReactionTimeVariability() {
    if (this.reactionTimes.length < 2) return 0;

    const mean = this.calculateAverageReactionTime();
    const squaredDiffs = this.reactionTimes.map((rt) => Math.pow(rt - mean, 2));
    const variance =
      squaredDiffs.reduce((a, b) => a + b, 0) / this.reactionTimes.length;
    return Math.sqrt(variance); // Standard deviation
  }

  updateDisplay() {
    // Update stats
    document.getElementById("current-score").textContent = this.score;
    document.getElementById("current-streak").textContent = this.streak;
    document.getElementById("difficulty-level").textContent = this.level;
    document.getElementById("game-time").textContent = this.formatTime(
      this.currentTime
    );

    // Update metrics
    const accuracy = this.calculateAccuracy();
    const avgReaction = this.calculateAverageReactionTime();
    const attentionLevel = this.calculateAttentionLevel();

    document.getElementById("accuracy-rate").textContent =
      Math.round(accuracy) + "%";
    document.getElementById("avg-reaction").textContent =
      Math.round(avgReaction) + "ms";
    document.getElementById("attention-score").textContent =
      Math.round(
        Math.max(0, 100 - (this.missedTargets + this.falseAlarms) * 5)
      ) + "%";

    // Impulse control rating
    const falseAlarmRate =
      this.totalDistractors > 0
        ? (this.falseAlarms / this.totalDistractors) * 100
        : 0;
    let impulseRating = "Perfect";
    if (falseAlarmRate > 25) impulseRating = "Poor";
    else if (falseAlarmRate > 15) impulseRating = "Fair";
    else if (falseAlarmRate > 5) impulseRating = "Good";

    document.getElementById("impulse-control").textContent = impulseRating;
  }

  showResults() {
    const accuracy = this.calculateAccuracy();
    const avgReaction = this.calculateAverageReactionTime();
    const attentionLevel = this.calculateAttentionLevel();
    const adhdRisk = this.calculateADHDRisk();

    // Update results modal
    document.getElementById("final-attention").textContent = attentionLevel;
    document.getElementById("final-attention").className =
      "result-value attention-score " +
      attentionLevel.toLowerCase().replace(" ", "-");

    document.getElementById("adhd-risk").textContent = adhdRisk;
    document.getElementById("adhd-risk").className =
      "result-value risk-" + adhdRisk.split(" ")[0].toLowerCase();

    // Detailed metrics
    document.getElementById("correct-taps").textContent = this.correctTaps;
    document.getElementById("missed-targets").textContent = this.missedTargets;
    document.getElementById("false-alarms").textContent = this.falseAlarms;
    document.getElementById("final-reaction").textContent =
      Math.round(avgReaction) + "ms";

    // Analysis
    const analysisText = this.generateAnalysis(
      accuracy,
      avgReaction,
      attentionLevel,
      adhdRisk
    );
    document.getElementById("attention-analysis").textContent = analysisText;

    // Recommendations
    const recommendations = this.generateRecommendations(adhdRisk, accuracy);
    document.getElementById("recommendations").innerHTML = recommendations;

    // Show modal
    document.getElementById("results-modal").classList.remove("hidden");

    // Reset UI
    this.resetGameUI();
  }

  generateAnalysis(accuracy, avgReaction, attentionLevel, adhdRisk) {
    let analysis = "";

    if (attentionLevel === "Excellent") {
      analysis =
        "Your attention span and focus are exceptional. You demonstrate strong sustained attention with minimal distractibility.";
    } else if (attentionLevel === "Good") {
      analysis =
        "You show good attention control with some minor lapses. Overall cognitive focus is within normal range.";
    } else if (attentionLevel === "Fair") {
      analysis =
        "Your attention shows moderate variability. Some difficulty maintaining consistent focus over time.";
    } else {
      analysis =
        "Results suggest challenges with sustained attention and impulse control. Consider consultation with a healthcare professional.";
    }

    if (avgReaction > 800) {
      analysis +=
        " Reaction times are slower than average, which may indicate processing speed considerations.";
    } else if (avgReaction < 400) {
      analysis +=
        " Excellent reaction times suggest good cognitive processing speed and alertness.";
    }

    return analysis;
  }

  generateRecommendations(adhdRisk, accuracy) {
    let recommendations = "";

    if (adhdRisk === "High Risk") {
      recommendations = `
                <ul>
                    <li>Consider consultation with a mental health professional or physician</li>
                    <li>Practice mindfulness and meditation exercises daily</li>
                    <li>Use focus training apps and cognitive exercises regularly</li>
                    <li>Implement structured routines and environmental modifications</li>
                    <li>Consider attention training programs or therapy</li>
                </ul>
            `;
    } else if (adhdRisk === "Moderate Risk") {
      recommendations = `
                <ul>
                    <li>Regular cognitive training exercises may be beneficial</li>
                    <li>Practice attention-building activities like puzzles and reading</li>
                    <li>Maintain consistent sleep schedule and exercise routine</li>
                    <li>Consider stress management techniques</li>
                    <li>Monitor progress with regular assessments</li>
                </ul>
            `;
    } else {
      recommendations = `
                <ul>
                    <li>Continue maintaining good cognitive health practices</li>
                    <li>Engage in regular mental stimulation activities</li>
                    <li>Practice mindfulness for enhanced focus</li>
                    <li>Consider challenging cognitive games for improvement</li>
                    <li>Share these positive results with healthcare providers if relevant</li>
                </ul>
            `;
    }

    return recommendations;
  }

  clearTimers() {
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
      this.clockTimer = null;
    }
  }

  showFocusIndicator() {
    this.focusIndicator.style.display = "block";
  }

  hideFocusIndicator() {
    this.focusIndicator.style.display = "none";
  }

  showGameInstruction() {
    // Could add a brief instruction overlay here
  }

  resetGameUI() {
    document.getElementById("start-btn").classList.remove("hidden");
    document.getElementById("pause-btn").classList.add("hidden");
    document.getElementById("stop-btn").classList.add("hidden");
    this.showFocusIndicator();
  }

  restartGame() {
    // Reset all variables
    this.gameActive = false;
    this.gamePaused = false;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.level = 1;
    this.correctTaps = 0;
    this.missedTargets = 0;
    this.falseAlarms = 0;
    this.totalTargets = 0;
    this.totalDistractors = 0;
    this.reactionTimes = [];
    this.spawnInterval = 2000;
    this.objectLifetime = 3000;

    // Clear timers and objects
    this.clearTimers();
    this.clearAllObjects();

    // Hide modal and reset UI
    document.getElementById("results-modal").classList.add("hidden");
    this.resetGameUI();
    this.updateDisplay();
  }

  saveResults() {
    const results = {
      timestamp: new Date().toISOString(),
      score: this.score,
      accuracy: this.calculateAccuracy(),
      attentionLevel: this.calculateAttentionLevel(),
      adhdRisk: this.calculateADHDRisk(),
      correctTaps: this.correctTaps,
      missedTargets: this.missedTargets,
      falseAlarms: this.falseAlarms,
      averageReactionTime: this.calculateAverageReactionTime(),
      maxStreak: this.maxStreak,
      gameDuration: this.currentTime,
    };

    // Save to localStorage
    const savedResults = JSON.parse(
      localStorage.getItem("focusTapResults") || "[]"
    );
    savedResults.push(results);
    localStorage.setItem("focusTapResults", JSON.stringify(savedResults));

    alert("Results saved successfully!");
  }

  shareResults() {
    const accuracy = this.calculateAccuracy();
    const attentionLevel = this.calculateAttentionLevel();

    const shareText =
      `🧠 Focus Tap Assessment Results:\n` +
      `✅ Accuracy: ${Math.round(accuracy)}%\n` +
      `🎯 Attention Level: ${attentionLevel}\n` +
      `⚡ Score: ${this.score}\n` +
      `🏆 Max Streak: ${this.maxStreak}\n\n` +
      `Test your focus and attention span!`;

    if (navigator.share) {
      navigator.share({
        title: "Focus Tap Results",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Results copied to clipboard!");
      });
    }
  }

  formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
}

// Add CSS animation for feedback
const style = document.createElement("style");
style.textContent = `
    @keyframes feedback-float {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-30px); }
    }
`;
document.head.appendChild(style);

// Initialize game when page loads
document.addEventListener("DOMContentLoaded", () => {
  new FocusTapGame();
});
