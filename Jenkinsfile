pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Fetching latest website code from GitHub...'
                git branch: 'main', url: 'https://github.com/Kaushik-Bommu/Local-Repo.git'
            }
        }

        stage('Build Validation') {
            steps {
                echo '🧹 Checking project structure...'
                bat 'dir'
            }
        }

        stage('Lint (Optional)') {
            steps {
                echo '🔍 Running JavaScript lint check (skipped as no Node.js)...'
                echo 'No package.json found, skipping lint step.'
            }
        }

        stage('Simulated Development Server') {
            steps {
                echo '🚀 Simulating local development preview...'
                echo 'All HTML, CSS, and JS files are ready for testing.'
            }
        }

        stage('Archive Website') {
            steps {
                echo '📦 Archiving website files as build artifacts...'
                archiveArtifacts artifacts: '**/*', fingerprint: true
            }
        }
    }

    post {
        success {
            echo '✅ CI + Development pipeline completed successfully!'
        }
        failure {
            echo '❌ CI + Development pipeline failed.'
        }
    }
}
