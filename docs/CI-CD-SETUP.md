# Configuração CI/CD - API P2

Este documento detalha a configuração completa do pipeline CI/CD para o projeto.

## 📋 Pré-requisitos

### 1. Contas Necessárias
- [GitHub](https://github.com) - Repositório do código
- [Docker Hub](https://hub.docker.com) - Registro de imagens
- [Render](https://render.com) - Deploy da aplicação
- [BetterStack](https://betterstack.com) - Logs e monitoramento
- Banco de dados PostgreSQL online (ex: Supabase, Railway, Neon)

### 2. Configurações Iniciais

#### GitHub Repository
1. Crie um repositório no GitHub
2. Adicione o usuário `festmedeiros` como colaborador
3. Configure o Gitflow:
   ```bash
   git flow init
   git checkout -b develop
   git push -u origin develop
   ```

#### Docker Hub
1. Crie uma conta no Docker Hub
2. Crie um repositório com o mesmo nome do repositório GitHub
3. Gere um token de acesso

#### Render
1. Crie uma conta no Render
2. Crie um novo Web Service
3. Configure para usar Docker
4. Obtenha o Service ID e API Key

#### BetterStack
1. Crie uma conta no BetterStack
2. Crie um novo source para logs
3. Configure a URL e token de acesso

## 🔐 GitHub Secrets

Configure os seguintes secrets no seu repositório GitHub:

### Docker Hub
```
DOCKER_USERNAME=seu_usuario_dockerhub
DOCKER_PASSWORD=sua_senha_ou_token_dockerhub
```

### Render
```
RENDER_API_KEY=sua_api_key_render
RENDER_SERVICE_ID=id_do_servico_render
```

### BetterStack
```
BETTERSTACK_URL=https://in.logs.betterstack.com/
BETTERSTACK_TOKEN=seu_token_betterstack
```

### Banco de Dados
```
DATABASE_URL=sua_url_banco_dados_postgresql
```

### Email (para notificações)
```
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_app_gmail
NOTIFICATION_EMAIL=email_para_notificacoes
```

## 🔄 Pipeline CI/CD

### Estrutura do Pipeline

O pipeline está configurado no arquivo `.github/workflows/ci-cd.yml` e inclui:

#### Etapas CI (Continuous Integration)
1. **Checkout** - Baixa o código do repositório
2. **Setup Node.js** - Configura o ambiente Node.js
3. **Install** - Instala as dependências
4. **Build** - Executa o build da aplicação
5. **Versionamento** - Gera versão baseada no commit
6. **Build Imagem** - Constrói a imagem Docker

#### Etapas CD (Continuous Deployment)
1. **Login Docker Hub** - Autentica no Docker Hub
2. **Push Imagem** - Envia a imagem para o Docker Hub
3. **Tag Latest** - Cria a tag latest
4. **Deploy Render** - Faz deploy no Render
5. **Notificação** - Envia email em caso de erro

### Triggers do Pipeline

O pipeline é executado quando:
- Push para `main` (deploy em produção)
- Push para `develop` (deploy em desenvolvimento)
- Pull Request para `main` (validação)

## 🐳 Docker

### Estrutura de Imagens

```
docker.io/seu-usuario/api-integracao:latest
docker.io/seu-usuario/api-integracao:commit-hash
```

### Docker Compose Local

Para desenvolvimento local:
```bash
npm run docker:compose
```

Isso inicia:
- PostgreSQL na porta 5432
- API na porta 3000

## 📊 Monitoramento

### BetterStack Logs

Configuração no código:
```javascript
// src/logger.js
const logPayload = {
  message: logMessage,
  level: res.statusCode >= 400 ? 'error' : 'info',
  timestamp: timestamp,
  method: req.method,
  url: req.originalUrl,
  status: res.statusCode,
  duration: duration,
  ip: req.ip || req.connection.remoteAddress,
  userAgent: req.get('User-Agent'),
  environment: process.env.NODE_ENV || 'development'
};
```

### Health Check

Endpoint: `GET /health`
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

## 🚀 Deploy

### Deploy Automático

1. Faça push para a branch `main`
2. O pipeline será executado automaticamente
3. A imagem será enviada para o Docker Hub
4. O deploy será feito no Render
5. A aplicação estará disponível na URL do Render

### Deploy Manual

Para fazer deploy manual:
```bash
# Build local
npm run docker:build

# Push para Docker Hub
docker push seu-usuario/api-integracao:latest

# Deploy no Render via API
curl -X POST "https://api.render.com/v1/services/SEU_SERVICE_ID/deploys" \
  -H "Authorization: Bearer SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"clearCache": "do_not_clear"}'
```

## 🔍 Troubleshooting

### Problemas Comuns

#### Pipeline falha no build
- Verifique se todas as dependências estão no `package.json`
- Confirme se o Dockerfile está correto
- Verifique os logs do GitHub Actions

#### Deploy falha no Render
- Verifique se as variáveis de ambiente estão configuradas
- Confirme se a imagem Docker existe no Docker Hub
- Verifique os logs do Render

#### Logs não aparecem no BetterStack
- Verifique se a URL e token estão corretos
- Confirme se o source está ativo no BetterStack
- Verifique se a aplicação está fazendo requisições

#### Banco de dados não conecta
- Verifique se a URL do banco está correta
- Confirme se o banco está acessível
- Verifique se as credenciais estão corretas

### Logs e Debug

#### GitHub Actions
- Acesse: `https://github.com/seu-usuario/api-integracao/actions`
- Clique no workflow para ver os logs

#### Render
- Acesse o dashboard do Render
- Vá para o serviço
- Clique em "Logs" para ver os logs de deploy

#### BetterStack
- Acesse o dashboard do BetterStack
- Vá para "Logs"
- Filtre por source e timestamp

## 📈 Métricas e Alertas

### Métricas Coletadas
- Tempo de resposta das requisições
- Taxa de erro
- Uso de CPU e memória
- Logs estruturados
- Health checks

### Alertas Configurados
- Falhas no pipeline CI/CD
- Erros na aplicação (> 5%)
- Tempo de resposta alto (> 2s)
- Falhas de deploy
- Banco de dados indisponível

## 🔄 Versionamento

### Estratégia de Versionamento
- **Commits**: Hash do commit (ex: `abc123`)
- **PRs**: `pr-123-abc123`
- **Tags**: `v1.0.0` (manual)

### Controle de Versões
- Cada build gera uma versão única
- A tag `latest` sempre aponta para a versão mais recente
- Versões antigas podem ser re-deployadas usando a tag específica

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs do pipeline
2. Consulte a documentação
3. Entre em contato com o professor
4. Abra uma issue no GitHub 