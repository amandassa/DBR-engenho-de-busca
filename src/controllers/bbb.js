import con from '../config/config.js'
import tokenizer from '../tokenizer/tokenizer.js';



const cadastrarResolucao = async (req, res, next) => {
    
    const { ano, data, reitor, texto, cabecalho, numero, link, email_usuario } = req.body;
    if (ano != '' && data != '' && reitor != '' && texto != '' && cabecalho != '' && numero != '' && link != '' && email_usuario) {
        // con.execute('SELECT COUNT(*) AS total FROM resolucoes WHERE numero = ?', [numero], 
        //         function(error, rows, fields) {
        //             if(error){
        //                 res.status(401).send({
        //                     message: error
        //                 })
        //             }

        //             if (rows[0].total === 0) { // Se não existir a resolução prossegue...
                        try {
                            const dataAtual = new Date();
                            const dia = String(dataAtual.getDate()).padStart(2, '0');
                            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Janeiro é o mês 0
                            const ano1 = dataAtual.getFullYear();
                            const dataInsercao = `${dia}/${mes}/${ano1}`;
                            const query = `INSERT INTO RESOLUCOES (ano, data_publicacao, data_insercao, reitor, texto, cabecalho, numero, link, usuario, wd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;            
                           
                            const result = tokenizer.tokenizer(texto)   
                            
                            const dict = new Map()
                
                            result.forEach(e => {
                                if(!dict.has(e)){
                                    dict.set(e, 1)
                                }else {
                                    dict.set(e, dict.get(e)+1)
                                }              
                            })
                            
                            const termosQ = `INSERT INTO TERMOS (term) VALUES (?)`;
                            let wd = 0;
                            dict.forEach((key, value) => {
                               console.log('Key: '+key+' Value: '+value);
                                if (key > 0) {
                                    wd += Math.pow(1 + Math.log(key), 2);
                                }
                
                                console.log('buscando: ', value)
                                con.execute('SELECT COUNT(*) AS total FROM termos WHERE term = ?', [value], 
                                function(error, rows, fields) {
                                    if(error) {
                                        console.log('erroooooooo -----------------------', error)
                                    }
                                    if(rows[0].total == 0) {
                                        con.execute(termosQ, [value], (error, rows, fields) => {
                                            if(error){
                                                console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', error)
                                            }

                                            console.log(rows)
                                        })
                                        console.log("Termo inserido", value)
                                    }
                                }) 
                                
                            });
                            //console.log('-------------> ', wd);
                            wd = Math.sqrt(wd);
                            //console.log('-------------> ', wd);
                            
                            con.execute(query, [ano, data, dataInsercao, reitor, texto, cabecalho, numero, link, email_usuario, wd],  (error, rows, fields) => {
                                if(error) {
                                    res.status(401).send({
                                        message: error
                                    })
                                }
                
                            });
                            
                            dict.forEach((frequencia, termo) => {
                                //console.log('termo: '+termo+' Freq: '+frequencia);
                
                
                                con.execute('SELECT id FROM (SELECT id FROM TERMOS WHERE term = ? UNION SELECT id FROM RESOLUCOES WHERE numero = ?) AS combined_ids', [termo, numero], (error, rows, fields) => {
                                    if (error) {
                                        res.status(401).send({
                                            message: error
                                        })
                                    } else {
                                        console.log('Rows: ', rows)
                                        if(rows.length == 2 ) {
                                            var idTermo = rows[0].id
                                            var idResolucao = rows[1].id
                                        }
                                        
                                        con.execute('INSERT INTO documentos (id_resolucao, id_termo, frequencia) VALUES (?, ?, ?)', [idResolucao, idTermo, frequencia])
                                    }
                                  })               
                            });                
                
                            res.status(200).send({
                                message: 'Resolucao cadastrada com sucesso',
                                dictaa: Object.fromEntries(dict)
                            })

                        }catch (error) {
                            console.error(error);
                            res.status(500).json({ error: 'Erro ao inserir dados' });
                        }
                //     } else {
                //         res.status(500).json({ error: 'Erro, ja existe esta resolução em nossa base de dados' });
                //     }
                // }) 
       
        
        
    } else {
        
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }



    
};

export default {cadastrarResolucao}