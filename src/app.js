const fileUpload = require('express-fileupload')
const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(fileUpload({preserveExtension: true}))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

// conecta o banco
//mongoose.connect('mongodb+srv://root:root@linhas-de-onibus-db.qewaxyf.mongodb.net/?retryWrites=true&w=majority');
//mongoose.connect('mongodb+srv://amandassa504:TsxhnYwomqFZCAh6@linhas.xgtz8ps.mongodb.net');


// carrega os Models
//const Linha = require('./models/linha');
// carrega as Rotas
const indexRoutes = require('./routes/index-routes')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



app.use('/', indexRoutes);
//app.use('/linha', linhaRoutes);

module.exports = app;