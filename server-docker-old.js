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
        const command = `docker run -t -v /opt/vermeg/cypress:/e2e -w /e2e --entrypoint=cypress cypress/included run --spec cypress/e2e/${req.query.folder}/${req.query.folder}.cy.js`
        const output = execSync(command, { stdio: 'pipe' });
        await backupOldVideos(videosFolder, backupFolder);
        const beautifiedOutput = beautifyCypressOutput(output);
        res.send({ message: beautifiedOutput, socialReason: socialReason });
    } catch (error) {
        await backupOldVideos(videosFolder, backupFolder);
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
function stripAnsiCodes(input) {
    // Regular expression to match ANSI escape codes
    const ansiRegex = /\x1B\[[0-?9;]*[mG]/g;
    return input.replace(ansiRegex, '');
}
function beautifyCypressOutput(output) {
    const outputString = output.toString('utf-8');
    const plainTextOutput = stripAnsiCodes(outputString );
    // Split the output into lines for processing
    const lines = plainTextOutput.split('\n').map(line => line.trim()).filter(Boolean);
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
/* scheduleJob */
const updateFileStatistiques = async (folderCode, message, socialReason, completed) => {
    try {
        const filePath = path.resolve('cypress/reports/statistiques.json');

        // Read and parse the JSON file
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const statistiques = jsonData;

        const now = new Date();
        const formattedDate = formatDate(now);

        const history = {
            message: message,
            date: formattedDate,
            socialReason: socialReason,
            status: completed ? 'passed' : 'failed',
        };

        // Find the corresponding folder
        const folderStat = statistiques.find(element => element.name === folderCode);

        if (folderStat) {
            // Update the statistics
            if (completed) {
                folderStat.passed += 1;
            } else {
                folderStat.failed += 1;
            }
            folderStat.total += 1;
            folderStat.history.push(history);

            // Write updated data back to the file
            fs.writeFileSync(filePath, JSON.stringify(statistiques, null, 4), 'utf-8');
            console.log('Statistics updated successfully.');
        } else {
            console.error(`Folder with code '${folderCode}' not found in statistics.`);
            throw new Error(`Folder with code '${folderCode}' not found.`);
        }
    } catch (error) {
        console.error('Error updating file statistiques:', error.message);
        throw error;
    }
};
// Helper function to format date
const formatDate = (date) => {
    // Example: format the date as 'YYYY-MM-DD HH:mm:ss'
    return date.toISOString().replace('T', ' ').split('.')[0];
};

// Fonction pour exécuter une tâche
const executeTask = async (task) => {
    const filePath = `cypress/e2e/${task.id}/data-json/Etablissement.json`
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const socialReason = jsonData[0].socialReason.value;
    console.log(`[${new Date().toISOString()}] Exécution de la tâche : ${task.label} (Raison sociale : ${socialReason})`);
    try {
        const command = `docker run -t -v /opt/vermeg/cypress:/e2e -w /e2e --entrypoint=cypress cypress/included run --spec cypress/e2e/${task.id}/${task.id}.cy.js`
        const output = execSync(command, { stdio: 'pipe' });
         backupOldVideos(videosFolder, backupFolder);
        const beautifiedOutput = beautifyCypressOutput(output);
        updateFileStatistiques(task.id, beautifiedOutput, socialReason, true);
    } catch (error) {
         backupOldVideos(videosFolder, backupFolder);
         const beautifiedOutput = beautifyCypressOutput(error.stdout);
         updateFileStatistiques(task.id, beautifiedOutput, socialReason, false);
    }
};
function loadAndScheduleTasks() {
    fs.readFile(scheduleJob, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors du chargement du fichier des tâches:', err);
            return;
        }
        let tasks;
        try {
            tasks = JSON.parse(data);
        } catch (error) {
            console.error('Erreur de parsing JSON :', error.message);
            return;
        }
        tasks.forEach((task) => {
            if (task.enabled) {
                const [day, month, year, hour, minute] = task.scheduleTime
                    .split(/[\/\s:]/)
                    .map(Number);
                const jobDate = new Date(year, month - 1, day, hour, minute);
                try {
                    schedule.scheduleJob(jobDate, () => {
                        executeTask(task);
                    });
                    console.log(`Tâche "${task.label}" planifiée pour le ${task.scheduleTime}.`);
                } catch (error) {
                    console.error(`Erreur lors de la planification de la tâche "${task.label}":`, error.message);
                }
            }
        });
    });
}
// Initial load
loadAndScheduleTasks();
fs.watch(scheduleJob, (eventType) => {
    if (eventType === 'change' && !isReloading) {
        isReloading = true; // Empêche d'exécuter plusieurs fois
        console.log(`Le fichier "${scheduleJob}" a été modifié. Rechargement des tâches...`);

        // Annuler toutes les tâches planifiées existantes
        const jobs = schedule.scheduledJobs;
        for (const jobName in jobs) {
            if (jobs[jobName]) {
                jobs[jobName].cancel();
            }
        }

        // Recharger et replanifier les tâches après une brève pause
        setTimeout(() => {
            loadAndScheduleTasks();
            isReloading = false; // Réinitialise le drapeau après le rechargement
        }, 100); // 100ms pour éviter les doublons
    }
});


app.post('/cypress/updateScheduleJob', (req, res) => {
    const filePath = `cypress/reports/schedule-job.json`
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
app.get('/cypress/getScheduleJob', (req, res) => {
    const filePath = `cypress/reports/schedule-job.json`
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return res.json(jsonData);
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
