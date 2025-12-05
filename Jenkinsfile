pipeline {
    agent any

    environment {
        PROJECT_ID = "neat-pagoda-477804-m8"
        REGION = "asia-south1"
        REPO = "gemini-repo"
        SERVICE = "gemini-app"

        // Use the JSON key uploaded in Jenkins credentials
        GCLOUD_CREDS = credentials('gcp-json')

        // Docker will use this custom config path so Jenkins doesn't get confused
        DOCKER_CONFIG = "$WORKSPACE/.docker"
    }

    stages {

        stage('Authenticate to Google Cloud') {
            steps {
                sh '''
                    echo "=== Activating GCP Service Account ==="
                    mkdir -p ${DOCKER_CONFIG}

                    # Authenticate using JSON key
                    gcloud auth activate-service-account 409285328475-compute@developer.gserviceaccount.com \
                        --key-file="${GCLOUD_CREDS}"

                    # Set project
                    gcloud config set project ${PROJECT_ID}

                    # Configure Docker to use gcloud credentials
                    gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet
                '''
            }
        }

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

        stage('Docker Login (Token-based)') {
            steps {
                sh '''
                    echo "=== Docker Login to Artifact Registry ==="
                    gcloud auth print-access-token | docker login \
                        -u oauth2accesstoken --password-stdin https://${REGION}-docker.pkg.dev
                '''
            }
        }

        stage('Push Image to Artifact Registry') {
            steps {
                sh '''
                    echo "=== Pushing Image to Artifact Registry ==="
                    docker push ${IMAGE}
                '''
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                sh """
                    echo "=== Deploying to Cloud Run ==="
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
