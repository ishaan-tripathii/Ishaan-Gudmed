pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerHubCredentials')
        DOCKER_IMAGE = "20scse1010239/GudMed"
        VPS_IP = "46.202.164.138"
        DOCKER_IMAGE_TAG = "${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
        NODE_OPTIONS = '--max-old-space-size=2048'
        NPM_CACHE_DIR = "${env.WORKSPACE}/.npm-cache"
        GIT_CREDENTIALS_ID = 'github-credentials'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/Harshraj843112/practice-ci-cd.git', 
                    credentialsId: "${GIT_CREDENTIALS_ID}"
            }
        }
        
        stage('Setup Environment') {
            steps {
                sh '''#!/bin/bash
                    rm -rf ${NPM_CACHE_DIR} node_modules package-lock.json build || true
                    npm cache clean --force
                    npm config set registry https://registry.npmjs.org/
                    git config --global url."https://github.com/".insteadOf "ssh://git@github.com/"
                    mkdir -p ${NPM_CACHE_DIR}
                    chmod -R 777 ${NPM_CACHE_DIR}
                '''
            }
        }
        
        stage('Build React App') {
            steps {
                sh '''#!/bin/bash
                    set -e
                    export npm_config_cache=${NPM_CACHE_DIR}
                    npm install --registry https://registry.npmjs.org/ --no-audit --no-fund --omit=dev --verbose || { echo "npm install failed"; exit 1; }
                    npm run build || { echo "npm run build failed"; exit 1; }
                    ls -la
                    if [ ! -d "build" ]; then
                        echo "Error: build directory not found!"
                        exit 1
                    fi
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh 'docker --version'
                sh "docker build -t ${DOCKER_IMAGE_TAG} -t ${DOCKER_IMAGE}:latest ."
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerHubCredentials', 
                    usernameVariable: 'DOCKER_USERNAME', 
                    passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh '''
                        echo "Using DockerHub username: $DOCKER_USERNAME"
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker push "${DOCKER_IMAGE_TAG}"
                        docker push "${DOCKER_IMAGE}:latest"
                    '''
                }
            }
        }
        
        stage('Deploy to VPS') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'vps-ssh-credentials', 
                    keyFileVariable: 'SSH_KEY', 
                    usernameVariable: 'SSH_USER')]) {
                    sh """
                        echo "Deploying to VPS as \$SSH_USER"
                        ssh -i "\$SSH_KEY" -o StrictHostKeyChecking=no "\${SSH_USER}@\${VPS_IP}" << EOF
                            set -e  # Exit on any error
                            echo "Checking Docker service..."
                            if ! docker ps >/dev/null 2>&1; then
                                echo "Starting Docker..."
                                sudo systemctl start docker || { echo "Failed to start Docker"; exit 1; }
                            fi
                            echo "Stopping and removing existing container..."
                            docker stop GudMed || true
                            docker rm GudMed || true
                            echo "Pulling Docker image ${DOCKER_IMAGE_TAG}..."
                            docker pull ${DOCKER_IMAGE_TAG} || { echo "Failed to pull image"; exit 1; }
                            echo "Running new container..."
                            docker run -d --name GudMed -p 3000:3000 ${DOCKER_IMAGE_TAG} || { echo "Failed to run container"; exit 1; }
                            echo "Pruning unused images..."
                            docker image prune -f
                            echo "Deployment completed successfully"
EOF
                    """
                }
            }
        }
    }
    
    post {
        always {
            sh '''
                docker logout || true
                docker system prune -f || true
                rm -rf node_modules build ${NPM_CACHE_DIR} || true
            '''
            cleanWs()
        }
        success {
            echo "Build ${env.BUILD_NUMBER} deployed successfully!"
        }
        failure {
            echo "Build ${env.BUILD_NUMBER} failed—check logs and resources!"
        }
    }
}