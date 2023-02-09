#!/bin/bash

host="localhost"

##################################################################################
# Adding employee

test=$(curl -X POST http://${host}/employees \
   -H 'Content-Type: application/json' \
   -d '{"name": "daniel", "age": "22", "position": "junior", "salary": "4367"}' | jq 'del(._id, .__v)')

res=$(cat ans.txt | head -n 1) 

if [[ $(echo "$test" | jq -c . ) != $(echo "$res" | jq -c . ) ]]; then
   echo "Adding an employee test failed"
   exit 1
fi

echo "Added employee successfully"

##################################################################################
# Adding employee

test=$(curl http://${host}/employees  | jq '.[0]')

id=$(echo $test | jq -r '._id') # to be used further during the testing

test=$(echo $test | jq 'del(._id, .__v)')

if [[ $(echo "$test" | jq -c . ) != $(echo "$res" | jq -c . ) ]]; then
   echo "List all employees failed"
   exit 1
fi

echo "List all employees successed"

##################################################################################
# Get specific employee

test=$(curl http://${host}/employees/${id} | jq 'del(._id, .__v)')

if [[ $(echo "$test" | jq -c . ) != $(echo "$res" | jq -c . ) ]]; then
   echo "Get employee failed"
   exit 1
fi

echo "Get employee successed"

##################################################################################
# Update employee

test=$(curl -X PUT http://${host}/employees/${id} \
   -H 'Content-Type: application/json' \
   -d '{"name": "daniel-changed", "salary": "14000"}' | jq 'del(._id, .__v)')

res=$(cat ans.txt | head -n 2 | tail -1) 

if [[ $(echo "$test" | jq -c . ) != $(echo "$res" | jq -c . ) ]]; then
   echo "Update an employee test failed"
   exit 1
fi

echo "Updated employee successfully"

##################################################################################
# delete employee

test=$(curl -X DELETE http://${host}/employees/${id})

res=$(cat ans.txt | head -n 3 | tail -1) 

if [[ $(echo "$test" | jq -c . ) != $(echo "$res" | jq -c . ) ]]; then
   echo "Delete employee test failed"
   exit 1
fi

echo "Deleted employee successfully"
##################################################################################

echo "E2E tests ended successfully"
exit 0
