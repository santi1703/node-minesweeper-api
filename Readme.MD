# MineSweeper API

### Set up
To set this API up please ensure that you have NodeJS installed on the machine.  
Run _npm install_ on the terminal to ensure that the required libraries are install.  
Run _node index.js_ from the terminal standing on the project folder.    
MongoDB should be up and listening on default port (27017).
___

### Usage
This API is intended to be able to store and fetch Minesweeper fields statuses.
The Base URL is the one provided by your server in the environment you are currently working with.

The available endpoints are:

`GET` ```{BaseURL}``` Creates a new field and returns it on `data` attribute of the response JSON.

`GET` ```{BaseURL}/{field_id}``` Fetches from storage the field with the id value `field_id` and returns it on the `data` attribute of the response JSON.
If there is no stored field with the provided `field_id` value, it creates a fresh one.

`POST` ```{BaseURL}/{field_id}``` Updates from storage the field with the id value `field_id`, 
updates it with the data you provided, and returns the result on the `data` attribute of the response. 
If there is no stored field with the provided `field_id` value, it does not modify any stored field, and returns *null*
on the `data` field of the response.

The expected format for the *data* to be received by the API is *Raw JSON* (You can copy the whole response from API Get
calls to have an example on the required format)