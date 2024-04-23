## TODO
- finish migration from index.html to app.js. migrate dependencies to react project
- left/right arrow options instead of j/k
- frontend branch

> [!NOTE]
> Ignore code outside of ./novachat. It is from before turning this project into a react project.

![Alt text](./novachat/public/homepagescreenshot.png)

## Frontend Contributing Instructions
- 'npm i'?
- 'npm start' inside of ./novachat/
- Edit the JSX code inside the return block of App.js.
- TODO:
  - Fix horizontal scrolling to be exact
  - Left panel that shows all available rooms/channels to jumps to.
  - Visible arrow buttons on side of screen for scrolling.
  - Should we remove server messages?


## Backend Contributing Instructions
- 'npm run build && node server.js' inside of ./novachat/
- TODO:
  - Fix wifi fetch. works on server side but not client side.
  - Find a live alternative to 'npm run build' that similarly includes server side.
