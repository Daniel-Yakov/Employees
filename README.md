# Employees DevOps portfolio
## Source code repository
This repository contains the source code of a simple RESTful application. It includes a Dockerfile to dockerize the app, a docker-compose file that the tests run against in the CI pipeline, and a Jenkinsfile that runs in the MBP Jenkins job. 

![Project architecture image](architecture.jpg)

## Requirments
1. To run the CI pipeline, you will need a Jenkins instance. The Jenkins MBP should make use of the following plugins:

- Amazon ECR plugin
- Authentication Tokens API Plugin
- CloudBees AWS Credentials Plugin
- Slack Notification Plugin

You should also install any additional plugins suggested during the installation process. Additionally, you will need to configure the IP address of the Jenkins instance within the Jenkins "configure system" settings. Finally, you will also need to configure any necessary plugins, such as the Slack app and credentials, as necessary.

2. ECR repository: make changes in Jenkins file as necessary to match your repository.
