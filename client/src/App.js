import React, { useState, useEffect } from 'react';
import Axios from "axios";
import emailjs from "emailjs-com"
import './App.css';

function App() {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [newNome, setNewNome] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/read").then((response) => {
      setUserList(response.data);
    });
  }, []);

  const addToList = () => {
    Axios.post("http://localhost:3001/insert", {
      nome: nome,
      email: email,
    });
  };

  const sendEmail = (toMail, amigo) => {
    var templateParams = {
      to_name: toMail.nome,
      to_email: toMail.email,
      amigo: amigo.nome
    };
    emailjs.send('amigo-secreto', 'template_q15wop6', templateParams, 'iyoQnKNhTsJHJzKSM')
      .then((result) => {
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
      });
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const realizaSorteio = () => {
    const amigos = userList;
    shuffleArray(amigos);
    for (var i = 0; i < amigos.length; i++) {
      if (i === amigos.length - 1) {
        Axios.put("http://localhost:3001/sorteio", {
          id: amigos[i]._id,
          amigoId: amigos[0]._id,
          amigoNome: amigos[0].nome,
        });
        sendEmail(amigos[i], amigos[0]);
        console.log(amigos[i]._id + " -> " + amigos[0]._id);
      } 
      else {
        Axios.put("http://localhost:3001/sorteio", {
          id: amigos[i]._id,
          amigoId: amigos[i + 1]._id,
          amigoNome: amigos[i + 1].nome,
        });
        sendEmail(amigos[i], amigos[i + 1]);
        console.log(amigos[i]._id + " -> " + amigos[i + 1]._id);
      }
    }
    console.log("SORTEIO REALIZADO");
  };

  const updateDados = (id) => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      newNome: newNome,
      newEmail: newEmail,
    });
  };

  const deleteUser = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`, {
    });
  };

  return <div className="App">
    <h1> Amigo Secreto </h1>

    <label>Nome:</label>
    <input
      type="text"
      onChange={(event) => {
        setNome(event.target.value);
      }}
    />
    <label>e-mail:</label>
    <input
      type="text"
      onChange={(event) => {
        setEmail(event.target.value);
      }}
    />
    <button onClick={addToList}>Realizar Cadastro</button>
    <button onClick={() => realizaSorteio()}>REALIZAR SORTEIO</button>
    
    <h1>Participantes:</h1>
    {userList.map((val, key) => {
      return <div key={key} className="nomes">
        <label>Nome:</label>
        <h1> {val.nome}</h1>
        <label>e-mail:</label>
        <h1>{val.email}</h1>

        <h3>Editar Dados:</h3>
        <input
          type="text"
          onChange={(event) => {
            setNewNome(event.target.value);
          }}
          placeholder='Novo nome'
        />
        <input
          type="text"
          onChange={(event) => {
            setNewEmail(event.target.value);
          }}
          placeholder='Novo email'
        />
        <button onClick={() => updateDados(val._id)}>Atualizar dados</button>
        <button onClick={() => deleteUser(val._id)}>Deletar Dados</button>
      </div>
    })}
  </div>;

}

export default App;
