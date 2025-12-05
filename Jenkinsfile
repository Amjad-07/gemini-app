pipeline {
    agent any

    environment {
        PROJECT_ID = "neat-pagoda-477804-m8"
        REGION = "asia-south1"
        REPO = "gemini-repo"
        SERVICE = "gemini-app"

        // Use your actual Jenkins credential ID
        GCLOUD_CREDS = credentials('gcp-sa')

        // Ensure Docker reads credentials inside workspace
        DOCKER_CONFIG = "$WORKSPACE/.docker"
    }

    stages {

        stage('Authenticate to Google Cloud') {
            steps {
                sh '''
                    echo "Activating service account..."

                    mkdir -p ${DOCKER_CONFIG}

                    # Authenticate using JSON key
                    gcloud auth activate-service-account --key-file="${GCLOUD_CREDS}"

                    # Set project
                    gcloud config set project ${PROJECT_ID}

                    # Configure Docker to use gcloud helper
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
                    echo "Logging into Artifact Registry..."
                    gcloud auth print-access-token | docker login \
                        -u oauth2accesstoken --password-stdin https://${REGION}-docker.pkg.dev
                '''
            }
        }

        stage('Push Image to Artifact Registry') {
            steps {
                sh '''
                    echo "Pushing image..."
                    docker push ${IMAGE}
                '''
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
