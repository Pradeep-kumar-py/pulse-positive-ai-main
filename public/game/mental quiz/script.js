class BrainPowerQuiz {
  constructor() {
    this.currentQuestion = 0;
    this.totalQuestions = 20;
    this.score = 0;
    this.correctAnswers = 0;
    this.currentStreak = 0;
    this.bestStreak = 0;
    this.questionStartTime = 0;
    this.totalTime = 0;
    this.questionTimer = null;
    this.timeLeft = 30;
    this.isPaused = false;
    this.difficulty = "easy";
    this.hintsUsed = 0;

    this.questionTypes = ["operators", "weights", "logic"];
    this.currentQuestionData = null;

    this.motivationalMessages = [
      "Your brain is getting stronger with each question! 🧠✨",
      "Excellent problem-solving! Keep that momentum going! 🚀",
      "Mathematical thinking enhances cognitive flexibility! 🌟",
      "Every challenge builds mental resilience! 💪",
      "Pattern recognition improves with practice! 🧩",
      "Logic puzzles strengthen neural pathways! ⚡",
      "Analytical thinking is your superpower! 🎯",
      "Mental agility increases with every solve! 🏃‍♂️",
    ];

    this.initializeQuiz();
    this.bindEvents();
  }

  initializeQuiz() {
    this.updateDisplay();
    this.generateRandomQuestion();
    this.startQuestionTimer();
  }

  bindEvents() {
    document
      .getElementById("hint-btn")
      .addEventListener("click", () => this.showHint());
    document
      .getElementById("skip-btn")
      .addEventListener("click", () => this.skipQuestion());
    document
      .getElementById("pause-btn")
      .addEventListener("click", () => this.pauseGame());
    document
      .getElementById("resume-btn")
      .addEventListener("click", () => this.resumeGame());
    document
      .getElementById("next-question-btn")
      .addEventListener("click", () => this.nextQuestion());
    document
      .getElementById("restart-btn")
      .addEventListener("click", () => this.restartQuiz());
    document
      .getElementById("harder-btn")
      .addEventListener("click", () => this.increaseDifficulty());
  }

  generateRandomQuestion() {
    const questionType =
      this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)];
    const difficultyMultiplier =
      this.difficulty === "easy" ? 1 : this.difficulty === "medium" ? 1.5 : 2;

    document.getElementById("question-type-badge").textContent =
      this.getQuestionTypeName(questionType);

    switch (questionType) {
      case "operators":
        this.currentQuestionData =
          this.generateOperatorQuestion(difficultyMultiplier);
        break;
      case "weights":
        this.currentQuestionData =
          this.generateWeightQuestion(difficultyMultiplier);
        break;
      case "logic":
        this.currentQuestionData =
          this.generateLogicQuestion(difficultyMultiplier);
        break;
    }

    this.displayQuestion();
    this.questionStartTime = Date.now();
    this.resetQuestionTimer();
  }

  generateOperatorQuestion(difficulty) {
    const operators = ["+", "-", "*", "/"];
    const maxNum = Math.floor(20 * difficulty);

    // Generate random numbers
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num3 = Math.floor(Math.random() * maxNum) + 1;
    const result = Math.floor(Math.random() * (maxNum * 2)) + 1;

    // Find the missing operator
    let correctOperator = "";
    let num2 = 0;

    // Try different combinations to make valid equations
    for (let op of operators) {
      switch (op) {
        case "+":
          num2 = result - num1 - num3;
          if (num2 > 0 && num2 <= maxNum) {
            correctOperator = op;
          }
          break;
        case "-":
          num2 = num1 + num3 - result;
          if (num2 > 0 && num2 <= maxNum) {
            correctOperator = op;
          }
          break;
        case "*":
          if ((result - num3) % num1 === 0) {
            num2 = (result - num3) / num1;
            if (num2 > 0 && num2 <= maxNum) {
              correctOperator = op;
            }
          }
          break;
        case "/":
          num2 = num1 * num3 - result;
          if (num2 > 0 && num2 <= maxNum) {
            correctOperator = op;
          }
          break;
      }
      if (correctOperator) break;
    }

    // Fallback to simple addition if no valid operator found
    if (!correctOperator) {
      correctOperator = "+";
      num2 = Math.floor(Math.random() * maxNum) + 1;
      const newResult = num1 + num2 + num3;
      return this.createOperatorData(
        num1,
        num2,
        num3,
        newResult,
        correctOperator
      );
    }

    return this.createOperatorData(num1, num2, num3, result, correctOperator);
  }

  createOperatorData(num1, num2, num3, result, correctOp) {
    const operators = ["+", "-", "*", "/"];
    const wrongOperators = operators.filter((op) => op !== correctOp);
    const options = [correctOp, ...wrongOperators.slice(0, 3)].sort(
      () => Math.random() - 0.5
    );

    return {
      type: "operators",
      question: `What operator makes this equation true?`,
      visual: `${num1} _ ${num2} + ${num3} = ${result}`,
      options: options,
      correctAnswer: correctOp,
      explanation: `${num1} ${correctOp} ${num2} + ${num3} = ${result}`,
      hint: `Try each operator and see which one gives you ${result}`,
    };
  }

  generateWeightQuestion(difficulty) {
    const items = ["🍎", "🍊", "🍌", "🥕", "🥔", "🧅"];
    const maxWeight = Math.floor(10 * difficulty);

    // Create weight relationships
    const weights = {};
    const selectedItems = items.slice(0, 3 + Math.floor(Math.random() * 2));

    selectedItems.forEach((item) => {
      weights[item] = Math.floor(Math.random() * maxWeight) + 1;
    });

    // Create equations
    const item1 = selectedItems[0];
    const item2 = selectedItems[1];
    const item3 = selectedItems[2];

    const equation1Weight = weights[item1] * 2 + weights[item2];
    const equation2Weight = weights[item2] + weights[item3] * 2;

    // Question: What's the weight of a specific combination?
    const queryWeight = weights[item1] + weights[item3];

    // Generate options
    const correctAnswer = queryWeight;
    const options = [
      correctAnswer,
      correctAnswer + Math.floor(Math.random() * 5) + 1,
      correctAnswer - Math.floor(Math.random() * 5) - 1,
      correctAnswer + Math.floor(Math.random() * 10) + 5,
    ]
      .filter((opt) => opt > 0)
      .sort(() => Math.random() - 0.5);

    return {
      type: "weights",
      question: `Based on the weight relationships below, what is the total weight of ${item1} + ${item3}?`,
      visual: `${item1}${item1} + ${item2} = ${equation1Weight}kg\n${item2} + ${item3}${item3} = ${equation2Weight}kg`,
      options: options.slice(0, 4),
      correctAnswer: correctAnswer,
      explanation: `${item1} weighs ${weights[item1]}kg, ${item3} weighs ${weights[item3]}kg. So ${item1} + ${item3} = ${correctAnswer}kg`,
      hint: `Set up equations: Let ${item1}=a, ${item2}=b, ${item3}=c. Then 2a+b=${equation1Weight} and b+2c=${equation2Weight}`,
    };
  }

  generateLogicQuestion(difficulty) {
    const logicTypes = ["sequence", "pattern", "relationship"];
    const selectedType =
      logicTypes[Math.floor(Math.random() * logicTypes.length)];

    switch (selectedType) {
      case "sequence":
        return this.generateSequenceQuestion(difficulty);
      case "pattern":
        return this.generatePatternQuestion(difficulty);
      case "relationship":
        return this.generateRelationshipQuestion(difficulty);
      default:
        return this.generateSequenceQuestion(difficulty);
    }
  }

  generateSequenceQuestion(difficulty) {
    const sequences = [
      // Arithmetic sequences
      () => {
        const start = Math.floor(Math.random() * 20) + 1;
        const diff = Math.floor(Math.random() * 10) + 1;
        const sequence = [
          start,
          start + diff,
          start + 2 * diff,
          start + 3 * diff,
        ];
        const next = start + 4 * diff;
        return { sequence, next, rule: `Add ${diff} each time` };
      },
      // Geometric sequences
      () => {
        const start = Math.floor(Math.random() * 5) + 2;
        const ratio = Math.floor(Math.random() * 3) + 2;
        const sequence = [
          start,
          start * ratio,
          start * ratio * ratio,
          start * ratio * ratio * ratio,
        ];
        const next = start * Math.pow(ratio, 4);
        return { sequence, next, rule: `Multiply by ${ratio} each time` };
      },
      // Fibonacci-like
      () => {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const sequence = [a, b, a + b, a + 2 * b];
        const next = b + a + 2 * b;
        return {
          sequence,
          next,
          rule: `Each number is the sum of the two before it`,
        };
      },
    ];

    const selectedSequence =
      sequences[Math.floor(Math.random() * sequences.length)]();
    const correctAnswer = selectedSequence.next;

    // Generate wrong options
    const options = [
      correctAnswer,
      correctAnswer + Math.floor(Math.random() * 10) + 1,
      correctAnswer - Math.floor(Math.random() * 10) - 1,
      correctAnswer * 2,
    ]
      .filter((opt) => opt > 0)
      .sort(() => Math.random() - 0.5);

    return {
      type: "logic",
      question: `What comes next in this sequence?`,
      visual: `${selectedSequence.sequence.join(", ")}, ?`,
      options: options.slice(0, 4),
      correctAnswer: correctAnswer,
      explanation: `The pattern is: ${selectedSequence.rule}. So the next number is ${correctAnswer}`,
      hint: `Look for the relationship between consecutive numbers`,
    };
  }

  generatePatternQuestion(difficulty) {
    const shapes = ["🔴", "🔵", "🟢", "🟡", "🟠", "🟣"];
    const patternLength = 3 + Math.floor(Math.random() * 2);

    // Create repeating pattern
    const basePattern = [];
    for (let i = 0; i < patternLength; i++) {
      basePattern.push(shapes[Math.floor(Math.random() * shapes.length)]);
    }

    // Repeat pattern
    const fullPattern = [];
    const repetitions = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < repetitions; i++) {
      fullPattern.push(...basePattern);
    }

    // Remove last element to create question
    const correctAnswer = fullPattern.pop();

    // Generate options
    const options = [
      correctAnswer,
      ...shapes.filter((s) => s !== correctAnswer).slice(0, 3),
    ].sort(() => Math.random() - 0.5);

    return {
      type: "logic",
      question: `What shape completes this pattern?`,
      visual: `${fullPattern.join(" ")} ?`,
      options: options,
      correctAnswer: correctAnswer,
      explanation: `The pattern repeats: ${basePattern.join(" ")}`,
      hint: `Look for a repeating sequence of shapes`,
    };
  }

  generateRelationshipQuestion(difficulty) {
    const relationships = [
      {
        premise: "If all cats are animals, and Fluffy is a cat",
        question: "What can we conclude about Fluffy?",
        correct: "Fluffy is an animal",
        wrong: [
          "Fluffy is not an animal",
          "Fluffy might be an animal",
          "We can't conclude anything",
        ],
      },
      {
        premise:
          "If it's raining, then the ground is wet. The ground is not wet",
        question: "What can we conclude?",
        correct: "It's not raining",
        wrong: [
          "It is raining",
          "It might be raining",
          "We need more information",
        ],
      },
      {
        premise: "All roses are flowers. Some flowers are red",
        question: "Which statement must be true?",
        correct: "Some roses might be red",
        wrong: [
          "All roses are red",
          "No roses are red",
          "All flowers are roses",
        ],
      },
    ];

    const selected =
      relationships[Math.floor(Math.random() * relationships.length)];
    const options = [selected.correct, ...selected.wrong].sort(
      () => Math.random() - 0.5
    );

    return {
      type: "logic",
      question: selected.question,
      visual: selected.premise,
      options: options,
      correctAnswer: selected.correct,
      explanation: `Using logical deduction: ${selected.correct}`,
      hint: `Think about what must logically follow from the given statements`,
    };
  }

  displayQuestion() {
    document.getElementById("question-text").textContent =
      this.currentQuestionData.question;

    const visualElement = document.getElementById("question-visual");
    visualElement.innerHTML = "";

    if (this.currentQuestionData.type === "weights") {
      const lines = this.currentQuestionData.visual.split("\n");
      lines.forEach((line) => {
        const div = document.createElement("div");
        div.textContent = line;
        div.style.margin = "0.5rem 0";
        div.style.fontSize = "1.3rem";
        visualElement.appendChild(div);
      });
    } else {
      visualElement.textContent = this.currentQuestionData.visual;
    }

    // Display options
    const answersContainer = document.getElementById("answers-container");
    answersContainer.innerHTML = "";

    this.currentQuestionData.options.forEach((option, index) => {
      const optionElement = document.createElement("div");
      optionElement.className = "answer-option";
      optionElement.textContent = option;
      optionElement.addEventListener("click", () =>
        this.selectAnswer(option, optionElement)
      );
      answersContainer.appendChild(optionElement);
    });

    // Hide hint initially
    document.getElementById("hint-box").classList.add("hidden");
  }

  selectAnswer(selectedAnswer, element) {
    if (this.isPaused) return;

    // Disable all options
    document.querySelectorAll(".answer-option").forEach((opt) => {
      opt.style.pointerEvents = "none";
    });

    const isCorrect = selectedAnswer === this.currentQuestionData.correctAnswer;

    if (isCorrect) {
      element.classList.add("correct");
      this.score += this.calculateScore();
      this.correctAnswers++;
      this.currentStreak++;
      this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
      this.showResult(true);
    } else {
      element.classList.add("incorrect");
      this.currentStreak = 0;
      // Highlight correct answer
      document.querySelectorAll(".answer-option").forEach((opt) => {
        if (opt.textContent === this.currentQuestionData.correctAnswer) {
          opt.classList.add("correct");
        }
      });
      this.showResult(false);
    }

    this.recordQuestionTime();
    this.updateDisplay();
    this.clearQuestionTimer();
  }

  calculateScore() {
    let baseScore = 100;

    // Time bonus (faster = more points)
    const timeBonus = Math.max(0, 30 - Math.floor(this.timeLeft)) * 2;

    // Difficulty bonus
    const difficultyBonus =
      this.difficulty === "easy" ? 0 : this.difficulty === "medium" ? 50 : 100;

    // Streak bonus
    const streakBonus = Math.min(this.currentStreak * 10, 50);

    // Hint penalty
    const hintPenalty = this.hintsUsed * 20;

    return Math.max(
      10,
      baseScore + timeBonus + difficultyBonus + streakBonus - hintPenalty
    );
  }

  showResult(isCorreect) {
    const modal = document.getElementById("result-modal");
    const status = document.getElementById("result-status");
    const explanation = document.getElementById("result-explanation");

    if (isCorreect) {
      status.textContent = "🎉 Correct!";
      status.style.color = "#2ecc71";
    } else {
      status.textContent = "❌ Incorrect";
      status.style.color = "#e74c3c";
    }

    explanation.innerHTML = `
            <strong>Explanation:</strong><br>
            ${this.currentQuestionData.explanation}
        `;

    modal.classList.remove("hidden");

    // Update motivation message
    this.updateMotivationMessage();
  }

  nextQuestion() {
    document.getElementById("result-modal").classList.add("hidden");

    this.currentQuestion++;
    this.hintsUsed = 0;

    if (this.currentQuestion >= this.totalQuestions) {
      this.showFinalResults();
    } else {
      this.generateRandomQuestion();
      this.updateDisplay();
    }
  }

  showFinalResults() {
    const modal = document.getElementById("final-modal");
    const accuracy = Math.round(
      (this.correctAnswers / this.totalQuestions) * 100
    );
    const avgTime = Math.round(this.totalTime / this.totalQuestions);

    document.getElementById(
      "final-score"
    ).textContent = `${this.correctAnswers}/${this.totalQuestions}`;
    document.getElementById("final-accuracy").textContent = `${accuracy}%`;
    document.getElementById("final-streak").textContent = this.bestStreak;

    // Mental rating based on performance
    let rating = "Beginner";
    if (accuracy >= 90 && avgTime <= 15) rating = "Genius";
    else if (accuracy >= 80 && avgTime <= 20) rating = "Expert";
    else if (accuracy >= 70) rating = "Advanced";
    else if (accuracy >= 60) rating = "Intermediate";

    document.getElementById("mental-rating").textContent = rating;

    // Personalized message
    let message = "";
    if (accuracy >= 90) {
      message =
        "Outstanding! Your mathematical reasoning and logical thinking are exceptional! 🌟";
    } else if (accuracy >= 75) {
      message =
        "Excellent work! You show strong problem-solving abilities and mental agility! 💪";
    } else if (accuracy >= 60) {
      message =
        "Good job! You're building solid cognitive skills with consistent practice! 📈";
    } else {
      message =
        "Great effort! Every challenge strengthens your mind. Keep practicing! 🧠";
    }

    document.getElementById("final-message-text").textContent = message;
    modal.classList.remove("hidden");
  }

  showHint() {
    const hintBox = document.getElementById("hint-box");
    const hintText = document.getElementById("hint-text");

    hintText.textContent = this.currentQuestionData.hint;
    hintBox.classList.remove("hidden");
    this.hintsUsed++;

    // Disable hint button
    document.getElementById("hint-btn").disabled = true;
    document.getElementById("hint-btn").style.opacity = "0.5";
  }

  skipQuestion() {
    this.currentStreak = 0;
    this.recordQuestionTime();
    this.nextQuestion();
  }

  pauseGame() {
    this.isPaused = true;
    this.clearQuestionTimer();
    document.getElementById("pause-modal").classList.remove("hidden");
  }

  resumeGame() {
    this.isPaused = false;
    document.getElementById("pause-modal").classList.add("hidden");
    this.startQuestionTimer();
  }

  restartQuiz() {
    window.location.reload();
  }

  increaseDifficulty() {
    if (this.difficulty === "easy") this.difficulty = "medium";
    else if (this.difficulty === "medium") this.difficulty = "hard";

    this.restartQuiz();
  }

  startQuestionTimer() {
    this.timeLeft = 30;
    this.updateTimerDisplay();

    this.questionTimer = setInterval(() => {
      if (!this.isPaused) {
        this.timeLeft--;
        this.updateTimerDisplay();

        if (this.timeLeft <= 10) {
          document.getElementById("timer-display").classList.add("warning");
        }

        if (this.timeLeft <= 0) {
          this.skipQuestion();
        }
      }
    }, 1000);
  }

  clearQuestionTimer() {
    if (this.questionTimer) {
      clearInterval(this.questionTimer);
      this.questionTimer = null;
    }
  }

  resetQuestionTimer() {
    this.clearQuestionTimer();
    this.startQuestionTimer();
    document.getElementById("timer-display").classList.remove("warning");
    // Re-enable hint button
    document.getElementById("hint-btn").disabled = false;
    document.getElementById("hint-btn").style.opacity = "1";
  }

  updateTimerDisplay() {
    document.getElementById("question-timer").textContent = this.timeLeft;
  }

  recordQuestionTime() {
    const timeSpent = 30 - this.timeLeft;
    this.totalTime += timeSpent;
  }

  updateDisplay() {
    // Progress
    const progress = (this.currentQuestion / this.totalQuestions) * 100;
    document.getElementById("progress-fill").style.width = `${progress}%`;

    // Question counter
    document.getElementById("question-counter").textContent = `Question ${
      this.currentQuestion + 1
    } of ${this.totalQuestions}`;

    // Score
    document.getElementById(
      "score-display"
    ).textContent = `Score: ${this.score}`;

    // Stats
    const accuracy =
      this.currentQuestion > 0
        ? Math.round((this.correctAnswers / this.currentQuestion) * 100)
        : 100;
    document.getElementById("accuracy").textContent = `${accuracy}%`;

    const avgTime =
      this.currentQuestion > 0
        ? Math.round(this.totalTime / this.currentQuestion)
        : 0;
    document.getElementById("avg-time").textContent = `${avgTime}s`;

    document.getElementById("streak").textContent = this.currentStreak;

    // Difficulty
    document.getElementById("difficulty").textContent =
      this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
  }

  updateMotivationMessage() {
    const message =
      this.motivationalMessages[
        Math.floor(Math.random() * this.motivationalMessages.length)
      ];
    document.getElementById("motivation-text").textContent = message;
  }

  getQuestionTypeName(type) {
    const names = {
      operators: "Missing Operators",
      weights: "Weight Analysis",
      logic: "Logic Puzzle",
    };
    return names[type] || "Brain Challenge";
  }
}

// Initialize quiz when page loads
document.addEventListener("DOMContentLoaded", () => {
  new BrainPowerQuiz();
});
