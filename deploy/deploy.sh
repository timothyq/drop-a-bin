if [ ! -f ".env" ]; then
    echo MONGO_USERNAME=$1 > .env
    echo MONGO_PASSWORD=$2 >> .env
fi

sudo docker-compose up -d
