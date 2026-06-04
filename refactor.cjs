const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// 1. Rename Folders
const oldLayouts = path.join(srcDir, 'Layouts');
const newLayouts = path.join(srcDir, 'layouts');
if (fs.existsSync(oldLayouts)) {
    fs.renameSync(oldLayouts, newLayouts);
    console.log('Renamed Layouts -> layouts');
}

const oldEmployerDash = path.join(srcDir, 'components', 'Employer-Dashboard');
const newEmployerDash = path.join(srcDir, 'components', 'employer-dashboard');
if (fs.existsSync(oldEmployerDash)) {
    fs.renameSync(oldEmployerDash, newEmployerDash);
    console.log('Renamed Employer-Dashboard -> employer-dashboard');
}

// 2. Create Auth Folder and Move
const authDir = path.join(srcDir, 'components', 'auth');
if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir);
}
const authFiles = ['RequireAuth.jsx', 'RequireRole.jsx', 'ProtectedRoute.jsx'];
authFiles.forEach(file => {
    const oldPath = path.join(srcDir, 'components', file);
    const newPath = path.join(authDir, file);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Moved ${file} to auth/`);
    }
});

// 3. Move EmployerDashboardLayout
const oldEdLayout = path.join(srcDir, 'pages', 'EmployerDashboardLayout.js');
const newEdLayout = path.join(newLayouts, 'EmployerDashboardLayout.jsx');
if (fs.existsSync(oldEdLayout)) {
    fs.renameSync(oldEdLayout, newEdLayout);
    console.log('Moved EmployerDashboardLayout.js -> layouts/EmployerDashboardLayout.jsx');
}

// 4. Update Import Paths in all .jsx and .js files
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);

allFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Replace Layouts with layouts
    content = content.replace(/['"](.*)\/Layouts\/(.*)['"]/g, "'$1/layouts/$2'");
    content = content.replace(/['"]\.\/Layouts\/(.*)['"]/g, "'./layouts/$1'");
    
    // Replace Employer-Dashboard with employer-dashboard
    content = content.replace(/Employer-Dashboard/g, 'employer-dashboard');

    // Fix auth imports
    content = content.replace(/['"](.*)\/components\/RequireAuth['"]/g, "'$1/components/auth/RequireAuth'");
    content = content.replace(/['"](.*)\/components\/RequireRole['"]/g, "'$1/components/auth/RequireRole'");
    content = content.replace(/['"](.*)\/components\/ProtectedRoute['"]/g, "'$1/components/auth/ProtectedRoute'");

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated imports in ${filePath.replace(__dirname, '')}`);
    }
});

console.log('Refactoring complete.');
