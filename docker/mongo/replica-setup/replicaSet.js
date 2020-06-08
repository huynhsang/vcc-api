rsconf = {
    _id: 'vcc-replica-set',
    members: [
        {_id: 0, host: 'vcc-mongo-primary:27017', priority: 2},
        {_id: 1, host: 'vcc-mongo-worker-1:27017', priority: 0},
        {_id: 2, host: 'vcc-mongo-worker-2:27017', priority: 0}
    ]
};

rs.initiate(rsconf);
rs.conf();
db.getMongo().setReadPref('nearest');
