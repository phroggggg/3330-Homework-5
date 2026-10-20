import prompts from 'prompts';
import chalk from 'chalk';
import { randomInt } from 'crypto';
import fs from 'fs';

const maxAttempts = 3;

fs.writeFileSync('output.txt', ''); // start each game with a fresh log

function output(message, colorFn = (text) => text) {
  console.log(colorFn(message));
  fs.appendFileSync('output.txt', message + '\n');
}

function validateGuess(input) {
  const text = String(input ?? '').trim();

  // a. Reject empty input
  if (text === '') {
    throw new Error('A guess is required.');
  }

  // b. Reject non-numeric input and decimal values
  const value = Number(text);
  if (!Number.isInteger(value)) {
    throw new Error('Guess must be a whole number.');
  }

  // c. Reject negative and zero values
  if (value < 1) {
    throw new Error('Guess must be at least 1.');
  }

  // d. Reject numbers above the maximum threshold
  if (value > 10) {
    throw new Error('Guess cannot exceed 10.');
  }

  return value;
}

async function playGame() {
  const secretNumber = randomInt(1, 10 + 1);
  let won = false;
  
  // Title, Instructions and Rules
  output(' GUESS THE NUMBER!', chalk.magenta.bold);
  output('─'.repeat(35), chalk.cyan);
  output('Guess a number between 1 and 10.');
  output(`You have ${maxAttempts} attempts!`, chalk.yellow);
  output('');

  // Asks the player to guess
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await prompts({
      type: 'text',
      name: 'guess',
      message: chalk.bold(`Attempt ${attempt}/${maxAttempts}: Enter your guess`),
    });

    // Player pressed Ctrl+C
    if (response.guess === undefined) {
      output('Game cancelled.', chalk.gray);
      return;
    }

    try {
      const guess = validateGuess(response.guess);
      fs.appendFileSync('output.txt', `Attempt ${attempt}/${maxAttempts}: guess = ${guess}\n`);

      if (guess === secretNumber) {
        output(`Correct! You guessed the number ${secretNumber} in ${attempt} attempt(s)!`, chalk.green.bold);
        won = true;
        break;
      } else if (guess < secretNumber) {
        output('Too low!', chalk.yellow);
      } else {
        output('Too high!', chalk.yellow);
      }
    } catch (error) {
      // Validation errors don't crash the game; they use up the attempt
      output(error.message, chalk.red);
    }

    output('');
  }

  if (!won) {
    output('GAME OVER!', chalk.redBright.bold);
    output(`The secret number was ${secretNumber}.`);
  }

  output('');
  output('Thanks for playing!', chalk.magenta.bold);
}

playGame();