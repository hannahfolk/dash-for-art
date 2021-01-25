  
PROJECTNAME="artist-dashboard"
GITREPO="https://github.com/btran-teefury/artist-dashboard-2.git"

sudo mkdir -p /var/www/$PROJECTNAME/source
cd /var/www/$PROJECTNAME/source
sudo git init
sudo git remote add origin $GITREPO
sudo chown -R $USER /var/www/$PROJECTNAME
