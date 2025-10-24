const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build with Release Notes generation...');

try {
    // Get current git commit info (with fallbacks for Vercel environment)
    let commitHash = 'unknown';
    let commitMessage = 'No commit message available';

    try {
        commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        commitMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
        console.log(`📝 Commit: ${commitHash} - ${commitMessage}`);
    } catch (gitError) {
        console.log('⚠️  Git information not available, using environment variables if present');

        // Try to get info from Vercel environment variables
        if (process.env.VERCEL_GIT_COMMIT_SHA) {
            commitHash = process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
            console.log(`📝 Using Vercel commit hash: ${commitHash}`);
        }

        if (process.env.VERCEL_GIT_COMMIT_MESSAGE) {
            commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE;
            console.log(`📝 Using Vercel commit message: ${commitMessage}`);
        }
    }

    // Check if we should update version
    const hasFeature = /^feat(\(.*\))?:/.test(commitMessage);
    const hasFix = /^fix(\(.*\))?:/.test(commitMessage);
    const hasBreaking = commitMessage.includes('BREAKING CHANGE') || commitMessage.includes('!:');

    if (hasFeature || hasFix || hasBreaking) {
        console.log('🔄 Significant changes detected, updating version...');

        let versionType = 'patch';
        if (hasBreaking) {
            console.log('💥 Breaking change detected - incrementing major version');
            versionType = 'major';
        } else if (hasFeature) {
            console.log('✨ Feature detected - incrementing minor version');
            versionType = 'minor';
        } else {
            console.log('🐛 Fix detected - incrementing patch version');
            versionType = 'patch';
        }

        execSync(`npm version ${versionType} --no-git-tag-version --no-commit-hooks`, { stdio: 'inherit' });
    } else {
        console.log('📝 No significant changes, keeping current version');
    }

    // Get current version
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const currentVersion = packageJson.version;
    console.log(`📦 Building version: ${currentVersion}`);

    // Update environment files
    console.log(`🔧 Updating environment files with version ${currentVersion}...`);

    const envFiles = [
        'src/environments/environment.ts',
        'src/environments/environment.prod.ts'
    ];

    envFiles.forEach(envFile => {
        if (fs.existsSync(envFile)) {
            let content = fs.readFileSync(envFile, 'utf8');
            content = content.replace(/version: '[^']*'/, `version: '${currentVersion}'`);
            fs.writeFileSync(envFile, content);
        }
    });

    // Generate release notes
    console.log('📋 Generating release notes...');
    execSync('npm run generate-release-notes', { stdio: 'inherit' });

    // Build the application
    console.log('🏗️  Building application...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('✅ Build completed successfully!');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}