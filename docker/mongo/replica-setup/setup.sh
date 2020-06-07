#!/bin/bash
echo **************************************
echo Starting the replica set
echo **************************************

sleep 10 | echo Sleeping
mongo --host vcc-mongo-primary:27017 --username root --password "aaAA11!!" replicaSet.js