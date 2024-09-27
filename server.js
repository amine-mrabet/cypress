const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const { execSync } = require('child_process');
const videosFolder = path.join(__dirname, 'cypress/videos');
const backupFolder = path.join(__dirname, 'cypress/videos_backup');

app.use(bodyParser.json());
app.use(express.json({ limit: '300mb' }));
app.get('/cypress/runcypress', async (req, res) => {
    const filePath = `cypress/e2e/${req.query.folder}/data-json/Etablissement.json`
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const socialReason = jsonData[0].socialReason.value;
    try {
        // Backup old videos
        await backupOldVideos(videosFolder, backupFolder);
        // Run Cypress tests
        const output = execSync(`npx cypress run --spec cypress/e2e/${req.query.folder}/${req.query.folder}.cy.js`, { stdio: 'pipe' });
        await backupOldVideos(videosFolder, backupFolder);
        const beautifiedOutput = beautifyCypressOutput(output);
        res.send({ message: beautifiedOutput, socialReason: socialReason });
    } catch (error) {
        const beautifiedOutput = beautifyCypressOutput(error.stdout);
        res.status(500).send({ error: beautifiedOutput, socialReason: socialReason });
    }
});
app.post('/cypress/updateFile', (req, res) => {
    const filePath = `cypress/e2e/${req.body.folder}/data-json/${req.body.fileName}`
    const newData = req.body.content
    if (!filePath || !newData) {
        return res.status(400).json({ error: 'Missing filePath or newData parameters' });
    }
    try {
        const updatedData = newData;
        fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 4));
        return res.status(200).json({ message: 'JSON file updated successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/cypress/getContentFile', (req, res) => {
    const filePath = `cypress/e2e/${req.query.folder}/data-json/${req.query.fileName}`
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return res.json(jsonData);
});
app.get('/cypress/listFiles', (req, res) => {
    const folderPath = `cypress/e2e/${req.query.folder}/data-json`
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        // Filter out directories from the list of files
        const fileNames = files.filter(file => file != "file.json" && file != "Etablissement.txt" && file != "selection-des-garanties.txt");

        // Send the list of file names as a response
        res.json(fileNames);
    });
});
app.get('/cypress/getFolders', (req, res) => {
    const parentFolderPath = path.resolve('cypress/e2e');
    fs.readdir(parentFolderPath, (err, repo) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        // Filter out directories from the list of files
        const folders = repo.filter(folder => folder != "profile");

        // Send the list of file names as a response
        res.json(folders);
    });

});
app.get('/cypress/getVideo', (req, res) => {
    const filePath = `${backupFolder}/${req.query.folder}.cy.js.mp4`;
    const readStream = fs.createReadStream(filePath);

    // Handle errors
    readStream.on('error', (err) => {
        res.status(404).send('Error reading file');
    });

    // Pipe the file stream to the response
    readStream.pipe(res);
});

app.get('/cypress/getStatistiques', (req, res) => {
    const filePath = `cypress/reports/statistiques.json`
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return res.json(jsonData);
});
app.post('/cypress/updateFileStatistiques', (req, res) => {
    const filePath = `cypress/reports/statistiques.json`
    const newData = req.body
    if (!filePath || !newData) {
        return res.status(400).json({ error: 'Missing filePath or newData parameters' });
    }
    try {
        const updatedData = newData;
        fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 4));
        return res.status(200).json({ message: 'JSON file updated successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
function backupOldVideos(videosFolder, backupFolder) {
    return new Promise((resolve, reject) => {
        // Ensure the backup folder exists
        if (!fs.existsSync(backupFolder)) {
            fs.mkdirSync(backupFolder, { recursive: true });
        }

        fs.readdir(videosFolder, (err, files) => {
            if (err) {
                console.error('Failed to list contents of directory:', err);
                return reject(err);
            }

            const copyPromises = files
                .filter(file => file.endsWith('.mp4')) // Assuming Cypress generates .mp4 files
                .map(file => {
                    const oldPath = path.join(videosFolder, file);
                    const backupPath = path.join(backupFolder, file);

                    return new Promise((copyResolve, copyReject) => {
                        fs.copyFile(oldPath, backupPath, err => {
                            if (err) {
                                console.error('Failed to copy file:', err);
                                copyReject(err);
                            } else {
                                console.log(`Copied ${file} to ${backupPath}`);
                                copyResolve();
                            }
                        });
                    });
                });

            // Wait for all copy operations to complete
            Promise.all(copyPromises)
                .then(() => resolve())
                .catch(err => reject(err));
        });
    });
}
function beautifyCypressOutput(output) {
    const outputString = output.toString('utf-8');

    // Split the output into lines for processing
    const lines = outputString.split('\n').map(line => line.trim()).filter(Boolean);
    const start = lines.findIndex(line => line.includes('My Web Application Tests'));
    const end = lines.findIndex(line => line.includes('(Results)'));
    
    // Define sections for better readability
    const sections = []

    lines.forEach((line,index) => {
        if(index > start && index < end){
            sections.push(line);  
        }
    });

    let beautifiedOutput = '';
    beautifiedOutput +=  sections.join('\n') + '\n\n';

    return beautifiedOutput;
}
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
