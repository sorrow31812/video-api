#!/bin/bash

docker-compose down

port=$(grep PORT .env | xargs)
IFS=' ' read -ra port <<<"$port"
port = ${port[0]}
port=${port#*=}
echo container port start from: $port

echo "version: '3.5'" > docker-compose.yml
echo "services:" >> docker-compose.yml
for ((i=1;i<=$1;i++))
do
    echo "  api_video_"$i":" >> docker-compose.yml
    echo "    image: \"node:14\"" >> docker-compose.yml
    echo "    logging:" >> docker-compose.yml
    echo "      driver: \"json-file\"" >> docker-compose.yml
    echo "      options:" >> docker-compose.yml
    echo "        max-size: \"2000k\"" >> docker-compose.yml
    echo "        max-file: \"30\"" >> docker-compose.yml
    echo "    container_name: api_video_"$i >> docker-compose.yml
    echo "    restart: always" >> docker-compose.yml
    echo "    user: \"root\"" >> docker-compose.yml
    echo "    volumes:" >> docker-compose.yml
    echo "      - ./:/home/node/app" >> docker-compose.yml
    echo "    working_dir: /home/node/app" >> docker-compose.yml
    echo "    ports:" >> docker-compose.yml
    echo "      - \""$port":"$port""\" >> docker-compose.yml
    echo "    networks:" >> docker-compose.yml
    echo "      - video-network" >> docker-compose.yml
    echo "    command: \"sh run.sh $port\"" >> docker-compose.yml
    echo "" >> docker-compose.yml
    port=`expr $port + 1`
done

echo "networks:" >> docker-compose.yml
echo "  video-network:" >> docker-compose.yml
echo "    external: true" >> docker-compose.yml
echo "" >> docker-compose.yml

if [ "$2" = "1" ]
then
    echo "Starting Docker Compose Now"
    docker-compose up -d
fi
