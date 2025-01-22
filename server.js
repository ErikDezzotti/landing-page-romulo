const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

// Porta padrão para o EasyPanel é 80
const port = process.env.PORT || 80;

// Configurações importantes para proxy
app.set('trust proxy', true);

// Configurar body-parser para JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Endpoint para processar o formulário
app.post('/submit-form', async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;

        // Criar o objeto JSON no formato esperado pelo Sellflux
        const webhookData = {
            nome: nome,
            email: email,
            telefone: telefone,
            data_cadastro: new Date().toISOString(),
            origem: "Landing Page Regência",
            status: "Novo",
            reque_code: "70e1907e37e97c2c49800f7182ee9c8e",
            origin: "custom",
            custom_fields: {
                name: "nome",
                email: "email",
                phone: "telefone"
            }
        };

        // URL do webhook Sellflux
        const webhookUrl = 'https://webhook.sellflux.app/webhook/custom/lead/70e1907e37e97c2c49800f7182ee9c8e';

        // Configuração específica para o Sellflux
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        // Enviar dados para o webhook como RAW JSON
        const webhookResponse = await axios.post(webhookUrl, JSON.stringify(webhookData), config);

        console.log('Resposta do Webhook:', webhookResponse.data);

        if (webhookResponse.status === 200 || webhookResponse.status === 201) {
            res.json({ success: true, message: 'Lead cadastrado com sucesso!' });
        } else {
            throw new Error('Falha ao enviar dados para o webhook');
        }
    } catch (error) {
        console.error('Erro ao processar formulário:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao processar sua solicitação',
            error: error.message
        });
    }
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
