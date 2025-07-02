#!/bin/bash

echo "🚀 Setup da API P2 - Integração e Entrega Contínua"
echo "=================================================="

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 18+"
    exit 1
fi

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Por favor, instale o Docker"
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Por favor, instale o Docker Compose"
    exit 1
fi

echo "✅ Dependências verificadas"

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "⚠️  Por favor, configure as variáveis no arquivo .env"
else
    echo "✅ Arquivo .env já existe"
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar diretório de logs
echo "📁 Criando diretório de logs..."
mkdir -p logs

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis no arquivo .env"
echo "2. Execute: npm run docker:compose"
echo "3. Acesse: http://localhost:3000"
echo "4. Documentação: http://localhost:3000/api-docs"
echo ""
echo "🔧 Para desenvolvimento local:"
echo "npm run dev"
echo ""
echo "🐳 Para usar Docker:"
echo "npm run docker:compose" 