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
                    docker run -d --name test employee
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
    }
}