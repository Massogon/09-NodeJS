const inquirer = require('inquirer').default;
const fs = require('fs');

// List of available licenses with badges and links
const licenses = [
    {
        name: 'MIT License',
        badge: '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)',
    },
    {
        name: 'Apache License 2.0',
        badge: '[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)',
    },
    // Add more licenses here if needed
];

// Defining questions for user input
const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'What is the title of your project?',
    },
    {
        type: 'input',
        name: 'description',
        message: 'Write a short description of your project:',
    },
    {
        type: 'input',
        name: 'installation',
        message: 'How do you install your project?',
    },
    {
        type: 'input',
        name: 'usage',
        message: 'How do you use your project?',
    },
    {
        type: 'input',
        name: 'contributing',
        message: 'How can others contribute to your project?',
    },
    {
        type: 'input',
        name: 'githubUsername',
        message: 'What is your GitHub username?',
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is your email address for contributions?',
    },
    {
        type: 'input',
        name: 'tests',
        message: 'How do you test your project?',
    },
    {
        type: 'list',
        name: 'license',
        message: 'Choose a license for your project:',
        choices: licenses.map(license => license.name),
    },
    {
        type: 'confirm',
        name: 'toc',
        message: 'Would you like to include a Table of Contents?',
        default: false,
    },
    {
        type: 'input',
        name: 'faq',
        message: 'Add FAQ (use ":" to separate question and answer, and ";" to separate multiple FAQs):',
    },
];

// Prompt user for input
inquirer.prompt(questions).then((answers) => {
    // Find the selected license
    const selectedLicense = licenses.find(license => license.name === answers.license);

    // Generate Table of Contents if the user opts for it
    const tableOfContents = answers.toc ? `
## Table of Contents
1. [Description](#description)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Contributing](#contributing)
5. [Tests](#tests)
6. [License](#license)
7. [FAQ](#faq)
` : '';

    // Process the FAQ input and format it
    const faqEntries = answers.faq.split(';').map((entry, index) => {
        const [question, answer] = entry.split(':');
        if (question && answer) {
            return `**Q${index + 1}: ${question.trim()}**

**A${index + 1}: ${answer.trim()}**`;
        } else {
            return `**Q${index + 1}: Invalid entry**

**A${index + 1}: Please provide both question and answer in the format 'question:answer'.**`;
        }
    }).join('\n\n');

    // Format GitHub username as a hyperlink
    const githubLink = answers.githubUsername ? `[@${answers.githubUsername}](https://github.com/${answers.githubUsername})` : '';

    // Build the contributing section
    const contributingSection = `${answers.contributing}
${githubLink ? `\nFor contributions, please visit ${githubLink}.` : ''}
${answers.email ? `\nYou can also contact me at [${answers.email}](mailto:${answers.email})` : ''}`;

    // Generate README content
    const readmeContent = `${selectedLicense.badge || ''}

# ${answers.title}

${tableOfContents}

## Description
${answers.description}

## Installation
${answers.installation}

## Usage
${answers.usage}

## Contributing
${contributingSection}

## Tests
${answers.tests}

## License
This project is licensed under the ${answers.license}.

## FAQ
${faqEntries}
`;

    // Write the README content to a README.md file
    fs.writeFile('README.md', readmeContent, (err) => {
        if (err) {
            console.error('Error writing README file:', err);
            return;
        }
        console.log('README.md has been generated successfully!');
    });
});
