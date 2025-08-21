
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const porta = process.env.PORT || 3000;
const mysql = require('mysql');
const jwt = require('jsonwebtoken');


app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect((err, connect)=>{
    if(err){
       return console.log(err);
    }

    console.log(`server connected on my sql`)

})



function verifytoken(req, res, next) {
    const auth = req.headers.authorization; // corrigido

    if (!auth) {
        return res.status(401).json({ err: 'Token necessário' });
    }

    const token = auth.split(' ')[1]; // Bearer TOKEN

    jwt.verify(token, process.env.segredo, (err, decoded) => {
        if (err) {
            return res.status(401).json({ err: 'Token inválido ou expirado' });
        }

        req.userId = decoded.id; // salva o id do usuário no request
        console.log(decoded); // payload do token
        next(); // passa para a próxima função
    });
}


function gerarToken(user) {
    return jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.segredo , { expiresIn: '8h' });
}


app.post('/PostTasks', verifytoken ,(req, res)=>{

    const { tarefa } = req.body;

    sql = 'INSERT INTO tarefas (titulo, user_id) VALUES (?, ?)'

    
    db.query(sql, [tarefa, req.userId], (err, results)=>{
        const documents = results;

        if(err){
            return res.status(401).send("error on mysql");
        }

        if(results.insertId === 0){
          return  res.status(402).send("deu erro");
        }

        return res.status(201).json({ok: true});
    });
});

app.get("/getTasks", (req, res) => {
    const sql = 'SELECT * FROM tarefas WHERE user_id = ? ORDER BY id DESC';
    const auth = req.headers.authorization;
    
    if (!auth) {
        return res.status(401).json({ ok: false, message: 'Token necessário' });
    }
    
    const token = auth.split(' ')[1];
    
    jwt.verify(token, process.env.segredo, (err, decoded) => {
        if (err) {
            return res.status(401).json({ ok: false, message: 'Token inválido ou expirado' });
        }
    
        const userId = decoded.id;
    
        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ ok: false, message: 'Erro no MySQL' });
            }
    
            // Sempre retornar tasks como array
            res.status(200).json({ ok: true, tasks: results || [] });
        });
    });
    
});

app.put('/finishTasks/:id', (req, res) => {
    const id = req.params.id;

    const sql = `
        UPDATE tarefas
        SET status = 'concluida',
            data_conclusao = NOW()
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).send("Erro no MySQL");
        }

        if (results.affectedRows === 0) {
            return res.status(404).send("Tarefa não encontrada");
        }

        res.status(200).json({ ok: true, message: "Tarefa concluída com sucesso" });
    });
});


app.delete('/deleteTasks/:id', (req, res)=>{

    const id = req.params.id;

    const sql = 'DELETE FROM tarefas WHERE id = ?';

    db.query(sql, [id], (err, results)=>{
        if(err){
            return res.status(403).json({err: 'erro na query'});
        }
        if(results.length === 0){
            return res.status(404).json({err: "erro na consulta nada encontrado"});
        }

        res.status(201).json({ok: true});

    })
})


app.post('/register', (req, res)=>{

    const {email, senha, name} = req.body;

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

    db.query(sql, [name, email, senha], (err, results)=>{
   
        if(err){
            console.log(err);
            return res.status(401).json({err: err})
        };

        console.log(results)
            
            const sql2 = 'SELECT * FROM users WHERE email = ? AND password = ?';

            db.query(sql2, [email, senha], (err, results)=>{
                if (err){
                    console.log(err);
                    return res.status(405).json({err: err});
                }

                console.log(results)

                const documents = results[0];

               const token = gerarToken(documents);

                res.status(201).json({token: token});

        })

        
    })

})

app.post('/login', (req, res)=>{

    const {email, senha} = req.body;

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

   

    db.query(sql, [email, senha], (err, results)=>{

        if(err){
            console.log(err);
            return res.status(401).json({err: err})
        };

        const comments = results[0];
        
      const token = gerarToken(comments);

        return res.status(201).json({token: token})

        console.log(results)

    })



})
    





app.listen(porta, ()=> console.log(`server running on ${porta} port!!!`));