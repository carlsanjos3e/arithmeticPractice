document.addEventListener('DOMContentLoaded', () => {
    const operationRadios = document.querySelectorAll('input[name="operation"]');
    const digitSelector = document.getElementById('num-digits');
    const divisionOptions = document.getElementById('division-options');
    const generateBtn = document.getElementById('generate-btn');
    const problemDisplay = document.getElementById('problem-display');

    // New elements for interaction
    const answerInputArea = document.getElementById('answer-input-area');
    const userAnswerInput = document.getElementById('user-answer');
    const checkAnswerBtn = document.getElementById('check-answer-btn');
    const answerArea = document.getElementById('answer-area'); // Correct answer display area
    const correctAnswerDisplay = document.getElementById('correct-answer-display'); // Paragraph for correct answer

    // New feedback elements
    const feedbackButtonsArea = document.getElementById('feedback-buttons-area');
    const gotItRightBtn = document.getElementById('got-it-right-btn');
    const couldntYetBtn = document.getElementById('couldnt-yet-btn');
    const quoteDisplayArea = document.getElementById('quote-display-area');
    const quoteText = document.getElementById('quote-text');

    let currentAnswer = null; // Variable to store the calculated correct answer

    // --- Configuration ---
    const motivationalQuotes = [
        "Keep trying! Every mistake helps you learn.",
        "You're doing great! Practice makes perfect.",
        "Don't give up! Math is a journey.",
        "Awesome effort! You're getting smarter every day.",
        "Challenges help us grow stronger. Keep going!",
        "Just one more try! You can do it.",
        "Learning is fun! You're building your math muscles.",
        "It's okay to find things tricky sometimes. That's how you learn!",
    ];

    // --- Helper Functions ---

    // Function to show/hide division options based on selected operation
    function toggleDivisionOptions() {
        const selectedOperation = document.querySelector('input[name="operation"]:checked').value;
        if (selectedOperation === 'divide') {
            divisionOptions.classList.remove('hidden');
        } else {
            divisionOptions.classList.add('hidden');
        }
        // Generate a new problem when the operation changes
        generateProblem();
    }

    // Function to generate a number with a specific number of digits
    function generateNumberByDigits(digits, allowZero = false) {
        if (digits <= 0) return 0;
        if (digits === 1) {
            return allowZero ? getRandomInt(0, 9) : getRandomInt(1, 9);
        }
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        return getRandomInt(min, max);
    }

    // Function to generate a random integer between min and max (inclusive)
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
         if (min > max) {
             [min, max] = [max, min];
         }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // --- Problem Generation ---

    function generateProblem() {
        const selectedOperation = document.querySelector('input[name="operation"]:checked').value;
        const numDigits = parseInt(digitSelector.value);
        let num1, num2, problemText;
        currentAnswer = null; // Reset answer

        // Hide all feedback and answer elements
        answerInputArea.classList.add('hidden');
        answerArea.classList.add('hidden');
        feedbackButtonsArea.classList.add('hidden');
        gotItRightBtn.classList.add('hidden');
        couldntYetBtn.classList.add('hidden');
        quoteDisplayArea.classList.add('hidden');
        quoteText.textContent = ''; // Clear quote text
        userAnswerInput.value = ''; // Clear user input


        // --- Problem Logic based on Operation ---
        switch (selectedOperation) {
            case 'add':
                num1 = generateNumberByDigits(numDigits, true);
                num2 = generateNumberByDigits(numDigits, true);
                currentAnswer = num1 + num2;
                problemText = `${num1} + ${num2} = ?`;
                break;

            case 'subtract':
                 let bigNum = generateNumberByDigits(numDigits + 1, true);
                 let smallNum = generateNumberByDigits(numDigits, true);

                 if (bigNum < smallNum) {
                     [bigNum, smallNum] = [smallNum, bigNum];
                 }

                 while (smallNum === 0) { // Avoid X - 0
                      smallNum = generateNumberByDigits(numDigits, true);
                      if (bigNum < smallNum) [bigNum, smallNum] = [smallNum, bigNum];
                 }

                 num1 = bigNum;
                 num2 = smallNum;
                 currentAnswer = num1 - num2;
                 problemText = `${num1} - ${num2} = ?`;
                 break;

            case 'multiply':
                const operand1Digits = Math.ceil(numDigits / 2);
                const operand2Digits = Math.floor(numDigits / 2) + (numDigits % 2);

                num1 = generateNumberByDigits(operand1Digits, operand1Digits > 1 ? true : false);
                num2 = generateNumberByDigits(operand2Digits, operand2Digits > 1 ? true : false);

                 while (num1 === 1 || num2 === 1 || num1 === 0 || num2 === 0) {
                     num1 = generateNumberByDigits(operand1Digits, operand1Digits > 1 ? true : false);
                     num2 = generateNumberByDigits(operand2Digits, operand2Digits > 1 ? true : false);
                 }

                currentAnswer = num1 * num2;
                problemText = `${num1} × ${num2} = ?`;
                break;

            case 'divide':
                const remainderOption = document.querySelector('input[name="remainder"]:checked').value;

                const maxQuotientForDivision = Math.pow(10, numDigits) - 1;
                const maxDivisorForDivision = Math.max(10, Math.pow(10, Math.ceil(numDigits / 2) -1 ));


                if (remainderOption === 'no') {
                    let quotient = getRandomInt(1, maxQuotientForDivision);
                    let divisor = getRandomInt(2, maxDivisorForDivision > 2 ? maxDivisorForDivision : 10);

                    num1 = divisor * quotient;
                    num2 = divisor;

                     while (num1 === 0 || (num1 === num2 && num1 !== 0)) {
                         quotient = getRandomInt(1, maxQuotientForDivision);
                         divisor = getRandomInt(2, maxDivisorForDivision > 2 ? maxDivisorForDivision : 10);
                         num1 = divisor * quotient;
                         num2 = divisor;
                     }

                    currentAnswer = quotient; // Store only the quotient for checking
                    problemText = `${num1} ÷ ${num2} = ?`;

                } else { // With remainder
                    let divisor = getRandomInt(2, maxDivisorForDivision + 10);
                    let quotient = getRandomInt(0, maxQuotientForDivision);
                    let remainder = getRandomInt(1, Math.max(1, divisor - 1));

                    num1 = divisor * quotient + remainder;
                    num2 = divisor;

                     while (num1 <= num2 || num2 < 2) {
                         divisor = getRandomInt(2, maxDivisorForDivision + 10);
                         quotient = getRandomInt(0, maxQuotientForDivision);
                         remainder = getRandomInt(1, Math.max(1, divisor - 1));
                         num1 = divisor * quotient + remainder;
                         num2 = divisor;
                     }

                    currentAnswer = { quotient: quotient, remainder: remainder }; // Store quotient and remainder
                    // Problem text prompts for quotient AND remainder
                    problemText = `${num1} ÷ ${num2} = ? remainder ?`;
                }
                break;
        }

        // Display the generated problem
        problemDisplay.textContent = problemText;

        // Show the input area after generating a problem
        answerInputArea.classList.remove('hidden');
        userAnswerInput.focus(); // Put cursor in the input field
    }

    // --- Answer Checking ---

    function checkAnswer() {
        const userAnswer = userAnswerInput.value.trim(); // Get user input and remove whitespace
        const selectedOperation = document.querySelector('input[name="operation"]:checked').value;
        let isCorrect = false;
        let correctAnswerText;

        // Handle different answer types
        if (selectedOperation === 'divide' && typeof currentAnswer === 'object') {
            // Division with remainder: Check only the quotient for simplicity of input
            const userQuotient = parseInt(userAnswer);
            if (!isNaN(userQuotient) && userQuotient === currentAnswer.quotient) {
                 isCorrect = true;
            }
             correctAnswerText = `Quotient: ${currentAnswer.quotient}, Remainder: ${currentAnswer.remainder}`;

        } else {
             // All other operations (including no-remainder division) expect a single number
             const parsedUserAnswer = parseFloat(userAnswer); // Use parseFloat for flexibility

             if (!isNaN(parsedUserAnswer) && parsedUserAnswer === currentAnswer) {
                 isCorrect = true;
             }
             correctAnswerText = currentAnswer;
        }

        // Display the correct answer regardless of correctness after checking
        correctAnswerDisplay.textContent = correctAnswerText;
        answerArea.classList.remove('hidden'); // Show the correct answer area

        // Hide the input area and show feedback buttons
        answerInputArea.classList.add('hidden');
        feedbackButtonsArea.classList.remove('hidden');

        // Show the appropriate feedback button
        if (isCorrect) {
            gotItRightBtn.classList.remove('hidden');
            couldntYetBtn.classList.add('hidden'); // Hide the other button
        } else {
            gotItRightBtn.classList.add('hidden'); // Hide the other button
            couldntYetBtn.classList.remove('hidden');
        }
    }

    // --- Feedback Actions ---

    function triggerConfetti() {
        // Confetti effect
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
         // Optionally trigger more confetti effects
         setTimeout(() => {
             confetti({
                 particleCount: 50,
                 spread: 80,
                 origin: { x: 0.2, y: 0.8 }
             });
         }, 100);
          setTimeout(() => {
             confetti({
                 particleCount: 50,
                 spread: 80,
                 origin: { x: 0.8, y: 0.8 }
             });
         }, 100);

         // Hide the "Got It Right" button after a moment
         setTimeout(() => {
             gotItRightBtn.classList.add('hidden');
             feedbackButtonsArea.classList.add('hidden'); // Hide the area too if both hidden
         }, 3000); // Hide after 3 seconds
    }

    function displayMotivationalQuote() {
        const randomIndex = getRandomInt(0, motivationalQuotes.length - 1);
        quoteText.textContent = motivationalQuotes[randomIndex];
        quoteDisplayArea.classList.remove('hidden');
        // Hide the "Couldn't Get It Yet" button
         couldntYetBtn.classList.add('hidden');
         // feedbackButtonsArea.classList.add('hidden'); // Area will hide if both buttons hidden
    }


    // --- Event Listeners ---
    operationRadios.forEach(radio => {
        radio.addEventListener('change', toggleDivisionOptions);
    });
    digitSelector.addEventListener('change', generateProblem);
    generateBtn.addEventListener('click', generateProblem);
    checkAnswerBtn.addEventListener('click', checkAnswer); // Listener for check button

    // Listeners for the feedback buttons
    gotItRightBtn.addEventListener('click', triggerConfetti);
    couldntYetBtn.addEventListener('click', displayMotivationalQuote);

    // Allow checking answer by pressing Enter in the input field
    userAnswerInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            checkAnswerBtn.click(); // Simulate button click
        }
    });


    // --- Initial Setup ---
    // Generate an initial problem when the page loads
    generateProblem();
});
