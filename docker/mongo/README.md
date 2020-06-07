# Docker Tutorial 12

Mongo cluster, deploying a ReplicaSet

### To run the cluster:
```
docker-compose up
```

### Connect to the primary node
```
docker-compose exec vcc-mongo-primary mongo -u "root" -p "password"
```

### Instantiate the replica set
```
rs.initiate({"_id" : "vcc-replica-set","members" : [{"_id" : 0,"host" : "vcc-mongo-primary:27017"},{"_id" : 1,"host" : "vcc-mongo-worker-1:27017"},{"_id" : 2,"host" : "vcc-mongo-worker-2:27017"}]});
```

### Set the priority of the master over the other nodes
```
conf = rs.config();
conf.members[0].priority = 2;
rs.reconfig(conf);
```

### Create a cluster admin
```
use admin;
db.createUser({user: "cluster_admin",pwd: "aaAA11!!",roles: [ { role: "userAdminAnyDatabase", db: "admin" },  { "role" : "clusterAdmin", "db" : "admin" } ]});
db.auth("cluster_admin", "aaAA11!!");
```

### Create a collection on a database
```
use vcc;
db.createUser({user: "vccAdmin",pwd: "aaAA11!!",roles: [ { role: "readWrite", db: "vcc" } ]});
db.createCollection('my_collection');
```

### Verify credentials
```
docker-compose exec vcc-mongo-primary mongo -u "vccAdmin" -p "aaAA11!!" --authenticationDatabase "vcc"
```

### Destory the cluster
```
docker-compose down
```

For Secondary db:

db.setSlaveOk()