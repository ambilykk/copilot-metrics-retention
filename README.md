# Copilot Metrics Retention
The Copilot Metrics API supplies data spanning a 28-day timeframe. This Action is designed to persistently store this data over time in a JSON file format. This Action generates the Copilot Metrics data in a JSON file format and stores it in the repository. Each time the Action is executed, the JSON file is refreshed to incorporate the delta data retrieved from the API.

Note: 
- The Copilot Metrics API is available for GitHub Copilot for Business customers only.
- Copilot Metrics Retention Action is designed to work with Copilot Metrics API for Organizations only.
- API Documentation https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28



## PAT Token
Create a Fine-grained personal access tokens with 
       
  - **Resource owner** as Organization
  - **read & write** access to **GitHub Copilot for Business** under _Organization permissions_
        ![gh image](https://github.com/octodemo/copilot-metrics-retention/assets/10282550/a9f8750a-ee61-467a-b7d7-059fc16b9ab7)


Pass this token as an input to the action - GITHUB_TOKEN


## Matrics in workflow

Incorporate the **copilot-metrics-retention** action into your workflow and initiate the workflow either manually or through a schedule. 

Sample workflow file:

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
        uses: ambilykk/copilot-metrics-retention@main
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



# License

The scripts and documentation in this project are released under the [MIT License](./LICENSE)
