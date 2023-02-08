#!/bin/bash
rootFolder=$1
buildFolder="$rootFolder/build"
buildDist="$rootFolder/build/dist"

npm i
npx webpack --mode=production --config webpack.config.js

if [ ! -d $buildFolder ]; then
    mkdir $buildFolder
fi
if [ ! -d "$buildDist" ]; then
    mkdir $buildDist
fi
cp $rootFolder/index.html $buildFolder
cp $rootFolder/style.css $buildFolder
cp $rootFolder/dist/* $buildDist