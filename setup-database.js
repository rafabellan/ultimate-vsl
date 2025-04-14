// Script para executar migrações iniciais do Prisma
const { execSync } = require('child_process');
console.log('Executando migrações...');
execSync('npx prisma generate', { stdio: 'inherit' });
execSync('npx prisma migrate deploy', { stdio: 'inherit' });
console.log('Configuração concluída!');
