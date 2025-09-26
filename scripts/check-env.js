#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔍 Checking environment configuration...');
console.log('📁 Project root:', projectRoot);

// Check for environment files
const envFiles = [
    '.env',
    '.env.local',
    '.env.production',
    '.env.development'
];

console.log('\n📄 Environment files:');
envFiles.forEach(file => {
    const exists = existsSync(join(projectRoot, file));
    console.log(`  ${file}: ${exists ? '✅' : '❌'}`);
});

// Check package.json
console.log('\n📦 Package.json check:');
try {
    const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
    console.log(`  Name: ${packageJson.name}`);
    console.log(`  Version: ${packageJson.version}`);
    console.log(`  Build script: ${packageJson.scripts?.build || '❌ Not found'}`);
    console.log(`  Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);
    console.log(`  Dev dependencies: ${Object.keys(packageJson.devDependencies || {}).length}`);
} catch (error) {
    console.log(`  ❌ Error reading package.json: ${error.message}`);
}

// Check Astro config
console.log('\n⚙️ Astro config check:');
try {
    const astroConfig = readFileSync(join(projectRoot, 'astro.config.mjs'), 'utf8');
    const hasVercelAdapter = astroConfig.includes('@astrojs/vercel');
    const hasOutputServer = astroConfig.includes('output: "server"');
    console.log(`  Vercel adapter: ${hasVercelAdapter ? '✅' : '❌'}`);
    console.log(`  Output server: ${hasOutputServer ? '✅' : '❌'}`);
} catch (error) {
    console.log(`  ❌ Error reading astro.config.mjs: ${error.message}`);
}

// Check Vercel config
console.log('\n🚀 Vercel config check:');
try {
    const vercelConfig = readFileSync(join(projectRoot, 'vercel.json'), 'utf8');
    const config = JSON.parse(vercelConfig);
    console.log(`  Version: ${config.version}`);
    console.log(`  Framework: ${config.framework || 'Not specified'}`);
    console.log(`  Build command: ${config.buildCommand || 'Not specified'}`);
    console.log(`  Output directory: ${config.outputDirectory || 'Not specified'}`);
} catch (error) {
    console.log(`  ❌ Error reading vercel.json: ${error.message}`);
}

console.log('\n✅ Environment check completed!');
