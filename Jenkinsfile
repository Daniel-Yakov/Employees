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
                    sleep 3
                    bash testing/e2e.sh
                """
            }
            post {
                always {
                    sh """
                        docker compose down
                    """
                }
            }
        }
    }
}