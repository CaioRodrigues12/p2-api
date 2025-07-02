require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const { getClient, initializeDatabase } = require('./database');
const { loggerMiddleware, winstonLogger } = require('./logger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);


// GET - lista produtos
app.get('/produtos', async (req, res) => {
  try {
    const client = await getClient();
    const result = await client.query('SELECT * FROM produtos ORDER BY id');
    await client.end();
    res.json(result.rows);
  } catch (err) {
    winstonLogger.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// GET - busca produto por ID
app.get('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await getClient();
    const result = await client.query('SELECT * FROM produtos WHERE id = $1', [id]);
    await client.end();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    winstonLogger.error('Erro ao buscar produto:', err);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// POST - cria produto
app.post('/produtos', async (req, res) => {
  const { nome, descricao, preco } = req.body;
  
  // Validação básica
  if (!nome || preco === undefined) {
    return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
  }

  try {
    const client = await getClient();
    const result = await client.query(
      'INSERT INTO produtos (nome, descricao, preco) VALUES ($1, $2, $3) RETURNING *',
      [nome, descricao || '', preco]
    );
    await client.end();
    res.status(201).json({ 
      message: 'Produto criado com sucesso',
      produto: result.rows[0]
    });
  } catch (err) {
    winstonLogger.error('Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// PUT - atualiza produto
app.put('/produtos/:id', async (req, res) => {
  const { nome, descricao, preco } = req.body;
  const { id } = req.params;

  if (!nome || preco === undefined) {
    return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
  }

  try {
    const client = await getClient();
    const result = await client.query(
      'UPDATE produtos SET nome=$1, descricao=$2, preco=$3, updated_at=CURRENT_TIMESTAMP WHERE id=$4 RETURNING *',
      [nome, descricao || '', preco, id]
    );
    await client.end();
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json({ 
      message: 'Produto atualizado com sucesso',
      produto: result.rows[0]
    });
  } catch (err) {
    winstonLogger.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// DELETE - remove produto
app.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await getClient();
    const result = await client.query('DELETE FROM produtos WHERE id=$1 RETURNING *', [id]);
    await client.end();
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json({ 
      message: 'Produto excluído com sucesso',
      produto: result.rows[0]
    });
  } catch (err) {
    winstonLogger.error('Erro ao excluir produto:', err);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
});

// Endpoint para testar logs
app.get('/test-log', (req, res) => {
  winstonLogger.info('Endpoint de teste acessado');
  res.json({ 
    message: 'Log de teste enviado!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Endpoint para testar banco de dados
app.get('/test-db', async (req, res) => {
  try {
    const client = await getClient();
    // Testar conexão
    await client.query('SELECT NOW()');
    // Verificar se a tabela existe
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'produtos'
      );
    `);
    const tableExists = tableCheck.rows[0].exists;
    if (!tableExists) {
      // Criar tabela
      await client.query(`
        CREATE TABLE IF NOT EXISTS produtos (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL,
          descricao TEXT,
          preco NUMERIC(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    await client.end();
    res.json({ 
      message: 'Teste de banco de dados',
      database_connected: true,
      table_exists: tableExists,
      table_created: !tableExists,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    winstonLogger.error('Erro no teste de banco:', err);
    res.status(500).json({ 
      error: 'Erro no teste de banco de dados',
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota base
app.get('/', (req, res) => {
  res.json({ 
    message: 'API P2 - Integração e Entrega Contínua',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      produtos: '/produtos',
      docs: '/api-docs',
      testLog: '/test-log'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  winstonLogger.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

const port = process.env.PORT || 3000;

// Inicializar aplicação
async function startServer() {
  try {
    // Inicializar banco de dados
    await initializeDatabase();
    
    // Iniciar servidor
    app.listen(port, () => {
      console.log(`- API rodando em: ${port}`);
      console.log(`- Documentação: http://localhost:${port}/api-docs`);
      console.log(`- Teste de log: http://localhost:${port}/test-log`);
      console.log(`- Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

startServer();