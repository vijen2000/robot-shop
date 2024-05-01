pipeline {
    agent {
        docker { image 'node:20.11.1-alpine3.19' }
    }
    options {
                // Timeout counter starts BEFORE agent is allocated
                timeout(time: 3000, unit: 'SECONDS')
            }

    stages {
        stage('Build Image') {
            
            steps {
                echo 'Find All the Dockerfiles'

                powershell '''

                    function Imagebuild{
                        
                        param(
                            [string]$dir
                            [string]$imagename
                    )

                        docker build -t $imagename:${env:BUILD_ID} $dir\\.                

                    }

                    Imagebuild -dir ${env:WORKSPACE}\\cart -imagename cart

                '''

            }
        }
    }
}
