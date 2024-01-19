const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
const secretKey = 'seuSegredoSuperSecreto';

app.use(cors()); // Adicionando middleware CORS
app.use(bodyParser.json());

// Rota para autenticação e geração do token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
 console.log(req.body)
  // Lógica de autenticação - exemplo simples
  // Aqui, normalmente , haverão algumas camadas para controle do conteúdo passado e implementação do serviço
  // Dessa forma, pulamos essas etapas e conferimos diretamente a senha( Nunca fica salva dessa forma no BD )
  if (username === 'usuario' && password === 'senha') {
    // Criação do token
    const email="usuario@gmail.com";
    const avatar = "https://kanto.legiaodosherois.com.br/w250-h250-gnw-cfill-q95-gcc/wp-content/uploads/2021/07/legiao_Ry1hNJoxOzpY.jpg.webp"
    const token = jwt.sign({ username:username, email:email, avatar:avatar }, secretKey, { expiresIn: '1h' });

    // O secret key deve ser armazenado nas variáveis de ambiente do servidor
    // Esse token deve ser armazenado no front para utilização posterior
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Rota protegida que requer token para acesso
app.get('/recurso-protegido', authenticateToken, (req, res) => {
  res.json({ message: 'Acesso permitido ao recurso protegido' });
});

// Middleware para autenticação do token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
