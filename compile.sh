#!/bin/bash

cd src/circuits/authentication
echo "Compiling the authentication circuit..."
nargo compile
echo "Successfully compiled the authentication circuit"