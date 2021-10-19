// @create-index this file is created by create-index.js.
import error400 from './error-400'
import error401 from './error-401'
import error403 from './error-403'
import error404 from './error-404'
import error405 from './error-405'
import error406 from './error-406'
import error417 from './error-417'
import error500 from './error-500'
import error501 from './error-501'

export { error400, error401, error403, error404, error405, error406, error417, error500, error501 }

const moduleList = {
  error400,
  error401,
  error403,
  error404,
  error405,
  error406,
  error417,
  error500,
  error501
}

export default moduleList
