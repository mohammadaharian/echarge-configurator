pipeline {

    environment {
        LIVE_GIT="git@github.com:Deltaco-AB/echarge-configurator.git"
    }

    options {
       disableConcurrentBuilds()
    }

    agent {
        node{
            label 'Ubuntu01'
        }
    }

    stages {

        /*** [start] integration ***/
        stage('Deploy Integration') {
            when {
                branch 'integration'
            }
            steps {
                sh '''
                echo "Starting push at Staging"
                git push -f ${LIVE_GIT} HEAD:refs/heads/master
                '''
            }
        }
        stage('Build Integration') {
            when {
                branch 'integration'
            }
            steps {
                sh '''
				echo "Starting build at Integration"
                '''
            }
        }
        stage('Test Integration') {
            when {
                branch 'integration'
            }
            steps {
                sh '''
                echo "Starting test at Integration"
                '''
            }
        }
        /*** [end] integration ***/


    }

}