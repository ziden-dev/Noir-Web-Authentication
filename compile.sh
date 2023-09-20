#!/bin/bash

cd src/circuits/authentication
echo "Compiling the authentication circuit..."
nargo compile
echo "Successfully compiled the authentication circuit"
cd ../../../
cd src/circuits/merkleTree
echo "Compiling the merkleTree circuit..."
nargo compile 
echo "Successfully compiled the merkle tree circuit"
cd ../../../
cd src/circuits/registerTransaction
echo "Compiling the registerTransaction circuit..."
nargo compile 
echo "Successfully compiled the registerTransaction circuit"
cd ../../../
cd src/circuits/addKeyTransaction
echo "Compiling the addKeyTransaction circuit..."
nargo compile 
echo "Successfully compiled the addKeyTransaction circuit"