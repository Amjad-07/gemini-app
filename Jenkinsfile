pipeline {
    agent any

    environment {
        PROJECT_ID = "neat-pagoda-477804-m8"
        REGION = "asia-south1"
        REPO = "gemini-repo"
        SERVICE = "gemini-app"
    }

    stages {

        stage('Authenticate to Google Cloud') {
            steps {
                withCredentials([file(credentialsId: 'gcp-json', variable: 'GCLOUD_KEY')]) {
                    sh '''
                        echo === Activating GCP Service Account ===
                        gcloud auth activate-service-account 409285328475-compute@developer.gserviceaccount.com --key-file="$GCLOUD_KEY"
                        gcloud config set project neat-pagoda-477804-m8
                        gcloud auth configure-docker asia-south1-docker.pkg.dev --quiet
                    '''
                }
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
                    def IMAGE = "asia-south1-docker.pkg.dev/${PROJECT_ID}/${REPO}/${SERVICE}:${BUILD_NUMBER}"

                    echo "=== Building Docker Image: ${IMAGE} ==="
                    sh "docker build -t ${IMAGE} ."

                    env.IMAGE = IMAGE
                }
            }
        }

        stage('Push Image to Artifact Registry') {
            steps {
                sh '''
                    echo === Logging into Artifact Registry ===
                    gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://asia-south1-docker.pkg.dev
                    
                    echo === Pushing Image ===
                    docker push ${IMAGE}
                '''
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                sh '''
                    echo === Deploying to Cloud Run ===
                    gcloud run deploy ${SERVICE} \
                        --image ${IMAGE} \
                        --region ${REGION} \
                        --platform managed \
                        --allow-unauthenticated \
                        --project neat-pagoda-477804-m8
                '''
            }
        }
    }
}
