// @create-index this file is created by create-index.js.
import controllers from './controllers'
import response from './response'
import services from './services'
import validators from './validators'

export { controllers, response, services, validators }

const moduleList = {
  controllers,
  response,
  services,
  validators
}

export default moduleList
