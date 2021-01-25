# starter-express-react

1. Log on as root user with SSH keys
2. Create new user [create-user.sh] (./network/bashScripts/create-user.sh)
3. Create github RSA keys [create-git-keys.sh] (./network/bashScripts/create-git-keys.sh)
4. Log onto Github.com and paste in RSA keys
5. Go back to remote instance and test connection [git-test-connection.sh] (./network/bashScripts/git-test-connection.sh)
6. Accept new known host
7. Run PM2 setup on local machine
8. Go to remote instance and put in .env keys in the respective folder
9. Run PM2 deploy update on local machine
