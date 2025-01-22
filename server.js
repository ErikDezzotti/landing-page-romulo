const express = require('express');
const path = require('path');
const app = express();

// Porta padrão para o EasyPanel é 80
const port = process.env.PORT || 80;

// Configurações importantes para proxy
app.set('trust proxy', true);

// Servir arquivos estáticos da pasta raiz
app.use(express.static(__dirname));

// Middleware para logging básico
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para a página de captura
app.get('/captura', (req, res) => {
    res.sendFile(path.join(__dirname, 'captura.html'));
});

// Rota para a página de obrigado
app.get('/obrigado', (req, res) => {
    res.sendFile(path.join(__dirname, 'obrigado.html'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Iniciar o servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`);
});
