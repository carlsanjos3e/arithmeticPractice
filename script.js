document.addEventListener('DOMContentLoaded', () => {
    const operationRadios = document.querySelectorAll('input[name="operation"]');
    const digitSelector = document.getElementById('num-digits'); // Get the digit dropdown
    const divisionOptions = document.getElementById('division-options');
    const generateBtn = document.getElementById('generate-btn');
    const problemDisplay = document.getElementById('problem-display');
    const showAnswerBtn = document.getElementById('show-answer-btn'); // Get the show answer button
    const answerArea = document.getElementById('answer-area'); // Get the answer area div
    const answerDisplay = document.getElementById('answer-display'); // Get the paragraph for the answer

    let currentAnswer = null; // Variable to store the calculated answer

    // Function to show/hide division options based on selected operation
    function toggleDivisionOptions() {
        const selectedOperation = document.querySelector('input[name="operation"]:checked').value;
        if (selectedOperation === 'divide') {
            divisionOptions.classList.remove('hidden');
        } else {
            divisionOptions.classList.add('hidden');
        }
        // Also generate a new problem when the operation changes
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
         if (min > max) { // Should not happen with correct logic, but as a safeguard
             [min, max] = [max, min];
         }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to generate a problem
    function generateProblem() {
        const selectedOperation = document.querySelector('input[name="operation"]:checked').value;
        const numDigits = parseInt(digitSelector.value); // Get selected number of digits
        let num1, num2, problemText;
        currentAnswer = null; // Reset answer

        // Hide answer elements when a new problem is generated
        answerArea.classList.add('hidden');
        showAnswerBtn.classList.add('hidden');


        switch (selectedOperation) {
            case 'add':
                num1 = generateNumberByDigits(numDigits, true); // Allow 0 in operands
                num2 = generateNumberByDigits(numDigits, true);
                currentAnswer = num1 + num2;
                problemText = `${num1} + ${num2} = ?`;
                break;

            case 'subtract':
                 // Generate two numbers and ensure num1 >= num2
                 let bigNum = generateNumberByDigits(numDigits + 1, true); // Generate potentially one extra digit
                 let smallNum = generateNumberByDigits(numDigits, true);

                 // Ensure bigNum is greater than or equal to smallNum
                 if (bigNum < smallNum) {
                     [bigNum, smallNum] = [smallNum, bigNum]; // Swap if needed
                 }
                 // Add a safeguard to ensure a non-negative answer for basic practice
                 // While bigNum >= smallNum, smallNum might be 0 leading to trivial problems
                 // Let's regenerate if smallNum is 0 or the problem is too easy (e.g., X - 0)
                 while (smallNum === 0) {
                      smallNum = generateNumberByDigits(numDigits, true);
                      if (bigNum < smallNum) [bigNum, smallNum] = [smallNum, bigNum];
                 }

                 num1 = bigNum;
                 num2 = smallNum;
                 currentAnswer = num1 - num2;
                 problemText = `${num1} - ${num2} = ?`;
                 break;

            case 'multiply':
                // Generate operands such that the result is roughly numDigits or more
                // Generate operands with roughly numDigits / 2 digits
                const operand1Digits = Math.ceil(numDigits / 2);
                const operand2Digits = Math.floor(numDigits / 2) + (numDigits % 2); // Distribute digits

                num1 = generateNumberByDigits(operand1Digits, operand1Digits > 1 ? true : false); // Allow 0 if > 1 digit
                num2 = generateNumberByDigits(operand2Digits, operand2Digits > 1 ? true : false); // Allow 0 if > 1 digit

                 // Avoid trivial cases like X * 1 or 1 * X
                 while (num1 === 1 || num2 === 1 || num1 === 0 || num2 === 0) {
                     num1 = generateNumberByDigits(operand1Digits, operand1Digits > 1 ? true : false);
                     num2 = generateNumberByDigits(operand2Digits, operand2Digits > 1 ? true : false);
                 }

                currentAnswer = num1 * num2;
                problemText = `${num1} × ${num2} = ?`;
                break;

            case 'divide':
                const remainderOption = document.querySelector('input[name="remainder"]:checked').value;

                // For division, it's easier to control difficulty by generating quotient and divisor
                // Let the dividend (num1) size be influenced by the number of digits chosen.
                const maxQuotientForDivision = Math.pow(10, numDigits) - 1; // Quotient can be up to numDigits
                const maxDivisorForDivision = Math.max(10, Math.pow(10, Math.ceil(numDigits / 2) -1 )); // Divisor up to ~ half digits, min 10


                if (remainderOption === 'no') {
                    // Generate division with no remainder (a / b = c)
                    // Generate quotient (c) and divisor (b), then calculate a = b * c
                    let quotient = getRandomInt(1, maxQuotientForDivision);
                    let divisor = getRandomInt(2, maxDivisorForDivision > 2 ? maxDivisorForDivision : 10); // Divisor >= 2


                    // Calculate dividend (a)
                    num1 = divisor * quotient; // Dividend
                    num2 = divisor;             // Divisor

                     // Regenerate if dividend is 0, divisor is 1 (avoided by range),
                     // or if the problem is just X / X = 1
                     while (num1 === 0 || (num1 === num2 && num1 !== 0)) {
                         quotient = getRandomInt(1, maxQuotientForDivision);
                         divisor = getRandomInt(2, maxDivisorForDivision > 2 ? maxDivisorForDivision : 10);
                         num1 = divisor * quotient;
                         num2 = divisor;
                     }

                    currentAnswer = quotient;
                    problemText = `${num1} ÷ ${num2} = ?`;

                } else { // With remainder
                    // Generate division with remainder (a = b * c + r)
                    // Generate divisor (b), quotient (c), and remainder (r)
                    let divisor = getRandomInt(2, maxDivisorForDivision + 10); // Divisor >= 2, slightly larger range
                    let quotient = getRandomInt(0, maxQuotientForDivision); // Quotient can be 0
                    let remainder = getRandomInt(1, Math.max(1, divisor - 1)); // Remainder between 1 and divisor-1

                    num1 = divisor * quotient + remainder; // Dividend
                    num2 = divisor;                          // Divisor

                     // Regenerate if dividend is not greater than divisor, or divisor < 2
                     while (num1 <= num2 || num2 < 2) {
                         divisor = getRandomInt(2, maxDivisorForDivision + 10);
                         quotient = getRandomInt(0, maxQuotientForDivision);
                         remainder = getRandomInt(1, Math.max(1, divisor - 1));
                         num1 = divisor * quotient + remainder;
                         num2 = divisor;
                     }

                    currentAnswer = { quotient: quotient, remainder: remainder }; // Store quotient and remainder
                    problemText = `${num1} ÷ ${num2} = ? remainder ?`;
                }
                break;
        }

        // Display the generated problem
        problemDisplay.textContent = problemText;

        // Show the 'Show Answer' button after generating a problem
        showAnswerBtn.classList.remove('hidden');
    }

    // Function to display the answer
    function showAnswer() {
        if (currentAnswer !== null) {
            let answerText;
            if (typeof currentAnswer === 'object' && currentAnswer !== null && 'quotient' in currentAnswer && 'remainder' in currentAnswer) {
                // Handle division with remainder answer
                answerText = `Quotient: ${currentAnswer.quotient}, Remainder: ${currentAnswer.remainder}`;
            } else {
                // Handle simple addition, subtraction, multiplication, no-remainder division
                answerText = currentAnswer;
            }
            answerDisplay.textContent = answerText;
            answerArea.classList.remove('hidden'); // Show the answer area
            showAnswerBtn.classList.add('hidden'); // Hide the show answer button
        }
    }


    // Add event listeners
    operationRadios.forEach(radio => {
        radio.addEventListener('change', toggleDivisionOptions);
    });
    digitSelector.addEventListener('change', generateProblem); // Generate new problem when digits change
    generateBtn.addEventListener('click', generateProblem);
    showAnswerBtn.addEventListener('click', showAnswer); // Add listener to show answer button

    // Generate an initial problem when the page loads
    generateProblem();
});
