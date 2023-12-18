This project was built using: JavaScript, React, Axios, MUI, and Node.js

### STEPS TO RUN THE PROGRAM

### Step 1
Before you run the program, you must go to this link:

https://cors-anywhere.herokuapp.com/corsdemo

and click the button that says: `Request temporary access to the demo server`

I called the storm data using an API call which had some secruity measures attached to it, so I have to use a CORS server to bypass them.

### Step 2
In the root of the project type in the terminal:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Step 3

Click the `Generate` button on the page, and the program will run. 

### WARNINGS!!!!

1. I am calling BigDataCLoud API to precisley reverse geocode the latitude and longitude. This is a free service, however there are limits to how many calls I can make. Submitting this project I have about 40,000 calls left. Everytime you hit generate it uses 1.9K.


2. It is reccomended to run this program on anything but Chrome, (I used Safari). If you are using Chrome to run this program make sure you clear your cache first. 