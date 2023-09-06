# Keplr Example
This is a simple example if how to use Keplr extension. 

## Requirements
 - Node.js v18+
 - protoc v21.3 (recommended)
```bash
# This script is example for mac arm64 user. for other OS, replace URL(starts with https://..) to be matched with your OS from https://github.com/protocolbuffers/protobuf/releases/tag/v21.3
curl -Lo protoc-21.3.zip https://github.com/protocolbuffers/protobuf/releases/download/v21.3/protoc-21.3-osx-aarch_64.zip
unzip protoc-21.3.zip -d $HOME/protoc
cp -r $HOME/protoc/include /usr/local
cp -r $HOME/protoc/bin /usr/local
```

## Local Development

Install dependencies

```bash
yarn install
yarn proto-build
```

Run development Server
```bash
yarn start
```
