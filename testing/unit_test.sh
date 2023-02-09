#!/bin/bash


##################################################################################
# Health check

test=$(curl http://test:3000/employees/health)

res=$(cat testing/ans.txt | head -n 3 | tail -1) 

if [[ $(echo "$test" | jq -c . ) != $(echo "$res" | jq -c . ) ]]; then
   echo "Server is NOT healthly"
   exit 1
fi

echo "Server is healthly"
exit 0