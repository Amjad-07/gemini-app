pipeline {
    agent any

    environment {
        PROJECT_ID = "neat-pagoda-477804-m8"
        REGION = "asia-south1"
        REPO = "gemini-repo"
        SERVICE = "gemini-app"
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
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

        stage('GCloud Auth for Docker') {
            steps {
                sh '''
                    echo "Authenticating Docker with gcloud..."
                    gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet
                    gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://${REGION}-docker.pkg.dev
                '''
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
