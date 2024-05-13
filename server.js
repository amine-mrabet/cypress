const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json({ limit: '300mb' }));
app.get('/cypress/runcypress', (req, res) => {
    
    exec(`npx cypress run --reporter mochawesome --spec cypress/e2e/${req.query.folder}/${req.query.folder}.cy.js`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Cypress execution error: ${error}`);
            return res.status(500).send('Cypress execution failed');
        }
        
        res.send('Cypress script executed successfully');
    });
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
        const fileNames = files.filter(file => file != "file.json" && file != "Etablissement.txt");

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
    const filePath = `cypress/videos/${req.query.folder}.cy.js.mp4`;
    const readStream = fs.createReadStream(filePath);
    
    // Handle errors
    readStream.on('error', (err) => {
      res.status(500).send('Error reading file');
    });
  
    // Pipe the file stream to the response
    readStream.pipe(res);
  });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
