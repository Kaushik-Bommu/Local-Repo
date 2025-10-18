pipeline {
    agent any

    environment {
        PORT = "8080" // port for local server
    }

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
                echo '🔍 Running JavaScript lint check...'
                bat '''
                if exist package.json (
                    echo Running npm install and eslint...
                    npm install
                    npx eslint .
                ) else (
                    echo No package.json found, skipping lint step.
                )
                '''
            }
        }

        stage('Local Development Server') {
            steps {
                echo "🚀 Starting local server for development preview on port ${env.PORT}..."
                bat '''
                if exist package.json (
                    echo Starting Node.js server...
                    npx http-server -p %PORT% -c-1
                ) else (
                    echo No Node.js project, using Python SimpleHTTPServer...
                    python -m http.server %PORT%
                )
                '''
                echo "✅ Server started successfully for testing."
            }
        }

        stage('Archive Website') {
            steps {
                echo '📦 Archiving website files...'
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
