// libs for github & graphql
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs");
const { dirname } = require("path");
const makeDir = require("make-dir");

// get the octokit handle 
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
const octokit = github.getOctokit(GITHUB_TOKEN);

// inputs defined in action metadata file
const org_Name = core.getInput('org_name');
const json_path = core.getInput('json_path');

let totalSeats = 0;

// Copilot Usage Metrics API call
async function getUsage(org) {
    try {

        return await octokit.request('GET /orgs/{org}/copilot/usage', {
            org: org_Name,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

    } catch (error) {
        core.setFailed(error.message);
    }
}

// Extract Copilot usage data with a pagination of 50 records per page
async function run(org_Name, csv_path) {

    try {
        await makeDir(dirname(csv_path));

        await getUsage(org_Name).then(metricsResult => {
            let metricsData = metricsResult.data;

            //check the file exists or not 
            if (!fs.existsSync(json_path)) {
                // The file doesn't exist, create a new one with an empty JSON object
                fs.writeFileSync(json_path, JSON.stringify([], null, 2));
            }
            
            //check the file is empty or not
            let data = fs.readFileSync(json_path, 'utf8'); // read the file

            // file contains only [] indicating a blank file
            // append the entire data to the file
            if (data.trim() === '[]') {
                console.log("The JSON data array is empty.");
                fs.writeFileSync(json_path, JSON.stringify(metricsData, null, 2));
            } else {
               //TODO: find the delta and append to existung file
                let jsonData = JSON.parse(data); // parse the JSON data into a JavaScript array

                if (jsonData.length > 0) {
                    let lastNode = jsonData[jsonData.length - 1]; // get the last node
                    console.log(lastNode);
                    let lastDate = new Date(lastNode.day); // get the date of the last node
                    console.log(lastDate);

                    // remove the nodes from metricsData that are older than the last node in the JSON data array
                    metricsData = metricsData.filter(node => new Date(node.day) > lastDate);
                    console.log(JSON.stringify(metricsData));

                    // append the metricsData to the file if there are any new nodes
                    if (metricsData.length > 0) {
                        jsonData = jsonData.concat(metricsData);
                        fs.writeFileSync(json_path, JSON.stringify(jsonData, null, 2));
                    }

                } else {
                    console.log("The JSON data array is empty.");
                }

            }

        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

console.log(`preamble: org name: ${org_Name} `);

// run the action code
run(org_Name, json_path);
