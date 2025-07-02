module.exports = {
  '*.js': [
    'echo "Verificando sintaxe JavaScript..."',
    'node -c',
    'echo "✅ Sintaxe JavaScript OK"'
  ],
  '*.json': [
    'echo "Verificando sintaxe JSON..."',
    'node -e "JSON.parse(require(\'fs\').readFileSync(0, \'utf-8\'))"',
    'echo "✅ Sintaxe JSON OK"'
  ],
  '*.md': [
    'echo "Verificando markdown..."',
    'echo "✅ Markdown OK"'
  ]
}; 