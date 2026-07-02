#!/usr/bin/env bash
echo "Building extensions.."

version="1.4.0"

cd extension-firefox
rm ../docs/dist/skipto-for-firefox-$version.zip
zip -r ../docs/dist/skipto-for-firefox-$version.zip *  -x ".*" -x "__MACOSX"

cd ../extension-chrome
rm ../docs/dist/skipto-for-chrome-$version.zip
zip -r ../docs/dist/skipto-for-chrome-$version.zip  *   -x ".*" -x "__MACOSX"

cd ../extension-edge
rm ../docs/dist/skipto-for-edge-$version.zip
zip -r ../docs/dist/skipto-for-edge-$version.zip    *     -x ".*" -x "__MACOSX"

cd ../extension-opera
crx3 . -p ../../pem/opera-skipto.pem -o ../docs/dist/skipto-for-opera-$version.crx

