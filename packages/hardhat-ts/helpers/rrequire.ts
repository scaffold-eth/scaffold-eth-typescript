import * as path from 'path'

import * as glob from 'glob'

const rrequire = (dir: string): void => {
  glob.sync(path.resolve(dir, '**', '*.ts')).forEach((file) => {
    require(path.resolve(file))
  })
}

export default rrequire
