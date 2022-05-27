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

        /*** [start] master ***/
        stage('Deploy Integration') {
            when {
                branch 'master'
            }
            steps {
                sh '''
                echo "Starting push at Master"
                git push -f ${LIVE_GIT} HEAD:refs/heads/master
                '''
            }
        }
        stage('Build Integration') {
            when {
                branch 'master'
            }
            steps {
                sh '''
				echo "Starting build at Master"
                '''
            }
        }
        stage('Test Integration') {
            when {
                branch 'master'
            }
            steps {
                sh '''
                echo "Starting test at Master"
                '''
            }
        }
        /*** [end] integration ***/


    }

}