-- DROP DATABASE IF EXISTS library;
CREATE DATABASE library;

CREATE TABLE books (
   id serial PRIMARY KEY,
   title VARCHAR (225) NOT NULL,
   author VARCHAR (225) NOT NULL,
   description VARCHAR (224) NOT NULL
);

INSERT INTO books (title, author, description) 
VALUES ('Anne of Green Gables', 'Lucy M. Montgomery', 'Orphan girl finds a home.');

INSERT INTO books (title, author, description) 
VALUES ('Metamorphosis', 'Franz Kafka', 'Man turns in to a bug.');
