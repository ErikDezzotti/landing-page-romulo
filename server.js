const express = require("express");
const compression = require("compression");
const path = require("path");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");

// Porta padrão para o EasyPanel é 80
const port = process.env.PORT || 80;

// Configurações importantes para proxy
app.set("trust proxy", true);

// Configurar body-parser para JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de compressão Brotli/Gzip
app.use(
  compression({
    level: 9,
    threshold: 0,
  })
);

// Cache-Control para recursos estáticos
const cacheTime = 31536000; // 1 ano em segundos
app.use(
  express.static(path.join(__dirname, "."), {
    maxAge: cacheTime * 1000,
    immutable: true,
  })
);

// Headers de segurança e performance
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Middleware para logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Redirecionar raiz para página de captura
app.get("/", (req, res) => {
  res.redirect("/lp-cp");
});

// Rota para a página de vendas (index)
app.get("/lp-vd", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Nova rota para Academia de Regência
app.get("/academiaderegencia", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Rota para a página de captura
app.get("/lp-cp", (req, res) => {
  res.sendFile(path.join(__dirname, "captura.html"));
});

// Rota para a página de obrigado
app.get("/lp-ob", (req, res) => {
  res.sendFile(path.join(__dirname, "obrigado.html"));
});

// Redirecionar rotas antigas para as novas
app.get("/captura", (req, res) => {
  res.redirect("/lp-cp");
});

app.get("/obrigado", (req, res) => {
  res.redirect("/lp-ob");
});

// Endpoint para processar o formulário
app.post("/submit-form", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validação dos dados
    if (!name || !email || !phone) {
      throw new Error("Todos os campos são obrigatórios");
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email inválido");
    }

    // Validação do telefone (deve ter 11 dígitos)
    const phoneNumbers = phone.replace(/\D/g, "");
    if (phoneNumbers.length !== 11) {
      throw new Error("Telefone inválido");
    }

    // URL do webhook Sellflux com os parâmetros corretos
    const webhookUrl =
      "https://webhook.sellflux.app/webhook/custom/lead/70e1907e37e97c2c49800f7182ee9c8e";

    // Criar o objeto JSON no formato esperado pelo Sellflux
    const webhookData = {
      name: name,
      email: email,
      phone: phoneNumbers,
      data_cadastro: new Date().toISOString(),
      origem: "Landing Page Regência",
      status: "Novo",
      reque_code: "70e1907e37e97c2c49800f7182ee9c8e",
      origin: "custom",
      custom_fields: {
        name: name,
        email: email,
        phone: phoneNumbers,
      },
    };

    // Configuração específica para o Sellflux
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      params: {
        name: "name",
        email: "email",
        phone: "phone",
      },
    };

    // Log dos dados que serão enviados
    console.log(
      "Enviando dados para Sellflux:",
      JSON.stringify(webhookData, null, 2)
    );

    // Enviar dados para o webhook
    const webhookResponse = await axios.post(webhookUrl, webhookData, config);

    console.log("Resposta do Webhook:", webhookResponse.data);

    if (webhookResponse.status === 200 || webhookResponse.status === 201) {
      res.json({ success: true, message: "Lead cadastrado com sucesso!" });
    } else {
      throw new Error("Falha ao enviar dados para o webhook");
    }
  } catch (error) {
    console.error(
      "Erro ao processar formulário:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      success: false,
      message: error.message || "Erro ao processar sua solicitação",
    });
  }
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!");
});

// Iniciar o servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${port}`);
});
