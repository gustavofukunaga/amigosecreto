const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const UsuarioModel = require('./models/Usuarios');

app.use(express.json());
app.use(cors());

mongoose.connect(
    "mongodb+srv://newuser:PP12345@crud.3bcqpmw.mongodb.net/?retryWrites=true&w=majority", 
    {
        useNewUrlParser: true,
    }
);

app.post('/insert', async (req, res) => {
    
    const userNome = req.body.nome;
    const userEmail = req.body.email;
    const user = new UsuarioModel({ 
        nome: userNome, 
        email: userEmail,
        amigo: ("000000000000000000000000")
    });

    try {
        await user.save();
        res.send("test" + user.amigo);
    }catch(err) {
        console.log(err);
    };
});

app.get('/read', async (req, res) => {
    UsuarioModel.find({}, (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    });
});

app.put('/update', async (req, res) => {
    const id = req.body.id;
    const newNome = req.body.newNome;
    const newEmail = req.body.newEmail;

    try {
        await UsuarioModel.findById(id, (err, updatedUser) => {
            updatedUser.nome = newNome;
            updatedUser.email = newEmail;
            updatedUser.save();
            res.send("update");
        });
    }catch(err) {
        console.log(err);
    };
});

app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    await UsuarioModel.findByIdAndRemove(id).exec();
    res.send("deleted");
})

app.put("/sorteio", async (req, res) => {
    const id = req.body.id;
    const amigoId = req.body.amigoId;
    const amigoNome = req.body.amigoNome
    
    try {
        await UsuarioModel.findById(id, (err, updatedUser) => {
            updatedUser.amigo = amigoId;
            updatedUser.save();
            updatedUser.amigoNome = amigoNome;
            res.send("add amigo");
        });
    }catch(err) {
        console.log(err);
    };
})


app.listen(3001, () => {
    console.log("Server running on port 3001...");
});