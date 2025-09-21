class MindfulMemoryGame {
  constructor() {
    this.gameBoard = document.getElementById("game-board");
    this.matchesDisplay = document.getElementById("matches");
    this.attemptsDisplay = document.getElementById("attempts");
    this.timerDisplay = document.getElementById("timer");
    this.encouragementText = document.getElementById("encouragement-text");

    this.cards = [];
    this.flippedCards = [];
    this.matches = 0;
    this.attempts = 0;
    this.gameTime = 0;
    this.timer = null;
    this.currentDifficulty = "easy";
    this.isPaused = false;
    this.gameStarted = false;

    this.encouragementMessages = [
      "You're doing wonderfully! Keep going! 🌟",
      "Great job! Each attempt brings you closer! 💪",
      "Remember to breathe and stay relaxed! 🌸",
      "You're making excellent progress! 🎯",
      "Stay positive and trust the process! ✨",
      "Every match is a small victory! 🏆",
      "You're building mental strength! 🧠",
      "Take your time - there's no rush! 🕊️",
    ];

    this.cardSymbols = {
      easy: ["🌸", "🌺", "🌻", "🌷", "🌹", "🌼"],
      medium: ["🌸", "🌺", "🌻", "🌷", "🌹", "🌼", "🦋", "🐛"],
      hard: [
        "🌸",
        "🌺",
        "🌻",
        "🌷",
        "🌹",
        "🌼",
        "🦋",
        "🐛",
        "🌿",
        "🍀",
        "🌱",
        "🌾",
      ],
    };

    this.initializeGame();
    this.bindEvents();
  }

  initializeGame() {
    this.createCards();
    this.renderBoard();
    this.updateStats();
    this.updateEncouragement();
  }

  bindEvents() {
    // Difficulty selection
    document.querySelectorAll(".difficulty-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".difficulty-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentDifficulty = e.target.dataset.level;
        this.resetGame();
      });
    });

    // Control buttons
    document
      .getElementById("new-game-btn")
      .addEventListener("click", () => this.resetGame());
    document
      .getElementById("pause-btn")
      .addEventListener("click", () => this.togglePause());
    document
      .getElementById("hint-btn")
      .addEventListener("click", () => this.showHint());
    document
      .getElementById("resume-btn")
      .addEventListener("click", () => this.togglePause());
    document.getElementById("play-again-btn").addEventListener("click", () => {
      document.getElementById("completion-modal").classList.add("hidden");
      this.resetGame();
    });
  }

  createCards() {
    const symbols = this.cardSymbols[this.currentDifficulty];
    const cardCount = this.getCardCount();
    const selectedSymbols = symbols.slice(0, cardCount / 2);

    this.cards = [...selectedSymbols, ...selectedSymbols]
      .map((symbol, index) => ({ symbol, id: index, matched: false }))
      .sort(() => Math.random() - 0.5); // Fisher-Yates shuffle
  }

  getCardCount() {
    const counts = { easy: 12, medium: 16, hard: 24 };
    return counts[this.currentDifficulty];
  }

  renderBoard() {
    this.gameBoard.className = `game-board ${this.currentDifficulty}`;
    this.gameBoard.innerHTML = "";

    this.cards.forEach((card, index) => {
      const cardElement = document.createElement("div");
      cardElement.className = "memory-card";
      cardElement.dataset.id = index;

      cardElement.innerHTML = `
                <div class="card-face card-back">?</div>
                <div class="card-face card-front">${card.symbol}</div>
            `;

      cardElement.addEventListener("click", () => this.flipCard(index));
      this.gameBoard.appendChild(cardElement);
    });
  }

  flipCard(index) {
    if (
      this.isPaused ||
      this.flippedCards.length >= 2 ||
      this.cards[index].matched ||
      this.flippedCards.includes(index)
    ) {
      return;
    }

    if (!this.gameStarted) {
      this.startTimer();
      this.gameStarted = true;
    }

    const cardElement = document.querySelector(`[data-id="${index}"]`);
    cardElement.classList.add("flipped");
    this.flippedCards.push(index);

    if (this.flippedCards.length === 2) {
      this.attempts++;
      this.updateStats();
      this.checkMatch();
    }
  }

  checkMatch() {
    const [firstIndex, secondIndex] = this.flippedCards;
    const firstCard = this.cards[firstIndex];
    const secondCard = this.cards[secondIndex];

    setTimeout(() => {
      if (firstCard.symbol === secondCard.symbol) {
        // Match found!
        this.handleMatch(firstIndex, secondIndex);
      } else {
        // No match
        this.handleMismatch(firstIndex, secondIndex);
      }

      this.flippedCards = [];
      this.updateEncouragement();
    }, 1000);
  }

  handleMatch(firstIndex, secondIndex) {
    this.cards[firstIndex].matched = true;
    this.cards[secondIndex].matched = true;
    this.matches++;

    const firstElement = document.querySelector(`[data-id="${firstIndex}"]`);
    const secondElement = document.querySelector(`[data-id="${secondIndex}"]`);

    firstElement.classList.add("matched");
    secondElement.classList.add("matched");

    this.updateStats();

    if (this.matches === this.cards.length / 2) {
      this.gameComplete();
    }
  }

  handleMismatch(firstIndex, secondIndex) {
    const firstElement = document.querySelector(`[data-id="${firstIndex}"]`);
    const secondElement = document.querySelector(`[data-id="${secondIndex}"]`);

    firstElement.classList.remove("flipped");
    secondElement.classList.remove("flipped");
  }

  gameComplete() {
    clearInterval(this.timer);

    const completionModal = document.getElementById("completion-modal");
    const completionMessage = document.getElementById("completion-message");
    const achievementStats = document.querySelector(".achievement-stats");

    const timeText = this.formatTime(this.gameTime);
    const accuracy = Math.round((this.matches / this.attempts) * 100);

    completionMessage.textContent = `You completed the ${this.currentDifficulty} level with incredible focus and patience!`;
    achievementStats.innerHTML = `
            <div>⏱️ Time: ${timeText}</div>
            <div>🎯 Matches: ${this.matches}</div>
            <div>📊 Accuracy: ${accuracy}%</div>
            <div>🧘‍♀️ You've strengthened your memory and mindfulness!</div>
        `;

    completionModal.classList.remove("hidden");
  }

  showHint() {
    if (this.isPaused) return;

    const unmatched = this.cards
      .map((card, index) => ({ card, index }))
      .filter((item) => !item.card.matched);

    if (unmatched.length >= 2) {
      const randomCard =
        unmatched[Math.floor(Math.random() * unmatched.length)];
      const cardElement = document.querySelector(
        `[data-id="${randomCard.index}"]`
      );

      cardElement.classList.add("flipped");
      setTimeout(() => {
        cardElement.classList.remove("flipped");
      }, 1500);

      this.updateEncouragement("Here's a gentle hint to help you along! 💡");
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    const pauseModal = document.getElementById("pause-modal");

    if (this.isPaused) {
      clearInterval(this.timer);
      pauseModal.classList.remove("hidden");
    } else {
      pauseModal.classList.add("hidden");
      if (this.gameStarted) {
        this.startTimer();
      }
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.gameTime++;
      this.updateStats();
    }, 1000);
  }

  updateStats() {
    this.matchesDisplay.textContent = this.matches;
    this.attemptsDisplay.textContent = this.attempts;
    this.timerDisplay.textContent = this.formatTime(this.gameTime);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  updateEncouragement(customMessage = null) {
    if (customMessage) {
      this.encouragementText.textContent = customMessage;
      return;
    }

    const message =
      this.encouragementMessages[
        Math.floor(Math.random() * this.encouragementMessages.length)
      ];
    this.encouragementText.textContent = message;
  }

  resetGame() {
    clearInterval(this.timer);
    this.cards = [];
    this.flippedCards = [];
    this.matches = 0;
    this.attempts = 0;
    this.gameTime = 0;
    this.gameStarted = false;
    this.isPaused = false;

    document.getElementById("pause-modal").classList.add("hidden");
    document.getElementById("completion-modal").classList.add("hidden");

    this.initializeGame();
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new MindfulMemoryGame();
});
