export interface FormatMsgConfig {
  indent?: number
  star?: boolean
  nl?: boolean
}
export const formatMsg = (
  msg: string,
  config: FormatMsgConfig = {}
): string => {
  const { indent = 0, star, nl = true } = config

  let result = ''

  result += msg
    .split('\n')
    .map((m) => {
      let r = ''
      if (star) r += `* ${m}`
      r = '  '.repeat(indent) + r
      return r
    })
    .join('\n')
  if (nl) result += '\n'

  return result
}
