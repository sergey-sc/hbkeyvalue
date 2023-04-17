# Homebridge KeyValue Server Plugin

The Homebridge KeyValue Server plugin is a Homebridge accessory that allows you to store and retrieve key-value pairs via a simple HTTP API. The plugin is built on top of a lightweight Node.js server and uses an SQLite database to store the data.

## Installation

Install Homebridge using the official instructions.
Install the plugin using the following command:
```sh
npm install -g homebridge-keyvalue-server
```
## Configuration

Add the following to your Homebridge config.json:

```json
{
  "accessories": [
    {
      "accessory": "KeyValueServer",
      "port": 3003,
      "database": "/homebridge/database.sqlite"
    }
  ]
}
```
port (optional): The port number to use for the API. Defaults to 3003.
database: The path to the SQLite database file. If the file does not exist, it will be created automatically.
## Usage

Once the plugin is installed and configured, you can use the API to set and get key-value pairs.

## Setting a value
To set a value, send a POST request to the API with the key and value in the request body. For example, to set the value of foo to bar, send the following request:

```sh
curl -X POST http://localhost:3003/set -H "Content-Type: application/json" -d '{"key":"foo","value":"bar"}'
```
## Getting a value
To get a value, send a GET request to the API with the key in the URL. For example, to get the value of foo, send the following request:
```sh
curl http://localhost:3003/get/foo
```
The API will respond with the value of the key, or a 404 error if the key does not exist.

## Deleting a value
To delete a value, send a DELETE request to the API with the key in the URL. For example, to delete the value of foo, send the following request:

```sh
curl -X DELETE http://localhost:3003/delete/foo
```
The API will respond with a success message if the key was deleted, or a 404 error if the key does not exist.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
