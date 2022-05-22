const { execSync } = require('fs');

const run = (cmd, cwd) => execSync(cmd, { encoding: "utf8", stdio: "inherit", cwd });


const release = process.env['INPUT_RELEASE']
const token = process.env['GITHUB_TOKEN']

run('npm i -g @vandeurenglenn/electron-kit')
run(`npm run build --if-present`)
run('electron-kit')
