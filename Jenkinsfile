pipeline {
    agent any

    environment {
        PROJECT_ID = "neat-pagoda-477804-m8"
        REGION = "asia-south1"
        REPO = "gemini-repo"
        SERVICE = "gemini-app"

        // 🔥 CRITICAL FIX: Tell Docker where Jenkins stores its auth file
        DOCKER_CONFIG = "/var/lib/jenkins/.docker"
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
                    // Correct image tag format (NO https://)
                    IMAGE = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}:${BUILD_NUMBER}"

                    sh "docker build -t ${IMAGE} ."
                }
            }
        }

        stage('GCloud Auth for Docker') {
            steps {
                sh '''
                    echo "Authenticating Docker with gcloud..."

                    # Register Docker credential helper for GAR
                    gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

                    # Explicit docker login using access token
                    gcloud auth print-access-token | docker login \
                        -u oauth2accesstoken --password-stdin https://${REGION}-docker.pkg.dev

                    echo "Docker auth file:"
                    cat /var/lib/jenkins/.docker/config.json
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
