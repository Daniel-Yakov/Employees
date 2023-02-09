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
                    pushd app-server
                    docker build -t employee .
                    popd
                """
            }
        }
    }
}