# !/bin/bash

# start the server and send the console and error logs on nodeserver.log
npm start -- ci > nodeserver.log 2>&1 &

sleep 10
echo -e "server has started\n"
exit 0