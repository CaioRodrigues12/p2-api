
## Funcionalidades

- CRUD completo de usuários
- Integração com BetterStack (logs estruturados)
- Documentação automática via Swagger
- Docker (build, run e compose)
- Pipeline CI/CD no GitHub Actions
- Deploy automático no Render
- PostgreSQL online
- Endpoints de health check e status

## Requisitos

- Node.js 18+
- Docker + Docker Compose
- Contas em GitHub, Docker Hub, Render e BetterStack
- Banco PostgreSQL acessível online

## 🔧 Configuração Local

1. Clone o repositório:
   ```bash
   git clone https://github.com/CaioRodrigues12/p2-api.git
   cd api-integracao
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie o arquivo `.env` na raiz:
   ```env
   DATABASE_URL=postgresql://usuario:senha@host:porta/banco
   BETTERSTACK_URL=https://in.logs.betterstack.com/
   BETTERSTACK_TOKEN=seu_token
   NODE_ENV=development
   PORT=3000
   ```

4. Execute com Docker Compose (recomendado):
   ```bash
   npm run docker:compose
   ```
   Ou rode localmente:
   ```bash
   npm run dev
   ```

## 🐳 Docker

- Build:
  ```bash
  npm run docker:build
  ```
- Executar container:
  ```bash
  npm run docker:run
  ```
- Compose (API + PostgreSQL):
  ```bash
  npm run docker:compose
  ```

## 📚 Endpoints

- `GET /` → Info da API
- `GET /api-docs` → Documentação Swagger com todos endpoints
- `GET /test-log` → Envia log de teste para BetterStack

## ⚙️ CI/CD

### Secrets no GitHub

Configure no repositório:
```
DOCKER_USERNAME
DOCKER_PASSWORD
RENDER_API_KEY
RENDER_SERVICE_ID
BETTERSTACK_URL
BETTERSTACK_TOKEN
DATABASE_URL
EMAIL_USER
EMAIL_PASSWORD
NOTIFICATION_EMAIL
```

### Docker Hub
- Crie um repositório com o mesmo nome do projeto e configure as credenciais no GitHub.

### Render
- Crie um Web Service configurado para usar Docker.
- Configure variáveis de ambiente.
- Guarde o Service ID e a API Key para os secrets.

### BetterStack
- Configure um source de logs, obtenha a URL/token e adicione nos secrets do GitHub.

## 🔄 Pipeline

O pipeline executa:
- Integração: checkout, dependências, build, versionamento, build da imagem Docker.
- Deploy: push da imagem no Docker Hub, tag `latest`, atualização no Render.


## Fluxo Git

- `main` → Produção
- `develop` → Desenvolvimento
- `feature/*` → Funcionalidades
- `hotfix/*` → Correções críticas
