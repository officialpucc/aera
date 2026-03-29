const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const BACKLOG_PATH = path.join(__dirname, '../docs/backlog.md');

function syncBacklog() {
    if (!fs.existsSync(BACKLOG_PATH)) {
        console.error('Backlog file not found at:', BACKLOG_PATH);
        process.exit(1);
    }

    const content = fs.readFileSync(BACKLOG_PATH, 'utf8');
    const lines = content.split('\n');

    let currentSection = '';
    let currentSprintLabel = '';
    let currentEpic = null;
    let epicBody = [];

    console.log('Parsing backlog and creating issues...');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detect Sections
        if (line.startsWith('## Epics & Stories')) {
            currentSection = 'EPICS';
            continue;
        } else if (line.startsWith('## Sprint')) {
            currentSection = 'SPRINT';
            currentSprintLabel = line.replace('## ', '').split(':')[0].trim().toLowerCase().replace(/\s+/g, '-');
            continue;
        }

        // Parse Epics
        if (currentSection === 'EPICS' && line.startsWith('### Epic')) {
            // Create previous epic if exists
            if (currentEpic) createIssue(currentEpic, epicBody.join('\n'), 'epic');
            
            currentEpic = line.replace('### ', '').trim();
            epicBody = [];
        } else if (currentSection === 'EPICS' && line.startsWith('*')) {
            epicBody.push(line);
        }

        // Parse Sprint Tasks
        if (currentSection === 'SPRINT' && line.startsWith('* **A-')) {
            const match = line.match(/\* \*\*(A-\d+)\*\*:\s*(.*)/);
            if (match) {
                const title = `${match[1]}: ${match[2]}`;
                createIssue(title, `Task part of ${currentSprintLabel}`, `task,${currentSprintLabel}`);
            }
        }
    }

    // Create final epic
    if (currentEpic) createIssue(currentEpic, epicBody.join('\n'), 'epic');

    console.log('Sync complete.');
}

function createIssue(title, body, labels) {
    console.log(`Creating: ${title} [${labels}]`);
    try {
        // We use --recover to avoid duplicates if the script is re-run, 
        // but since 'gh' doesn't have a built-in 'upsert', we just execute.
        const cmd = `gh issue create --title "${title}" --body "${body.replace(/"/g, '\\"')}" --label "${labels}"`;
        execSync(cmd, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Failed to create issue: ${title}`);
    }
}

syncBacklog();
