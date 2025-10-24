const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

/**
 * Script zur lokalen Generierung von Release Notes
 * Kann verwendet werden um Release Notes manuell zu erstellen
 */

function generateReleaseNotes() {
    console.log('🔍 Generating release notes...');
    
    // Check if we're in a Vercel environment
    const isVercel = process.env.VERCEL === '1' || process.env.NOW_BUILDER;
    if (isVercel) {
        console.log('🔧 Detected Vercel environment - using optimized release notes generation');
    }

    // Create release notes directory if it doesn't exist
    const releaseNotesDir = path.join(__dirname, '..', 'src', 'assets', 'release-notes');
    if (!fs.existsSync(releaseNotesDir)) {
        fs.mkdirSync(releaseNotesDir, { recursive: true });
    }

    // Get current version from package.json
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    const version = packageJson.version;
    const date = new Date().toISOString();

    console.log(`📝 Generating release notes for version ${version}`);

    // Get commits since last tag
    let commits = [];
    try {
        // Try to get commits since last tag
        const gitLog = execSync('git log $(git describe --tags --abbrev=0)..HEAD --format="%s"', {
            encoding: 'utf8',
            cwd: path.join(__dirname, '..')
        });
        commits = gitLog.trim().split('\n').filter(commit => commit.trim());
    } catch (e) {
        console.log('⚠️  No previous tags found, trying alternative methods...');
        
        // Try getting commits since last version tag that matches semantic versioning
        try {
            const gitLog = execSync('git log $(git tag -l "v*" --sort=-version:refname | head -1)..HEAD --format="%s"', {
                encoding: 'utf8',
                cwd: path.join(__dirname, '..')
            });
            commits = gitLog.trim().split('\n').filter(commit => commit.trim());
            console.log(`📝 Found commits since last version tag`);
        } catch (e2) {
            console.log('⚠️  No version tags found, getting recent commits...');
            
            // Fallback: get last 10 commits or commits from last week
            try {
                const gitLog = execSync('git log --format="%s" --max-count=10', {
                    encoding: 'utf8',
                    cwd: path.join(__dirname, '..')
                });
                commits = gitLog.trim().split('\n').filter(commit => commit.trim());
                console.log(`📝 Using last ${commits.length} commits`);
            } catch (e3) {
                console.log('⚠️  Limited git history, trying to get any available commits...');
                
                // Last resort: try to get any commits
                try {
                    const gitLog = execSync('git log --format="%s"', {
                        encoding: 'utf8',
                        cwd: path.join(__dirname, '..')
                    });
                    const allCommits = gitLog.trim().split('\n').filter(commit => commit.trim());
                    // Take only recent commits to avoid too much noise
                    commits = allCommits.slice(0, 5);
                    console.log(`📝 Using ${commits.length} most recent commits from available history`);
                } catch (e4) {
                    console.log('❌ No git history available - this might be a fresh deployment');
                    commits = [];
                }
            }
        }
    }

    console.log(`📊 Found ${commits.length} commits to analyze`);
    
    // If no commits found and we're in Vercel, try to use current commit info
    if (commits.length === 0 && isVercel) {
        console.log('🔍 No commit history available, checking current commit from environment...');
        
        if (process.env.VERCEL_GIT_COMMIT_MESSAGE) {
            commits = [process.env.VERCEL_GIT_COMMIT_MESSAGE];
            console.log(`📝 Using current commit message: ${process.env.VERCEL_GIT_COMMIT_MESSAGE}`);
        }
    }

    // Parse conventional commits
    const releaseNote = {
        version: version,
        date: date,
        features: commits
            .filter(c => c.startsWith('feat:') || c.startsWith('feat('))
            .map(c => c.replace(/^feat(\([^)]*\))?:\s*/, '').trim()),
        fixes: commits
            .filter(c => c.startsWith('fix:') || c.startsWith('fix('))
            .map(c => c.replace(/^fix(\([^)]*\))?:\s*/, '').trim()),
        breaking: commits
            .filter(c => c.includes('BREAKING CHANGE') || c.includes('!:'))
            .map(c => c.trim()),
        improvements: commits
            .filter(c => c.startsWith('refactor:') || c.startsWith('refactor(') || c.startsWith('perf:') || c.startsWith('perf('))
            .map(c => c.replace(/^(refactor|perf)(\([^)]*\))?:\s*/, '').trim()),
        maintenance: commits
            .filter(c => c.startsWith('chore:') || c.startsWith('chore(') || c.startsWith('build:') || c.startsWith('build(') || c.startsWith('ci:') || c.startsWith('ci('))
            .map(c => c.replace(/^(chore|build|ci)(\([^)]*\))?:\s*/, '').trim())
            .filter(c => !c.includes('release)')), // Filter out release commits
        styling: commits
            .filter(c => c.startsWith('style:') || c.startsWith('style('))
            .map(c => c.replace(/^style(\([^)]*\))?:\s*/, '').trim()),
        documentation: commits
            .filter(c => c.startsWith('docs:') || c.startsWith('docs('))
            .map(c => c.replace(/^docs(\([^)]*\))?:\s*/, '').trim()),
        other: commits
            .filter(c =>
                !c.startsWith('feat:') && !c.startsWith('feat(') &&
                !c.startsWith('fix:') && !c.startsWith('fix(') &&
                !c.startsWith('refactor:') && !c.startsWith('refactor(') &&
                !c.startsWith('perf:') && !c.startsWith('perf(') &&
                !c.startsWith('chore:') && !c.startsWith('chore(') &&
                !c.startsWith('build:') && !c.startsWith('build(') &&
                !c.startsWith('ci:') && !c.startsWith('ci(') &&
                !c.startsWith('style:') && !c.startsWith('style(') &&
                !c.startsWith('docs:') && !c.startsWith('docs(') &&
                !c.includes('BREAKING CHANGE') &&
                !c.includes('!:') &&
                !c.startsWith('chore(release)')
            )
            .map(c => c.trim())
    };

    // Write release notes for this version
    const releaseNoteFile = path.join(releaseNotesDir, `${version}.json`);
    fs.writeFileSync(releaseNoteFile, JSON.stringify(releaseNote, null, 2));
    console.log(`✅ Created release notes: ${releaseNoteFile}`);

    // Update or create index
    const indexFile = path.join(releaseNotesDir, 'index.json');
    let index = { versions: [] };

    if (fs.existsSync(indexFile)) {
        index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
    }

    if (!index.versions.includes(version)) {
        index.versions.unshift(version);
        // Keep only last 10 versions in index
        index.versions = index.versions.slice(0, 10);
    }

    fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
    console.log(`✅ Updated index: ${indexFile}`);

    // Log summary
    console.log('\n📋 Release Notes Summary:');
    console.log(`   Version: ${version}`);
    console.log(`   ✨ Features: ${releaseNote.features.length}`);
    console.log(`   🐛 Fixes: ${releaseNote.fixes.length}`);
    console.log(`   ⚡ Improvements: ${releaseNote.improvements.length}`);
    console.log(`   🔧 Maintenance: ${releaseNote.maintenance.length}`);
    console.log(`   🎨 Styling: ${releaseNote.styling.length}`);
    console.log(`   📚 Documentation: ${releaseNote.documentation.length}`);
    console.log(`   ⚠️  Breaking: ${releaseNote.breaking.length}`);
    console.log(`   📝 Other: ${releaseNote.other.length}`);

    const totalChanges = releaseNote.features.length + releaseNote.fixes.length +
        releaseNote.improvements.length + releaseNote.maintenance.length +
        releaseNote.styling.length + releaseNote.documentation.length +
        releaseNote.other.length;

    if (totalChanges === 0) {
        console.log('\n⚠️  No significant changes found.');
        
        if (isVercel) {
            console.log('ℹ️  This is normal for Vercel deployments where each commit is built separately.');
            console.log('💡 Release notes will be generated when commits follow conventional format:');
        } else {
            console.log('💡 Consider making some commits with conventional commit format:');
        }
        
        console.log('   feat: add new feature');
        console.log('   fix: resolve bug');
        console.log('   docs: update documentation');
        console.log('   style: improve styling');
        console.log('   refactor: refactor code');
        console.log('   chore: maintenance tasks');
    } else {
        console.log(`\n✅ Generated release notes with ${totalChanges} changes`);
    }

    return releaseNote;
}

// Run if called directly
if (require.main === module) {
    generateReleaseNotes();
}

module.exports = { generateReleaseNotes };