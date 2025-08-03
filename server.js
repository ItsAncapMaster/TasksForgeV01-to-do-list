
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const porta = process.env.PORT || 3000;
const mysql = require('mysql');


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

app.post('/PostTasks', (req, res)=>{

    const { tarefa } = req.body;

    sql = 'INSERT INTO tarefas (titulo) VALUES (?)'

    
    db.query(sql, [tarefa], (err, results)=>{
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

app.get("/getTasks", (req, res)=>{

    const sql = 'SELECT * FROM tarefas ORDER BY id DESC';

    db.query(sql, (err, results)=>{
        if(err){
            return res.status(401).send("error on mysql");
        }

        if(results.length === 0){
          return  res.status(402).send("deu erro");
        }

        res.status(200).json({ task: results})

    })

})

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



app.listen(porta, ()=> console.log(`server running on ${porta} port!!!`));