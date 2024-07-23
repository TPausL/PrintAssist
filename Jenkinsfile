@Library("teckdigital") _
def appName = "print-assist"

pipeline {
   agent {
    kubernetes {
        inheritFrom "kaniko-template"
    }
  }
    
    stages {
        stage('Build and Tag Image') {
            steps {
                container('kaniko') {
                    script {
                        buildDockerImage(additionalImageTags: ["latest"], imageName: "print-assist")
                    }
                }
            }
        }
    }
}