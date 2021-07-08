#!/usr/bin/env bash

# Get project base path
base="$( cd "$(dirname "$0")" ; cd ..; pwd -P )"

# Get package version from package.json
version=$(cat $base/package.json | grep '"version"' | awk 'BEGIN { FS=":" }; { print $2 }' | awk 'BEGIN { FS="\"" }; { print $2 }')

# Package name (if @scoped/package name is scoped-package)
tgz_filename=uvicore-vue-orm-${version}.tgz
echo $tgz_filename

# Backup main package.json to restore later
cp -rf $base/package.json /tmp/package.json

# Replace items in package.json
sed -i 's|"main": "./index.ts",|"main": "./dist/bundle.umd.js",\n  "module": "./dist/bundle.es.js",\n  "types": "./dist/index.d.ts",\n  "files": ["dist"],|g' $base/package.json

# Run vite build
cd $base && npm run build-vite

# Pack dist into tgz
cd $base && npm pack

# Move pack to dist-pack
mkdir $base/dist-pack > /dev/null 2>&1
mv $base/$tgz_filename $base/dist-pack/

# Copy main package.json back
cp -rf /tmp/package.json $base/
