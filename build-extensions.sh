#!/usr/bin/env bash
echo "Building extensions.."

version="1.3.4"

zip -r ./docs/dist/skipto-for-firefox-$version.zip extension-firefox  -x ".*" -x "__MACOSX"
zip -r ./docs/dist/skipto-for-chrome-$version.zip  extension-chrome   -x ".*" -x "__MACOSX"
zip -r ./docs/dist/skipto-for-edge-$version.zip    extension-edge     -x ".*" -x "__MACOSX"
crx3 extension-opera -p ../pem/opera-skipto.pem -o ./docs/dist/skipto-for-opera-$version.crx

