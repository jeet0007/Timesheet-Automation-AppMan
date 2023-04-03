const fs = require('fs')
const yaml = require('js-yaml');

const readFileData = (path = '') => {
  const data = fs.readFileSync(path, 'utf8');

  if (path.endsWith('.yaml'))
    return yaml.load(data)

  return JSON.parse(data)
}

module.exports = {
  readFileData
}
