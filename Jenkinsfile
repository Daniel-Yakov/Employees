void setBuildStatus(String message, String context, String state) {
    // use the token configured with the name 'github' to update the commit status in github ui
    withCredentials([string(credentialsId: 'github', variable: 'TOKEN')]) {
        // make the http request to the repository to update the commit status
        sh """
            curl \"https://api.github.com/repos/Daniel-Yakov/Employees/statuses/$GIT_COMMIT\" \
                -H \"Authorization: token $TOKEN\" \
                -H \"Content-Type: application/json\" \
                -X POST \
                -d \"{\\\"description\\\": \\\"$message\\\", \\\"state\\\": \\\"$state\\\", \\\"context\\\": \\\"$context\\\", \\\"target_url\\\": \\\"$BUILD_URL\\\"}\"
        """
    } 
}

pipeline {
    options {
        timestamps()
        timeout(time:4, unit:'MINUTES')
        buildDiscarder(logRotator(
            numToKeepStr: '4',
            daysToKeepStr: '7',
            artifactNumToKeepStr: '30'
        ))
    }

    agent any

    stages {
        stage('checkout'){
            steps{
                checkout scm
            }
        }

        stage('build'){
            steps{
                sh """
                    cd app-server
                    docker build -t employees .
                """
            }
        } 

        stage('unit_test'){
            steps{
                sh """
                    docker run -d --name test --network portfolio_default employees
                    sleep 2
                    bash testing/unit_test.sh
                """
            }
            post {
                always { 
                    sh """
                        docker stop test
                        docker rm test
                    """
                }
            }
        }

        stage('e2e'){
            steps{
                sh """
                    docker compose up -d 
                    sleep 2

                    docker cp ./nginx/nginx.conf nginx:/etc/nginx/conf.d/default.conf 
                    docker exec nginx nginx -s reload
                    sleep 1
                    
                    bash testing/e2e.sh nginx
                """
            }
            post {
                always {
                    sh """
                        docker compose down -v 
                    """
                }
            }
        }

        stage('tag'){
            when { branch "main" }

            steps {
                sh """                     
                    NEXTVERSION=\$(git describe --tags | cut -d '-' -f1 | awk -F. -v OFS=. '{\$NF += 1 ; print}')
                    
                    if [ "\$NEXTVERSION" = "" ]; then
                        NEXTVERSION="1.0.0"
                    fi

                    echo \$NEXTVERSION > v.txt
                """
            }
        }

        stage('publish'){
            when { branch "main" }
            
            steps {
                script {
                    def VERSION = sh ( 
                        script: 'cat v.txt',
                        returnStdout: true 
                    ).trim() 

                    sh "docker tag employees:latest employees:${VERSION}"
                    
                    // push the image with the correct tag to ECR
                    docker.withRegistry("https://644435390668.dkr.ecr.eu-west-3.amazonaws.com", "ecr:eu-west-3:publish-ecr") {
                        docker.image("employees:${VERSION}").push()
                    }

                    sh """ 
                        git checkout $GIT_BRANCH
                        git tag $VERSION
                        git push origin $VERSION
                    """
                }
            }
        }

        stage('deploy'){
            when { branch "main" }
            
            steps {
                script {
                    def VERSION = sh ( 
                        script: 'cat v.txt',
                        returnStdout: true  
                    ).trim() 

                    sh """ 
                        eval `ssh-agent -s`
                        ssh-add ~/.ssh/update_repo
                        
                        git clone git@github.com:Daniel-Yakov/employees-gitops-config.git
                        cd employees-gitops-config

                        sed -i "s/tag: .*/tag: ${VERSION}/" ./app/values.yaml

                        git add ./app/values.yaml
                        git commit -m "jenkins update image to version ${VERSION}"
                        git push origin main  
                    """
                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
        success {
            setBuildStatus("Build complete", "done", "success")
            slackSend(color: 'good', message: "Success on branch ${env.GIT_BRANCH}. For more information: ${env.BUILD_URL}")
        }

        failure {
            setBuildStatus("Build failed", "broke", "failure")
            slackSend(color: 'danger', message: "Failed on branch ${env.GIT_BRANCH}. For more information: ${env.BUILD_URL}")
        }
    }
}