document.addEventListener("DOMContentLoaded", () => {
    let gridSize = 2; // Initial grid size
    let totalCards = gridSize * gridSize; // Total number of cards
    let cardsTurned = 0; // Counter for turned cards
    let selectedCard = null;
    let canFlip = true;
    let hearts = 5; // Initial number of hearts
    const maxHearts = 10; // Maximum number of hearts
    const cardValues = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', // Extend as needed
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', // Extend as needed
        'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3'       // Add more values as needed
    ]; // Array of card values

    const cardsContainer = document.querySelector(".cards"); // Container for cards
    const heartsContainer = document.querySelector(".hearts"); // Container for hearts (if applicable)

    // Function to generate card elements in a grid
    function generateCards() {
        if (totalCards % 2 !== 0) {
            totalCards--; // Reduce totalCards by 1 if odd
        }

        let shuffledValues = shuffleArray([...cardValues.slice(0, totalCards / 2), ...cardValues.slice(0, totalCards / 2)]);
        
        cardsContainer.innerHTML = ""; // Clear existing content

        for (let i = 0; i < totalCards; i++) {
            const card = document.createElement("div");
            card.classList.add("card");

            const cardInner = document.createElement("div");
            cardInner.classList.add("card-inner");

            const cardFront = document.createElement("div");
            cardFront.classList.add("card-front");

            const cardBack = document.createElement("div");
            cardBack.classList.add("card-back");
            cardBack.textContent = shuffledValues[i];

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);

            // Determine the correct row
            const rowIndex = Math.floor(i / gridSize);
            let row = cardsContainer.querySelector(`.cards-row:nth-child(${rowIndex + 1})`);

            // Create a new row if it doesn't exist
            if (!row) {
                row = document.createElement("div");
                row.classList.add("cards-row");
                cardsContainer.appendChild(row);
            }

            // Append the card to the current row
            row.appendChild(card);

            // Add click event listener
            card.addEventListener("click", () => handleCardClick(card));
        }
    }

    // Function to create heart elements (if applicable)
    function createHearts() {
        heartsContainer.innerHTML = "";
        for (let i = 0; i < hearts; i++) {
            const heart = document.createElement("div");
            heart.classList.add("heart");
            heart.innerHTML = "&#9829;";
            heartsContainer.appendChild(heart);
        }
    }

    // Shuffle function to randomize array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to flip all cards temporarily (if needed)
    function flipAllCards() {
        const cards = Array.from(document.querySelectorAll(".card"));
        cards.forEach(card => {
            card.classList.add("flipped");
        });
        setTimeout(() => {
            cards.forEach(card => {
                card.classList.remove("flipped");
            });
            canFlip = true; // Enable flipping after preview
        }, 5500); // 5.5 seconds delay before flipping back
    }

    // Function to handle card click
    function handleCardClick(card) {
        if (!canFlip || card.classList.contains("flipped")) {
            return; // Prevent flipping already flipped cards or during animation
        }

        if (hearts === 0) {
            return; // Prevent further gameplay if hearts are zero
        }

        if (selectedCard) {
            checkForMatch(card);
        } else {
            selectCard(card);
        }
        card.classList.toggle("flipped"); // Flip the card on click
    }

    // Function to handle selecting a card
    function selectCard(card) {
        flipSound.play(); // Play flip sound
        selectedCard = card;
    }

    // Function to check for a match
    function checkForMatch(card) {
        canFlip = false; // Disable flipping during animation
        if (selectedCard.querySelector(".card-back").textContent === card.querySelector(".card-back").textContent) {
            console.log("MATCH");
            matchSound.play(); // Play match sound
            cardsTurned += 2;
            if (cardsTurned === totalCards) {
                increaseGridAndHearts(); // All cards turned, increase grid size and hearts
            } 
            setTimeout(() => {
                selectedCard = null; // Reset selected card
                canFlip = true; // Enable flipping
            }, 1000); // Delay to show "MATCH" before resetting
        } else {
            flipSound.play(); // Play flip sound
            console.log("NO MATCH");
            setTimeout(() => {
                selectedCard.classList.remove("flipped");
                card.classList.remove("flipped");
                selectedCard = null; // Reset selected card
                canFlip = true; // Enable flipping
                flipSound.play(); // Play no match sound after both cards flip back
                removeHeart(); // Remove a heart
            }, 1000); // Delay to show "NO MATCH" before flipping back
        }
    }

    // Function to remove a heart
    function removeHeart() {
        hearts--;
        createHearts(); // Update hearts display

        // Check if game over (all hearts lost)
        if (hearts == 0) {
            gameOver();
        }
    }

    // Function to increase grid size and hearts
    function increaseGridAndHearts() {
        gridSize++;
        totalCards = gridSize * gridSize;
        cardsTurned = 0; // Reset turned cards counter

        if (hearts < maxHearts) {
            hearts++;
        }

        // Regenerate cards and hearts
        generateCards();
        createHearts();
        flipAllCards();
        canFlip = true; // Enable flipping after increasing grid and hearts
    }

    // Function to handle game over
    function gameOver() {
        // Display lose message
        window.alert("You lost! You made it " + (gridSize - 1) + " rounds.");
        location.reload();
    }

    // Flip sound effects
    const flipSound = new Audio("flip.wav");
    const matchSound = new Audio("match.wav");
    const noMatchSound = new Audio("no-match.wav"); // Add your no match sound file
    noMatchSound.playbackRate = 1.5; // Set playback rate to 1.5 for no match sound

    // Shuffle and generate cards on page load
    generateCards();
    createHearts();
    flipAllCards();
});