const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'resolucoesuefs'
})

const cadastrarResolucao = async (req, res, next) => {
    const { ano, data, reitor, texto, cabecalho, numero, link, email_usuario } = req.body;
    console.log(ano, data, reitor, texto, cabecalho, numero, link, email_usuario)
    console.log((ano))
    if (ano != '' && data != '' && reitor != '' && texto != '' && cabecalho != '' && numero != '' && link != '' && email_usuario) {
        
        try {
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Janeiro é o mês 0
            const ano1 = dataAtual.getFullYear();
            const dataInsercao = `${dia}/${mes}/${ano1}`;
            const query = `
            INSERT INTO resolucoes (ano, data_publicacao, data_insercao, reitor, texto, cabecalho, numero, link, usuario)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;            
            con.execute(query, [ano, data, dataInsercao, reitor, texto, cabecalho, numero, link, email_usuario]);

            res.status(200).send({
                message: 'Resolucao cadastrada com sucesso'
            })
            con.end();
        }catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao inserir dados' });
            con.end();
        }
        
    } else {
        con.end();
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    
};

export default {cadastrarResolucao}