const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/runcypress', (req, res) => {
    exec('npx cypress run --reporter mochawesome', (error, stdout, stderr) => {
        if (error) {
            console.error(`Cypress execution error: ${error}`);
            return res.status(500).send('Cypress execution failed');
        }
        console.log(`Cypress output: ${stdout}`);
        res.send('Cypress script executed successfully');
    });
});

app.post('/update', (req, res) => {
    //const { filePath, newData } = req.body;
    const filePath = `cypress/e2e/data-json/${req.body.fileName}`
    const newData = req.body.content
    if (!filePath || !newData) {
        return res.status(400).json({ error: 'Missing filePath or newData parameters' });
    }

    try {

        // Merge newData into the existing JSON data
        const updatedData = {  ...newData };
        console.log(updatedData);
        // Write the updated JSON data back to the file
        fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 4));

        return res.status(200).json({ message: 'JSON file updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
