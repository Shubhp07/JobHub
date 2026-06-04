const fs = require('fs');
const path = require('path');

const profilePath = path.join(__dirname, 'src', 'components', 'dashboard', 'Profile.jsx');
const profileDir = path.join(__dirname, 'src', 'components', 'dashboard', 'profile');

if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
}

const content = fs.readFileSync(profilePath, 'utf8');

// Extract SkillsEditor
const skillsRegex = /function SkillsEditor\([\s\S]*?\n\}\n/;
const skillsMatch = content.match(skillsRegex);
if (skillsMatch) {
    const skillsCode = `import React, { useState } from "react";\nimport { Plus, X } from "lucide-react";\n\nexport default ${skillsMatch[0]}`;
    fs.writeFileSync(path.join(profileDir, 'SkillsEditor.jsx'), skillsCode, 'utf8');
}

// Extract ExperienceEditor
const expRegex = /function ExperienceEditor\([\s\S]*?\n\}\n/;
const expMatch = content.match(expRegex);
if (expMatch) {
    const expCode = `import React, { useState } from "react";\nimport { Plus, Trash2 } from "lucide-react";\n\nexport default ${expMatch[0]}`;
    fs.writeFileSync(path.join(profileDir, 'ExperienceEditor.jsx'), expCode, 'utf8');
}

// Extract EducationEditor
const eduRegex = /function EducationEditor\([\s\S]*?\n\}\n/;
const eduMatch = content.match(eduRegex);
if (eduMatch) {
    const eduCode = `import React, { useState } from "react";\nimport { Plus, Trash2 } from "lucide-react";\n\nexport default ${eduMatch[0]}`;
    fs.writeFileSync(path.join(profileDir, 'EducationEditor.jsx'), eduCode, 'utf8');
}

// Update Profile.jsx
let newContent = content;
newContent = newContent.replace(skillsRegex, '');
newContent = newContent.replace(expRegex, '');
newContent = newContent.replace(eduRegex, '');
newContent = newContent.replace('// Helper Components Below (unchanged)', '');

// Add imports
const imports = `
import SkillsEditor from "./profile/SkillsEditor";
import ExperienceEditor from "./profile/ExperienceEditor";
import EducationEditor from "./profile/EducationEditor";
`;

newContent = newContent.replace(/(import React.*?;\n[\s\S]*?['"]lucide-react['"];)/, `$1\n${imports}`);

// Write back the new Profile.jsx
fs.writeFileSync(profilePath, newContent, 'utf8');

console.log('Successfully split Profile.jsx into smaller components!');
