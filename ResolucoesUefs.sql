CREATE DATABASE ResolucoesUefs;

USE ResolucoesUefs;

CREATE TABLE TERMOS (
  id INT NOT NULL AUTO_INCREMENT,
  term UNIQUE VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE RESOLUCOES (
  id INT NOT NULL AUTO_INCREMENT,
  ano VARCHAR(50),
  orgao VARCHAR(100),
  descricao VARCHAR(255),
  numero VARCHAR(50),
  link VARCHAR(255),
  usuario VARCHAR(100),
  PRIMARY KEY (id)
);

-- tabela relacionando resoluções e termos
CREATE TABLE DOCUMENTOS (
  id_resolucao INT,
  id_termo INT,
  frequencia INT NOT NULL,
  wd FLOAT NOT NULL,
  FOREIGN KEY (id_resolucao) REFERENCES RESOLUCOES(id),
  FOREIGN KEY (id_termo) REFERENCES TERMOS(id)
);