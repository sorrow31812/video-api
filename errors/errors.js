'use strict'

const i18n = require('i18n')

const errorMessages = {
  // client side errors
  '40100001': 'Content data not found.',
  '40100002': 'Token is required.',
  '40000003': 'Token Expired.',
  '40000004': 'User not found.',
  '40000005': 'Invalid provider.',
  '40000006': 'Operator not found.',
  '40000007': 'Game not found.',
  '40000008': 'No token data found.',
  '40000009': 'Signed in at another location.',
  '40000010': 'Settings data not found.',
  '40000011': 'Illegal stake.',
  '40000012': 'Cheat wrong format.',
  '40000013': 'No balance.',
  '40000014': 'Previous game still not finish yet, Please try again later.',
  '40000015': 'Insufficient balance.',
  '40000016': 'No balance data.',
  '40000017': 'Out of balance.',
  '40000018': 'Envelope has been closed.',
  '40000019': 'Invalid parameter.',
  '40000020': 'Action not allowed.',
  '40000021': 'You have already draw this envelope.',
  '40000022': 'Method not allowed.',
  '40000023': 'Bonus type not found.',
  '40000024': 'Wrong stage.',
  '40000025': 'Bet record already exists.',
  '40000026': 'Balance has been blocked.',

  // server side errors
  '50000001': 'Token verify error.',
  '50000002': 'Find user error.',
  '50000003': 'Find provider error.',
  '50000004': 'Find operator error.',
  '50000005': 'Find latest bet record error.',
  '50000006': 'Find game error.',
  '50000007': 'Exchange token error.',
  '50000008': 'Find bet record error.',
  '50000009': 'Close bet record error.',
  '50000010': 'Find balance error.',
  '50000011': 'Add balance logs error.',
  '50000012': 'Update user balance error.',
  '50000013': 'Find balance and user error.',
  '50000014': 'Find user game settings error.',
  '50000015': 'Create user game settings error.',
  '50000016': 'Set play key error.',
  '50000017': 'Parse token error.',
  '50000018': 'Find play key error.',
  '50000019': 'Wait job response timeout.',
  '50000020': 'Save settings error.',
  '50000021': 'Find key error.',
  '50000022': 'Find user cache error',
  '50000023': 'Find game room error.',
  '50000024': 'User balance has been locked.',
  '50000025': 'Find bet record error.',
  '50000026': 'Find pool data error.',
  '50000027': 'Create bet record error.',
  '50000028': 'Create balance logs error.',
  '50000029': 'Update game room error.',
  '50000030': 'Red envelope not close yet.',
  '50000031': 'Find related data error.',
  '50000032': 'Spin error.',
  '50000033': 'Draw task error.'
}

const errors = function (code, alias = null) {
  if (typeof code === 'object') {
    i18n.configure(code)
    return
  }

  const status = parseInt(`${code}`.slice(0, 3))
  let message = errorMessages[code]

  if (!message) {
    message = `Error: ${code}`
  } else {
    message = i18n.__(message)
  }

  if (/[0-9]+/.test(alias)) {
    code = alias
  } else if (alias) {
    code = `${code}-${alias}`
  }

  return {
    status,
    code,
    message
  }
}

module.exports = errors
