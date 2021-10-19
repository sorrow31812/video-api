// @create-index this file is created by create-index.js.
import accountValidator from './account-validator'
import dateValidator from './date-validator'
import emailValidator from './email-validator'
import mobileValidator from './mobile-validator'
import nameValidator from './name-validator'

export { accountValidator, dateValidator, emailValidator, mobileValidator, nameValidator }

const moduleList = {
  accountValidator,
  dateValidator,
  emailValidator,
  mobileValidator,
  nameValidator
}

export default moduleList
