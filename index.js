import prompts from 'prompts';
import chalk from 'chalk';
import { randomInt } from 'crypto';

const maxAttempts = 3;

async function playGame() {
  const secretNumber = randomInt(1, 10 + 1);

  // Title, Instructions and Rules
  console.log(chalk.magenta.bold(' GUESS THE NUMBER!'));
  console.log(chalk.cyan('─'.repeat(35)));
  console.log(`Guess a number between 1 and 10.`);
  console.log(chalk.yellow(`You have ${maxAttempts} attempts!`));
  console.log('');

  // Asks the player to guess
  const response = await prompts({
    type: 'text',
    name: 'guess',
    message: chalk.bold(`Attempt 1/${maxAttempts}: Enter your guess`),
  });

  console.log(`You entered: ${response.guess}`);
}

playGame();