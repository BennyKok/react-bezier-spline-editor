import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('package.json'))
const publishPkg = JSON.parse(fs.readFileSync('package.publish.json'))
const { scripts, devDependencies, ...patchedPkg } = { ...pkg, ...publishPkg }
fs.writeFileSync('package.json', JSON.stringify(patchedPkg, null, 2))
