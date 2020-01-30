require("dotenv");
const chalk = require("chalk");
const inquirer = require("inquirer");
//Set up PostgreSQL database
//====================================
const pg = require("pg");
const connectionString = process.env.connectionString;
const pgClient = new pg.Client(connectionString);
pgClient.connect();
//====================================

//TEST POSTGRESQL CONNECTION
// function test() {
//   pgClient.query("SELECT * FROM books", function(err, res) {
//     if (err) throw err;
//Index 0 seeder - Anne of Green Gables
//     console.log(res.rows[0].title);
//Index 1 seeder - Metamorphosis
//     console.log(res.rows[1].title);
//   })
// }

// test();

// Chalk Test
console.log(chalk.magentaBright.bold("Welcome to Your Library!"));

inquirer
  .prompt([
    {
      name: "menu",
      type: "rawlist",
      message: chalk.cyan("====== Book Manager ======"),
      choices: ["View All Books", "Add a Book", "Edit a Book", "Search for a Book", "Save and Exit"],
    }
  ]).then(function (entry) {
    switch (entry.menu) {
      case "View All Books":
        viewBooks();
        break;
      case "Add a Book":
        addBook();
        break;
      case "Edit a Book":
        editBook();
        break;
      case "Search for a Book":
        searchBooks();
        break;
      case "Save and Exit":
        return console.log(chalk.magenta("Thank you for visiting the library!  Please come again soon!"));
    }
  });

function viewBooks() {
  console.log(chalk.greenBright("Books Currently in Library:"));
  pgClient.query("SELECT * FROM books", function (err, res) {
    if (err) throw err;

    let results = {
      id: [],
      title: [],
      author: [],
      description: []
    };

    res.rows.forEach(function(book) {
      results.id.push(book.id);
      results.title.push(book.title);
      results.author.push(book.author);
      results.description.push(book.description);
    });

    console.log(results);
  });
};

function addBook() {
  console.log(chalk.bgGreenBright("Add a book"));
};

function editBook() {
  console.log(chalk.bgBlackBright("Edit existing book"));
};

function searchBooks() {
  console.log(chalk.bgYellow("Search for a book"));
};