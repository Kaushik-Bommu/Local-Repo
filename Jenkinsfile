pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Fetching latest code from GitHub...'
                git branch: 'main', url: 'https://github.com/Kaushik-Bommu/Local-Repo.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                bat 'mvn clean compile'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                bat 'mvn test'
            }
        }
    }

    post {
        success {
            echo '✅ Continuous Integration and Development successful!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}
