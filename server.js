const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Servir arquivos estáticos da pasta raiz
app.use(express.static(__dirname));

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

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
