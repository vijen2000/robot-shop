pipeline {
    agent none
    options {
                // Timeout counter starts BEFORE agent is allocated
                timeout(time: 3000, unit: 'SECONDS')
            }

    stages {
        stage('Build Image') {
            agent any
            
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
