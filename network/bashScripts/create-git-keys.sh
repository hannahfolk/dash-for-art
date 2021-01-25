read -p "What is your Gitub.com email address: " EMAIL

# Create RSA key at location and password to be empty strings
ssh-keygen -t rsa -b 4096 -C $EMAIL -f ~/.ssh/id_rsa -q -N ""

echo "Host github.com
  HostName github.com
  User $EMAIL
  IdentityFile ~/.ssh/id_rsa" > ~/.ssh/config

# Show key to copy to github
cat ~/.ssh/id_rsa.pub
