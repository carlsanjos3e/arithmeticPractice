document.addEventListener('DOMContentLoaded', () => {
    const operationRadios = document.querySelectorAll('input[name="operation"]');
    const divisionOptions = document.getElementById('division-options');
    const generateBtn = document.getElementById('generate-btn');
    const problemDisplay = document.getElementById('problem-display');

    // Function to show/hide division options based on selected operation
    function toggleDivisionOptions() {
        const selectedOperation = document.querySelector('input[name="operation"]:checked').value;
        if (selectedOperation === 'divide') {
            divisionOptions.classList.remove('hidden');
        } else {
            divisionOptions.classList.add('hidden');
        }
    }

    // Add event listeners to operation radio buttons
    operationRadios.forEach(radio => {
        radio.addEventListener('change', toggleDivisionOptions);
    });

    // Initial check when the page loads
    toggleDivisionOptions();

    // Function to generate a random integer between min and max (inclusive)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to generate a problem
    function generateProblem() {
        const selectedOperation = document.querySelector('input[name="operation"]:checked').value;
        let num1, num2, problemText;

        // Define reasonable ranges for numbers
        const maxOperand = 12; // Max value for individual numbers in simple ops
        const maxResultSimple = 20; // Max result for addition/subtraction
        const maxDivisor = 10; // Max divisor for division
        const maxQuotient = 10; // Max quotient for division

        switch (selectedOperation) {
            case 'add':
                num1 = getRandomInt(1, maxOperand);
                // Ensure result doesn't exceed maxResultSimple too often
                num2 = getRandomInt(1, maxResultSimple - num1);
                problemText = `${num1} + ${num2} = ?`;
                break;

            case 'subtract':
                // Generate two numbers and ensure num1 >= num2
                num1 = getRandomInt(5, maxResultSimple); // Start num1 a bit higher
                num2 = getRandomInt(1, num1);
                problemText = `${num1} - ${num2} = ?`;
                break;

            case 'multiply':
                num1 = getRandomInt(1, maxOperand > 10 ? 10 : maxOperand); // Keep multiplication operands a bit smaller
                num2 = getRandomInt(1, maxOperand > 10 ? 10 : maxOperand);
                problemText = `${num1} × ${num2} = ?`;
                break;

            case 'divide':
                const remainderOption = document.querySelector('input[name="remainder"]:checked').value;

                if (remainderOption === 'no') {
                    // Generate division with no remainder (a / b = c)
                    // Generate quotient (c) and divisor (b), then calculate a = b * c
                    let quotient = getRandomInt(1, maxQuotient);
                    let divisor = getRandomInt(1, maxDivisor);
                    num1 = divisor * quotient; // Dividend
                    num2 = divisor;             // Divisor
                    // Add a check to avoid simple cases like 1 * X or X * 1 for slightly better practice
                     while (num1 === num2 || num2 === 1) {
                         quotient = getRandomInt(1, maxQuotient);
                         divisor = getRandomInt(1, maxDivisor);
                         num1 = divisor * quotient;
                         num2 = divisor;
                     }
                    problemText = `${num1} ÷ ${num2} = ?`;

                } else { // With remainder
                    // Generate division with remainder (a = b * c + r)
                    // Generate divisor (b), quotient (c), and remainder (r)
                    let divisor = getRandomInt(2, maxDivisor); // Divisor must be at least 2 for remainder > 0
                    let quotient = getRandomInt(0, maxQuotient); // Quotient can be 0
                    let remainder = getRandomInt(1, divisor - 1); // Remainder must be between 1 and divisor-1
                    num1 = divisor * quotient + remainder; // Dividend
                    num2 = divisor;                          // Divisor
                    problemText = `${num1} ÷ ${num2} = ? remainder ?`;
                }
                break;
        }

        // Display the generated problem
        problemDisplay.textContent = problemText;
    }

    // Add event listener to the generate button
    generateBtn.addEventListener('click', generateProblem);

    // Generate an initial problem when the page loads (optional)
    // generateProblem();
});
