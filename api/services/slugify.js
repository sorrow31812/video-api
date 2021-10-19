// words: array
const slugify = function (words) {
  let result = ''
  for (let i = 0, len = words.length; i < len; i++) {
    let w = words[i]
    // 要確認是不是最後一組關鍵字
    result = i === len - 1 ? result + `${w}` : result + `${w}_`
  }
  return result
}

export default slugify
