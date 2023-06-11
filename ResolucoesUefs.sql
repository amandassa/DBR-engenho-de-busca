CREATE DATABASE resolucoesuefsdb;

USE resolucoesuefsdb;

CREATE TABLE TERMOS (
  id INT NOT NULL AUTO_INCREMENT,
  term VARCHAR(255) UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

-- ALTER TABLE RESOLUCOES ADD CONSTRAINT UC_RESOLUCOES UNIQUE (numero); 

CREATE TABLE RESOLUCOES (
  id INT NOT NULL AUTO_INCREMENT,
  ano VARCHAR(50),
  data_insercao VARCHAR(50),
  data_publicacao VARCHAR(50),
  reitor VARCHAR(100),
  texto VARCHAR(255),
  cabecalho VARCHAR(100),
  numero VARCHAR(50) UNIQUE,
  link VARCHAR(255),
  usuario VARCHAR(100),
  wd FLOAT NOT NULL,
  PRIMARY KEY (id)
);

-- tabela relacionando resoluções e termos
CREATE TABLE DOCUMENTOS (
  id INT NOT NULL AUTO_INCREMENT,
  id_resolucao INT,
  id_termo INT,
  frequencia INT NOT NULL,
  FOREIGN KEY (id_resolucao) REFERENCES RESOLUCOES(id),
  FOREIGN KEY (id_termo) REFERENCES TERMOS(id),
  PRIMARY KEY (id)
);