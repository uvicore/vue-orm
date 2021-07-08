#!/usr/bin/env bash

# Get project base path
base="$( cd "$(dirname "$0")" ; cd ..; pwd -P )"

if [ "$1" == "" ]; then
    echo "Usage: ./bin/deploy.sh ./dist-pack/some.tgz"
    exit 1
fi

echo "Deploying $1 now..."
npm publish --access public $1
