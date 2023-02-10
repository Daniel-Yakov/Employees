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
    }

    agent any

    stages {
        stage('checkout'){
            steps{
                deleteDir()
                checkout scm
            }
        }

        stage('build'){
            steps{
                sh """
                    cd app-server
                    docker build -t employee .
                """
            }
        } 

        stage('unit_test'){
            steps{
                sh """
                    docker run -d --name test --network portfolio_default employee
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
    }

    post {
        success {
            setBuildStatus("Build complete", "done", "success");
        }

        failure {
            setBuildStatus("Build failed", "broke", "failure");
        }
    }
}