// libs for github & graphql
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs");

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

        await getUsage(org_Name).then(metricsResult => {
            let metricsData = metricsResult.data;

            console.log(`usage metrics data: ${metricsData}`);
            console.log(`json path: ${json_path}`);

            //TODO: check the file exists or not
            //TODO: check the file is empty or not
            //TODO: find the delta and append to existung file

            // append to the existing file (or create and append if needed)
        
            let jsonData = JSON.parse(metricsData); // parse the JSON string to a JavaScript object
            fs.appendFileSync(json_path, JSON.stringify(jsonData, null, 2)); // write the formatted JSON to a file

        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

console.log(`preamble: org name: ${org_Name} `);

// run the action code
run(org_Name, json_path);
