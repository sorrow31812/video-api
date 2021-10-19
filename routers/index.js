import _ from 'lodash'
import express from 'express'
import Middleware, { extendResponse } from 'middlewares'
import Controllers from 'api/controllers'
import Validators from 'api/validators'
import routes from 'routers/routes'
import defaultMiddlewares from 'config/default-middlewares'

const Routers = (app) => {
  const router = express.Router()
  router.route('*').all(extendResponse)

  Object.keys(routes).map(key => {
    let object = routes[key]
    let [method, route] = key.split(' ')
    if (!route) {
      let err = Error(`Router setting error: ${key}`)
      console.error(`Router setting error: ${err.message}`)
      throw err
    }

    let actionPath
    if (_.isString(object)) {
      for (let defMidd of defaultMiddlewares) {
        // console.log(method, route)
        router.route(route)[method](Middleware[defMidd])
      }

      actionPath = object.split('.')
      let workerFunc = Controllers
      let validator = Validators
      actionPath.forEach(p => {
        workerFunc = workerFunc[p]
        if (_.isObject(validator)) validator = validator[p]
      })

      // 綁定參數驗證 function
      if (_.isFunction(validator)) {
        let vFunc = validator.bind({
          logHead: `[validator.${object}] `
        })
        router.route(route)[method](vFunc)
      }

      workerFunc = workerFunc.bind({
        logHead: `[${object}] `
      })
      router.route(route)[method](workerFunc)
    } else if (_.isObject(object)) {
      let { controller, action, middleware } = object

      actionPath = controller.split('.')
      actionPath.push(action)
      let workerFunc = Controllers
      let validator = Validators
      actionPath.forEach(p => {
        workerFunc = workerFunc[p]
        if (_.isObject(validator)) validator = validator[p]
      })

      // 綁定參數驗證 function
      if (_.isFunction(validator)) {
        let vFunc = validator.bind({
          logHead: `[validator.${object}] `
        })
        router.route(route)[method](vFunc)
      }

      if (_.isArray(middleware)) {
        middleware.forEach(m => {
          m = m.split('-')
          if (m.length > 1) {
            m = Middleware[m[0]](...m.slice(1))
          } else {
            m = Middleware[m]
          }
          router.route(route)[method](m)
        })
      } else {
        for (let defMidd of defaultMiddlewares) {
          router.route(route)[method](Middleware[defMidd])
        }
      }
      console.info('[routes] ', object)
      workerFunc = workerFunc.bind({
        logHead: `[${controller}.${action}] `
      })
      router.route(route)[method](workerFunc)
    }
  })

  return router
}

export default Routers
