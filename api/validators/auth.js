// import { isEmail, isURL, isAlphanumeric, isMobilePhone } from 'validator'

export default {
  signin (req, res, next) {
    const { params } = req
    const { type } = params
    const regex = /^(facebook|google|apple|mobile)$/

    if (!regex.test(type)) return res.status400()
    // const nameReg = /^[\w\W]+$/
    // switch (type) {
    //   case 'facebook':
    //     const { id, name, profile_pic: avatar, email } = body
    //     if (!email || !isEmail(email)) return res.status400(t('%s is not valid', 'Email'))
    //     if (!avatar || !isURL(avatar)) return res.status400(t('%s is not valid', 'Profile pic '))
    //     if (!name || !nameReg.test(name)) return res.status400(t('%s is not valid', 'Name'))
    //     if (!id || !isAlphanumeric(id)) return res.status400(t('%s is not valid', 'Id'))
    //     break
    //   case 'google':
    //     const { UserId: authId, DisplayName: username, ImageUrl: avatarImg, Email: gmail } = body
    //     if (!gmail || !isEmail(gmail)) return res.status400(t('%s is not valid', 'Email'))
    //     if (!avatarImg || !isURL(avatarImg)) return res.status400(t('%s is not valid', 'ImageUrl'))
    //     if (!username || !nameReg.test(username)) return res.status400(t('%s is not valid', 'DisplayName'))
    //     if (!authId || !isAlphanumeric(authId)) return res.status400(t('%s is not valid', 'UserId'))
    //     break
    //   case 'apple':
    //     const { User: appleAuthId, FullName: appleUsername, Avatar: appleAvatar, Email: appleEmail, Token: appleToken } = body
    //     // ---- 若透過 apple token 進行註冊，則資料來源以apple token 為主，忽略掉 appleEmail 與a ppleUsername
    //     if (!appleToken) {
    //       if (!appleEmail || !isEmail(appleEmail)) return res.status400(t('%s is not valid', 'Email'))
    //       if (!appleUsername || !nameReg.test(appleUsername)) return res.status400(t('%s is not valid', 'FullName'))
    //     }

    //     if (appleAvatar && !isURL(appleAvatar)) return res.status400(t('%s is not valid', 'Avatar'))
    //     if (!appleAuthId || !/[a-zA-Z0-9-.]+/g.test(appleAuthId)) return res.status400(t('%s is not valid', 'User'))
    //     break
    //   case 'mobile':
    //     const { mobile } = body
    //     if (!mobile || !isMobilePhone(mobile, 'zh-TW')) return res.status400(t('%s is not valid', 'Mobile'))
    //     break
    //   default:
    //     return res.status400('Auth type is not valid')
    // }

    next()
  },

  verifyMobile (req, res, next) {
    // const { body, __: t } = req
    // const { mobile, code } = body
    // if (!mobile || !isMobilePhone(mobile, 'zh-TW')) return res.status400('Mobile is not valid')
    // if (!code || !/[0-9]{6}/.test(code)) return res.status400(t('Code format is not valid'))

    next()
  }
}
