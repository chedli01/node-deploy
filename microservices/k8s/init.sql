-- init.sql
CREATE DATABASE IF NOT EXISTS myapp;

USE authdb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100)
);

INSERT INTO users (name) VALUES ('Alice'), ('Bob');
