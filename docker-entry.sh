#bash <(curl https://raw.githubusercontent.com/ory/meta/master/install.sh) -b . ory
#cp ./ory /usr/local/bin/
echo $1
echo $2
ory proxy http://127.0.0.1:3000 $1 --project $2 --quiet &
npm run start:prod