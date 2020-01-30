DROP DATABASE IF EXISTS library;
CREATE DATABASE library;
USE library;

CREATE TABLE books {
    item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
	description VARCHAR(100) NOT NULL,
	PRIMARY KEY(item_id): 
};

INSERT INTO book (title, author, description) 
VALUE ("Anne of Green Gables", "Lucy M. Montgomery", "Orphan girl finds a home.");

INSERT INTO book (title, author, description) 
VALUE ("Metamorphosis", "Franz Kafka", "Man turns in to a bug.");
