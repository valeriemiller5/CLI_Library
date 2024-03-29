require('dotenv').config();
const chalk = require("chalk");
const inquirer = require("inquirer");
//Set up PostgreSQL database
//====================================
const pg = require("pg");
const connectionString = process.env.connectionString;
const pgClient = new pg.Client(connectionString);
pgClient.connect(function (err) {
  if (err) throw err;
  startProgram();
});
//====================================


console.log(chalk.magentaBright.bold("Welcome to Your Library!"));
function startProgram() {
  inquirer
    .prompt([
      {
        name: "menu",
        type: "rawlist",
        message: chalk.cyan("====== Book Manager ======"),
        choices: ["View All Books", "Add a Book", "Edit a Book", "Search for a Book", "Remove Book from Library", "Save and Exit"],
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
        case "Remove Book from Library":
          removeBook();
          break;
        case "Save and Exit":
          pgClient.end();
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

      res.rows.forEach(function (book) {
        results.id.push(book.id);
        results.title.push(book.title);
        results.author.push(book.author);
        results.description.push(book.description);
      });

      // console.log(results);

      inquirer
        .prompt([
          {
            name: "chooseBook",
            type: "rawlist",
            choices: function () {
              var choiceArray = [];
              for (let i = 0; i < results.id.length; i++) {
                choiceArray.push(results.title[i]);
              }
              return choiceArray;
            },
            message: chalk.greenBright("====== View Books ======")
          }
        ]).then(function (selection) {
          for (let i = 0; i < results.id.length; i++) {
            if (selection.chooseBook === results.title[i]) {
              // console.log(selection.chooseBook);
              console.log(chalk.yellowBright(`==========================
ID: ${results.id[i]}
Title: ${results.title[i]}
Author: ${results.author[i]}
Description: ${results.description[i]}
==========================`));
            }
          };
          restart();
        });
    });
  };
};

function addBook() {
  console.log(chalk.greenBright("Add a book:"));
  inquirer
    .prompt([
      {
        name: "addtitle",
        type: "input",
        message: "Please enter the title for this book:"
      },
      {
        name: "addauthor",
        type: "input",
        message: "Please enter the author of this book:"
      },
      {
        name: "adddescription",
        type: "input",
        message: "Please enter the title for this book:"
      }
    ]).then(function (entry) {
      console.log(entry.addtitle + ", " + entry.addauthor + ", " + entry.adddescription);
      pgClient.query(`INSERT INTO books (title, author, description) VALUES ('${entry.addtitle}', '${entry.addauthor}', '${entry.adddescription}');`, function (err, res) {
        if (err) throw err;
        restart();
      })
    })
};

function editBook() {
  console.log(chalk.greenBright("Edit existing book:"));
  inquirer
    .prompt([
      {
        name: "changeBook",
        type: "input",
        message: "Enter the ID of the book you would like to update"
      }
    ]).then(function (entry) {
      // console.log(entry.changeBook);
      pgClient.query("SELECT * FROM books", function (err, res) {
        if (err) throw err;

        let results = {
          id: [],
          title: [],
          author: [],
          description: []
        };

        res.rows.forEach(function (book) {
          results.id.push(book.id);
          results.title.push(book.title);
          results.author.push(book.author);
          results.description.push(book.description);
        });

        for (let i = 0; i < results.id.length; i++) {
          if (entry.changeBook == results.id[i]) {
            console.log(`
              ID: ${results.id[i]}
              Title: ${results.title[i]}
              Author: ${results.author[i]}
              Description: ${results.description[i]}
            `)

            inquirer
              .prompt([
                {
                  name: "edit",
                  type: "confirm",
                  message: "Would you like to edit this book?",
                  default: true
                }
              ]).then(function (data) {
                if (data.edit) {
                  inquirer
                    .prompt([
                      {
                        name: "editChoices",
                        type: "list",
                        choices: ["title", "author", "description"],
                        message: "Which section would you like to edit?"
                      }
                    ]).then(function (change) {
                      console.log(change.editChoices);
                      inquirer
                        .prompt([
                          {
                            name: "newChange",
                            type: "input",
                            message: "Enter your new changes:"
                          }
                        ]).then(function (update) {
                          pgClient.query(`UPDATE books SET ${change.editChoices} = '${update.newChange}' WHERE id = ${results.id[i]};`, function (err, res) {
                            if (err) throw err;
                            restart();
                          });
                        })
                    })
                } else {
                  restart();
                }
              })
          }
        }
      })
    })
};

function searchBooks() {
  console.log(chalk.cyanBright("====== Search Books ======"));
  console.log(chalk.greenBright("Enter one or more key words for the book you are searching for:"));
  inquirer
    .prompt([
      {
        name: "search",
        type: "input",
        message: "Search:"
      }
    ]).then(function (lookup) {
      // console.log(lookup.search);
      pgClient.query(`SELECT * FROM books`, function (err, res) {
        if (err) throw err;

        let results = {
          id: [],
          title: [],
          author: [],
          description: []
        };

        res.rows.forEach(function (book) {
          results.id.push(book.id);
          results.title.push(book.title);
          results.author.push(book.author);
          results.description.push(book.description);
        });

        var found = true;

        for (let i = 0; i < results.id.length; i++) {
          let databaseTitle = results.title[i].split(" ");
          let lowercaseTitle = results.title[i].toLowerCase().split(" ");
          found = false;
          if (databaseTitle.includes(lookup.search) || lowercaseTitle.includes(lookup.search)) {
            console.log(chalk.cyanBright("The following book(s) match your search. \nFor more information, enter the book ID, or press <enter> to go back to the main menu"));
            console.log(chalk.magenta.bold(`${results.id[i]}: ${results.title[i]}`));
            found = true;
            inquirer
              .prompt([
                {
                  name: "bookid",
                  type: "input",
                  message: "Enter book ID:"
                }
              ]).then(function (find) {
                if (find.bookid == results.id[i]) {
                  console.log(`
                    ID: ${results.id[i]}
                    Title: ${results.title[i]}
                    Author: ${results.author[i]}
                    Description: ${results.description[i]}
                  `)
                }
                restart();
              })
          } else if (res.keyCode === 13) {
            found = true;
            restart();
          }
        }
        if (found === false) {
          setTimeout(function () {
            console.log(chalk.magenta("Your search could not be found."))
            restart();
          }, 10000)
        }
      })
    })
};

function removeBook() {
  console.log(chalk.redBright("Caution: You are about to remove information from the library:"))
  console.log(chalk.redBright("====== Remove Books ======"))
  inquirer
    .prompt([
      {
        name: "remove",
        type: "input",
        message: chalk.yellowBright("Enter the ID of the book you wish to remove.  \nIf you wish to cancel this request, enter 0:")
      }
    ]).then(function (response) {
      console.log(response.remove);
      pgClient.query(`DELETE FROM books WHERE id = ${response.remove};`, function (err, res) {
        if (err) throw err;
        restart();
      })
    })
};

function restart() {
  inquirer
    .prompt([
      {
        name: "confirm",
        type: "confirm",
        message: "Would you like to return to the main menu?",
        default: true
      }
    ]).then(function (end) {
      if (end.confirm) {
        return startProgram();
      } else {
        pgClient.end();
        console.log(chalk.magenta("Thank you for visiting the library!  Please come again soon!"));
        return false;
      }
    });
};