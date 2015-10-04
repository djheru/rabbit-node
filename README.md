# RabbitMQ Things with Node.js

### Install
```
echo "deb http://www.rabbitmq.com/debian/ testing main" | sudo tee -a /etc/apt/sources.list.d/rabbitmq.list
curl -L -o ~/rabbitmq-signing-key-public.asc http://www.rabbitmq.com/rabbitmq-signing-key-public.asc
sudo apt-key add ~/rabbitmq-signing-key-public.asc
sudo apt-get update && sudo apt-get install -y --force-yes rabbitmq-server erlang-nox
```

### Basic Commands

##### Start Server

`rabbitmq-server`

`rabbitmq-server -detached`

##### Stop Server

`rabbitmqctl stop`

##### Status

`rabbitmqctl status`

##### Other Commands

`rabbitmqctl list_connections`

`rabbitmqctl list_exchanges`

`rabbitmqctl list_bindings`

`rabbitmqctl list_queues`

`rabbitmqctl list_channels`

### Enable Web UI

- *execute from installation sbin (e.g. /usr/sbnin)*
- *access at [http://localhost:15672](http://localhost:15672)*
- *default credentials are guest:guest*

`rabbitmq-plugins enable rabbitmq_management`


