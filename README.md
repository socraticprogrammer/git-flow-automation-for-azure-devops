# Git Flow automation for Azure Devops

This repository is dedicated to automate the process of use Git Flow with PR's on Azure Devops.

## Abstract algorithm

### When start short-lived branch

1. Create Pull Request as a draft on Azure Devops
2. Create and checkout to short-lived branch [feature, hotfix... whatever]

### When finish the work on short-lived branch

3. Publish Pull Request
4. Approve Pull Request on Azure Devops
5. Merge Pull Request on Azure Devops
6. Checkout to long-lived branch [develop, main]
7. Pull changes on long-lived branch
8. Finish short-lived branch

## To do list

- [] Support feature branches
- [] Support hotfix branches
