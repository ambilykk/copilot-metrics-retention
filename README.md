# Copilot Metrics Retention
The Copilot Usage Metrics API supplies data spanning a 28-day timeframe. This Action is designed to persistently store this data over time in a JSON file format. This Action generates the Copilot Usage Metrics data in a JSON file format and stores it in the repository. Each time the Action is executed, the JSON file is refreshed to incorporate the delta data retrieved from the API.

> **_Currently this Action uses the Copilot Metrics API - alpha version_**


## PAT Token
Create a Fine-grained personal access tokens with 
       
  - **Resource owner** as Organization
  - **read & write** access to **GitHub Copilot for Business** under _Organization permissions_
        ![Screenshot 2023-08-01 at 4 09 43 PM](https://github.com/ambilykk/copilot-usage-report/assets/10282550/543d34a0-c0ab-40c7-a192-a2b7ab0fcd7c)

Pass this token as an input to the action - GITHUB_TOKEN


## Usage in workflow

Incorporate the **copilot-metrics-retention** action into your workflow and initiate the workflow either manually or through a schedule. 

Sample workflow 0: Manual trigger to **Report** and **Eliminate** Copilot Seat assignment for Users inactive for last n days

```
    name: Copilot Metrics Retention

    on:
     workflow_dispatch:
      inputs:
          org_name: 
            description: 'Organization name'
            required: true
            default: 'octodemo'
          json_path:
            description: 'JSON File path'
            required: true
            default: 'metrics.json'
         
    jobs:
     first-job:
     runs-on: ubuntu-latest
    
     steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Copilot Metrics Retention 
        uses: octodemo/copilot-metrics-retention@main
        with:        
          GITHUB_TOKEN: ${{ secrets.ORG_TOKEN }}
          org_name: ${{ inputs.org_name }} 
          json_path: ${{ inputs.json_path }} 
    
      - name: Commit and push if it changed
        run: |
            git config --global user.name 'Copilot Metrics Retention'
            git config --global user.email 'action@github.com'
            git add -A
            git diff --quiet && git diff --staged --quiet || git commit -m "Copilot Metrics data update"
            git push
     
```

## Parameters

| Name                           | Required  | Description                                                           |
|--------------------------------|------------|----------------------------------------------------------------------|
| GITHUB_TOKEN                 | Yes | PAT Token for access    |
| org_name                       | Yes | GitHub Organization Name                                      |
| json_path                       | Yes | JSON file path to store the Copilot Metrics dtaa in repository                          |

> ** Directory creation is not supported in this version. Action will generate the JSON file in the root directory of the repository



# License

The scripts and documentation in this project are released under the [MIT License](./LICENSE)