#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🧪 Testing build process...');
console.log('📁 Project root:', projectRoot);

try {
    // Change to project directory
    process.chdir(projectRoot);

    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    console.log('🔨 Running build...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('✅ Build completed successfully!');

    // Check if dist directory was created
    const fs = await import('fs');
    const distPath = join(projectRoot, 'dist');

    if (fs.existsSync(distPath)) {
        console.log('📁 Dist directory created successfully');
        const files = fs.readdirSync(distPath);
        console.log('📄 Files in dist:', files);
    } else {
        console.log('❌ Dist directory not found');
    }

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
