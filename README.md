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

--------

# Project build
`npm run build`

--------

# Build css styles as a separate file
We need styles to copy and paste them into editor.config.js project file. For screen previews
`npm run css`
Open file dist/main.css and copy content. Paste into project 'editor.config.js' file

---------

# Localhost development run
`npm start`
Open in browser 'http://localhost:8080/?testlocal'
This command runs as a single app, no editor.
The following files will be requested:
http://localhost:8080/main.js
http://localhost:8080/defaults.js
on the same host (in 'dist' folder)

# Localhost troubleshooting
0) Допустим в редакторе возникла какая-то ошибка в приложением, exception. Как можно поступить.
1) Запустить локально "Localhost development run". Приложение станет доступно на http://localhost:8080
2) Используя LOCAL_OVERRIDE_TYPES в Editor.js прописать там script и подебажить.

---------

See different run options in packeage.json/scripts
For example,run UI components demo page:
`npm run ui-demo`