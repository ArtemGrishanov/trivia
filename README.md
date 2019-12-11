npm install webpack webpack-cli --save-dev
create webpack.config.js

npm i @babel/core babel-loader @babel/preset-env @babel/preset-react @babel/plugin-proposal-class-properties --save-dev
Create .babelrc

npm i react react-dom
npm i redux react-redux
npm install --save-dev css-loader
npm i html-webpack-plugin html-loader --save-dev
npm install --save-dev webpack-dev-server

Try to run "npm run"

# Project build
`npm run build`

----

# Build css styles as a separate file
We need styles to copy and paste them into editor.config.js project file. For screen previews
`npm run css`
Open file dist/main.css and copy content. Paste into project 'editor.config.js' file

-----


'screens_updated' event
added:Array - some screens have been created
deleted:Array - some screens have been deleted
updated:Array - some screens have been updated. Update means that one of children components' properties changed.
Example: Text was changed ('router.screens.z6z9sh.components.emeh5f.text' = 'New text value') on the screen, and the screen has been updated.