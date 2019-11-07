# CSCD311 Class Project

## Residency Web App by Travis Brown (10755131)

### Instructions

- navigate to the root of this folder and run `npm start` in the console to start web application
- on any browser, go to <http://localhost:3000>


### Small things learned/noticed

- Makes it so a file is accessible by everybody `sudo chmod -R go+w /file_path`

- Allows me to kill a process at the specified port `lsof -nti:NumberOfPort | xargs kill -9`
  
- When console.logging Objects they print full contents if only the Obj but if so much as a string is in there with it. the Obj condenses to [object Object]


- change Start script to `nodemon --exec babel-node ./app.js`
  - ensures we all on the same JS version

- You have to use the .then() to handle the result from the promise sent out. Doesn't seem like you can change global variables from inside the scope of the promise. Seems like you'd have to use the Async/Await combo for that since Await makes all the following code halt until command completed.
