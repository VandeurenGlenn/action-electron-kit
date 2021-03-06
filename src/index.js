import { execSync, readdirSync } from 'child_process'
import * as core from './../node_modules/@actions/core/lib/core'
import * as artifact from './../node_modules/@actions/artifact/lib/artifact-client'

const run = (cmd, cwd) => execSync(cmd, { encoding: "utf8", stdio: "inherit", cwd });


const release = process.env['INPUT_RELEASE']
const token = process.env['GITHUB_TOKEN']

const runAction = async () => {
  run('npm i -g @vandeurenglenn/electron-kit')
  run(`npm run build --if-present`)

  if (release) {
    run('rm -rf build/unpacked')

    const artifactClient = artifact.create()
    const options = {
      continueOnError: false
    }
    const response = await artifactClient.uploadArtifact(
     process['GITHUB_REF_NAME'],
     readdirSync('build'),
     '.',
     options
   )
   if (response.failedItems.length > 0) {
     core.setFailed(`An error was encountered when uploading ${response.artifactName}. There were ${response.failedItems.length} items that failed to upload.`)
   } else {
     core.info(`Artifact ${response.artifactName} has been successfully uploaded!`)
   }
  }
}
runAction()
