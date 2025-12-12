import { blue, blueBright, logger } from '@thalys/logger'

const log = logger.custom` [${blue('SCRATCH')}]`
const logEvent = logger.custom` [${blueBright('EVENT')}]`
const space = (count: number = 2) => logger.log('\n'.repeat(count))

space(1)

// let str = ''
// for (let i = 0; i < strings.length; i++) {
//   str += strings[i]
//   if (i < values.length) {
//     str += String(values[i])
//   }
// }
// interface CustomStringsArray extends ReadonlyArray<'thalys' | 'world' | string> {
//   readonly raw: readonly string[]
// }
// function typedTag<T extends number[]> (
//   strings: CustomStringsArray,
//   ...values: T
// ) {
//   return values
// }
// console.log(typedTag`thalys`)
// function raw (strings: TemplateStringsArray, ...rest: any[]): string {
//   return strings.raw.join('')
// }
// function _custom (
//   strings: TemplateStringsArray,
//   ...rest: any[]
// ): string {
//   // console.log(strings, rest)
//   let str = ''
//   for (let i = 0; i < strings.length; i++) {
//     str += strings?.[i] || ''
//     str += rest?.[i] || ''
//   }
//   return str
//   // return strings.raw.join('')
// }
// function recursive (strings: TemplateStringsArray, ...values: any[]) {
//   console.log(strings, values)
//   return recursive
// }
// recursive`Hello``World`
