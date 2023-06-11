import con from '../config/config.js'
import tokenizer from '../tokenizer/tokenizer.js';
// Verifica se a resolução já existe no banco de dados
const verificarResolucaoExistente = (numero) => {
    return new Promise((resolve, reject) => {
      con.execute('SELECT COUNT(*) AS total FROM resolucoes WHERE numero = ?', [numero], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows[0].total > 0); // retorna true caso a resolução exista no banco
        }
      });
    });
  };

  const inserirResolucao = (ano, data, dataInsercao, reitor, texto, cabecalho, numero, link, email_usuario, wd) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO resolucoes (ano, data_publicacao, data_insercao, reitor, texto, cabecalho, numero, link, usuario, wd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      con.execute(query, [ano, data, dataInsercao, reitor, texto, cabecalho, numero, link, email_usuario, wd], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(console.log('cadastrou'));
        }
      });
    });
  };

  // Verifica se o termo já existe no banco de dados
const verificarTermoExistente = (termo) => {
    return new Promise((resolve, reject) => {
      con.execute('SELECT COUNT(*) AS total FROM termos WHERE term = ?', [termo], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows[0].total > 0);
        }
      });
    });
  };

  // Insere um novo termo no banco de dados
const inserirTermo = (termo) => {
    return new Promise((resolve, reject) => {

      con.execute(`INSERT INTO termos (term) VALUES (?)`, [termo], (error, rows, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(console.log('cadastrou termo'));
        }
      });
    });
  };

  // Obtém o ID do termo e da resolução a partir das consultas combinadas
const obterIdsTermoResolucao = (termo, numero) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT id FROM (SELECT id FROM termos WHERE term = ? UNION SELECT id FROM resolucoes WHERE numero = ?) AS combined_ids`;
      con.execute(query, [termo, numero], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  };

  // Insere o documento no banco de dados
const inserirDocumento = (idResolucao, idTermo, frequencia) => {
    console.log('idRes: '+idResolucao+' idTerm: '+idTermo)
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO documentos (id_resolucao, id_termo, frequencia) VALUES (?, ?, ?)`;
      con.execute(query, [idResolucao, idTermo, frequencia], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          //resolve((error) => res.send(500).json({'err': error}));
          resolve(rows);
        }
      });
    });
  };

  const cadastrarResolucao = async (req, res, next) => {
  
    //const { ano, data, reitor, texto, cabecalho, numero, link, email_usuario } = req.body;
    if (req.body.ano && req.body.data  && req.body.reitor  && req.body.texto  && req.body.cabecalho  && req.body.numero  && req.body.link  && req.body.email_usuario) {
        const { ano, data, reitor, texto, cabecalho, numero, link, email_usuario } = req.body;
        try {
        // Verifica se a resolução já existe no banco de dados
        const resolucaoExistente = await verificarResolucaoExistente(numero);    
    
        if (!resolucaoExistente) {
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Janeiro é o mês 0
            const ano1 = dataAtual.getFullYear();
            const dataInsercao = `${dia}/${mes}/${ano1}`;
        
            const result = tokenizer.tokenizer(texto);
            const dict = new Map();
        
            result.forEach(e => {
            if (!dict.has(e)) {
                dict.set(e, 1);
            } else {
                dict.set(e, dict.get(e) + 1);
            }
            });
        
            let wd = 0;
            dict.forEach((key, value) => {
                if (key > 0) {
                    wd += Math.pow(1 + Math.log(key), 2);
                }
            });
            wd = Math.sqrt(wd);
        
            // Insere a resolução no banco de dados
            await inserirResolucao(ano, data, dataInsercao, reitor, texto, cabecalho, numero, link, email_usuario, wd);
           
            // Insere os termos no banco de dados
            for (const [termo, frequencia] of dict.entries()) {
                const termoExistente = await verificarTermoExistente(termo);
            
                if (!termoExistente) {
                    console.log('nao existe o termo: ', termo)
                    await inserirTermo(termo);
                }  
   
            }            

            for (const [termo, frequencia] of dict.entries()) {  
                const rows = await obterIdsTermoResolucao(termo, numero);              
                const idTermo = rows[0].id;
                const idResolucao = rows[1].id;
                console.log(rows[0].id, rows[1].id)
            
                // Insere o documento no banco de dados
                await inserirDocumento(idResolucao, idTermo, frequencia);
            }
            res.status(201).send({
                message: 'Resolucao cadastrada com sucesso',
            });
        } else {
            res.status(409).json({ error: 'Erro, já existe esta resolução em nossa base de dados' });
        }
        
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao inserir dados' });
        }

    }else{
        res.status(400).json({ error: 'Params Required' });
    }
 };

 export default {cadastrarResolucao}