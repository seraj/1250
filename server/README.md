# 1250 server

install :

```bash
sudo apt update
sudo apt install -y mongodb
npm install mongodb -g
npm link mongodb

npm i
```

create db:

```bash
node create_db.js
node create_collection.js
```

run server:

```bash
node index.js
```
