#bash <(curl https://raw.githubusercontent.com/ory/meta/master/install.sh) -b . ory
#cp ./ory /usr/local/bin/
ory proxy http://127.0.0.1:3000 $1 --port $3 --project $2 -y &
echo "ory proxy http://127.0.0.1:3000 $1 --port $3 --project $2 -y &"
npm run run-backend