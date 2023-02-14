const mongoose = require('mongoose')

const UsuariosSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    amigo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    amigoNome: {
        type: String,
        required: false,
    },
});

const Usuario = mongoose.model("Usuario", UsuariosSchema)
module.exports = Usuario