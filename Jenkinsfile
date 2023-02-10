void setBuildStatus(String message, String context, String state) {
  // add a Github access token as a global 'secret text' credential on Jenkins with the id 'github-commit-status-token'
    withCredentials([string(credentialsId: 'github', variable: 'TOKEN')]) {
      // 'set -x' for debugging. Don't worry the access token won't be actually logged
      // Also, the sh command actually executed is not properly logged, it will be further escaped when written to the log
        sh """
            set -x
            curl \"https://api.github.com/repos/org/repo/statuses/$GIT_COMMIT\" \
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