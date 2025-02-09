'use strict'

const isPagesPath = (absolutePath) => {
  return absolutePath.includes('/pages/')
}

module.exports = {
  isPagesPath,
}
