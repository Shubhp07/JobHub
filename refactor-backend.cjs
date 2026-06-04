const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'backend', 'src', 'main', 'java', 'com', 'jobhub');

const classMapping = {
    // Auth
    "AuthController": "com.jobhub.auth",
    "AuthService": "com.jobhub.auth",
    "UserDetailsServiceImpl": "com.jobhub.auth",
    "LoginRequest": "com.jobhub.auth.dto",
    "LoginResponse": "com.jobhub.auth.dto",
    "RegisterRequest": "com.jobhub.auth.dto",
    "RegisterResponse": "com.jobhub.auth.dto",

    // User
    "UserController": "com.jobhub.user",
    "UserService": "com.jobhub.user",
    "UserRepository": "com.jobhub.user",
    "User": "com.jobhub.user",
    "Education": "com.jobhub.user",
    "Experience": "com.jobhub.user",
    "Skill": "com.jobhub.user",
    "UserSkill": "com.jobhub.user",
    "UserType": "com.jobhub.user",
    "EducationDTO": "com.jobhub.user.dto",
    "ExperienceDTO": "com.jobhub.user.dto",
    "EmployerDashboardStats": "com.jobhub.user.dto",
    "UserProfileRequest": "com.jobhub.user.dto",
    "UserProfileResponse": "com.jobhub.user.dto",
    "UserSearchResponse": "com.jobhub.user.dto",

    // Job
    "JobController": "com.jobhub.job",
    "SavedJobController": "com.jobhub.job",
    "JobService": "com.jobhub.job",
    "ExternalJobService": "com.jobhub.job",
    "SavedJobService": "com.jobhub.job",
    "JobRepository": "com.jobhub.job",
    "SavedJobRepository": "com.jobhub.job",
    "Job": "com.jobhub.job",
    "SavedJob": "com.jobhub.job",
    "JobSkill": "com.jobhub.job",
    "ApplicantSummary": "com.jobhub.job.dto",
    "ExternalJobDto": "com.jobhub.job.dto",
    "JobCreateRequest": "com.jobhub.job.dto",
    "JobDto": "com.jobhub.job.dto",
    "JobResponse": "com.jobhub.job.dto",
    "JobSearchRequest": "com.jobhub.job.dto",
    "JobUpdateRequest": "com.jobhub.job.dto",

    // Application
    "JobApplicationController": "com.jobhub.application",
    "JobApplicationService": "com.jobhub.application",
    "ApplicationService": "com.jobhub.application",
    "JobApplicationRepository": "com.jobhub.application",
    "JobApplication": "com.jobhub.application",
    "ApplicantDto": "com.jobhub.application.dto",
    "ApplicationCreateRequest": "com.jobhub.application.dto",
    "ApplicationResponse": "com.jobhub.application.dto",
    "ApplicationStatusUpdateRequest": "com.jobhub.application.dto",

    // Message
    "MessageController": "com.jobhub.message",
    "MessageService": "com.jobhub.message",
    "MessageRepository": "com.jobhub.message",
    "Message": "com.jobhub.message",
    "ConversationResponse": "com.jobhub.message.dto",
    "MessageRequest": "com.jobhub.message.dto",
    "MessageResponse": "com.jobhub.message.dto",

    // Email
    "EmailService": "com.jobhub.common"
};

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.java')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);
const originalFiles = [...allFiles];

// Track where files will go to rewrite imports
const classToOldImportMap = {};
const classToNewImportMap = {};

allFiles.forEach(file => {
    const className = path.basename(file, '.java');
    
    // Find the old package
    const content = fs.readFileSync(file, 'utf8');
    const pkgMatch = content.match(/^package\s+(com\.jobhub[\w.]+)\s*;/m);
    if (pkgMatch) {
        classToOldImportMap[className] = `${pkgMatch[1]}.${className}`;
    }

    if (classMapping[className]) {
        classToNewImportMap[className] = `${classMapping[className]}.${className}`;
    } else if (pkgMatch) {
        // Classes not moving keep their old import
        classToNewImportMap[className] = `${pkgMatch[1]}.${className}`;
    }
});

allFiles.forEach(file => {
    const className = path.basename(file, '.java');
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // 1. Update package statement if class is moving
    if (classMapping[className]) {
        const newPkg = classMapping[className];
        content = content.replace(/^package\s+com\.jobhub[\w.]*\s*;/m, `package ${newPkg};`);
        modified = true;
    }

    // 2. Update all imports
    Object.keys(classToNewImportMap).forEach(targetClass => {
        const oldImport = classToOldImportMap[targetClass];
        const newImport = classToNewImportMap[targetClass];
        if (oldImport && oldImport !== newImport) {
            const importRegex = new RegExp(`import\\s+${oldImport.replace(/\./g, '\\.')}\\s*;`, 'g');
            if (importRegex.test(content)) {
                content = content.replace(importRegex, `import ${newImport};`);
                modified = true;
            }
        }
    });

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated content for ${className}`);
    }

    // 3. Move the file if necessary
    if (classMapping[className]) {
        const newPkgDir = classMapping[className].split('.').slice(2).join('/');
        const targetDir = path.join(srcDir, newPkgDir);
        
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        const targetFile = path.join(targetDir, `${className}.java`);
        if (file !== targetFile) {
            fs.renameSync(file, targetFile);
            console.log(`Moved ${className}.java to ${targetDir}`);
        }
    }
});

console.log('Backend refactoring complete. Remember to clean up empty directories manually or automatically.');
