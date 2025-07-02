# Estratégia de Branches e Deploy - Gitflow

## 📋 **Visão Geral**

Este projeto utiliza **Gitflow** com as seguintes branches:

### 🌿 **Branches Principais**

- **`main`** - Branch de produção

  - ✅ Deploy automático no Render
  - ✅ Criação de tags semânticas (v1.0.0, v1.1.0, etc.)
  - ✅ Imagem Docker com tag específica
  - 🔒 Protegida (não aceita push direto)

- **`develop`** - Branch de desenvolvimento

  - ✅ Build e teste automático
  - ✅ Push para Docker Hub (latest)
  - ✅ Tags de desenvolvimento (v1.0.0-dev.abc1234)
  - ❌ **NÃO faz deploy no Render**
  - 🔒 Protegida (não aceita push direto)

- **`feature/*`** - Branches de funcionalidades
  - ✅ Desenvolvimento de novas features
  - ❌ **NÃO executa pipeline**
  - 🔄 Merge para `develop` via Pull Request

### 🔄 **Fluxo de Trabalho Gitflow**

1. **Desenvolvimento de Feature**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nova-funcionalidade
   # ... desenvolver ...
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin feature/nova-funcionalidade
   # Criar Pull Request: feature → develop
   ```

2. **Integração em Develop**

   - Merge da feature para `develop`
   - Pipeline executa build e testes
   - Imagem Docker é criada com tag `latest`
   - Tag de desenvolvimento criada

3. **Release para Produção**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   # Pipeline executa deploy no Render
   # Tag semântica criada (v1.0.0)
   ```

## 🚀 **Pipeline CI/CD**

### **Branch `feature/*`:**

- ❌ **NÃO executa pipeline**

### **Branch `develop`:**

- ✅ Checkout
- ✅ Install dependencies
- ✅ Build
- ✅ Generate semantic version (v1.0.0-dev.abc1234)
- ✅ Build Docker image (tag: latest)
- ✅ Push to Docker Hub
- ❌ **NÃO deploy no Render**

### **Branch `main`:**

- ✅ Checkout
- ✅ Install dependencies
- ✅ Build
- ✅ Generate semantic version (v1.0.0)
- ✅ Create Git tag (v1.0.0)
- ✅ Build Docker image (tag: específica)
- ✅ Push to Docker Hub
- ✅ **Deploy no Render**

## 📝 **Comandos Úteis**

```bash
# 1. Desenvolver nova feature
git checkout develop
git pull origin develop
git checkout -b feature/nova-funcionalidade
# ... fazer alterações ...
git add .
git commit -m "feat: nova funcionalidade"
git push origin feature/nova-funcionalidade
# Criar Pull Request no GitHub

# 2. Após merge da feature em develop
git checkout develop
git pull origin develop
# Testar localmente se necessário

# 3. Fazer release para produção
git checkout main
git merge develop
git push origin main
# Pipeline executa automaticamente
```

## 🎯 **Versionamento Semântico**

- **Main**: `v1.0.0`, `v1.1.0`, `v2.0.0`
- **Develop**: `v1.0.0-dev.abc1234`
- **Pull Requests**: `pr-123-abc1234`

## 🎯 **Benefícios**

- **Segurança**: Apenas `main` faz deploy em produção
- **Rastreabilidade**: Tags semânticas para cada release
- **Testes**: `develop` permite testes sem afetar produção
- **Rollback**: Possibilidade de voltar para versão anterior
- **Gitflow**: Fluxo padronizado e organizado
