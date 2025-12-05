pipeline {
    agent any

    environment {
        PROJECT_ID = "neat-pagoda-477804-m8"
        REGION = "asia-south1"
        REPO = "gemini-repo"
        SERVICE = "gemini-app"   // Cloud Run service name (change if needed)
    }

    stages {

        stage('Checkout Code') {
            steps {
                git 'https://github.com/Amjad-07/gemini-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh "npm install"
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    IMAGE = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}:${BUILD_NUMBER}"
                    sh "docker build -t ${IMAGE} ."
                }
            }
        }

        stage('Push Image to Artifact Registry') {
            steps {
                sh "docker push ${IMAGE}"
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                sh """
                gcloud run deploy ${SERVICE} \
                  --image ${IMAGE} \
                  --region ${REGION} \
                  --platform managed \
                  --allow-unauthenticated \
                  --project ${PROJECT_ID}
                """
            }
        }
    }
}
