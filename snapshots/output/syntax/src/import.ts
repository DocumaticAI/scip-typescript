// < definition syntax 1.0.0 src/`import.ts`/

import * as namespace from './namespace'
//          ^^^^^^^^^ reference syntax 1.0.0 src/`namespace.ts`/
//                         ^^^^^^^^^^^^^ reference syntax 1.0.0 src/`namespace.ts`/
import { Class } from './class'
//       ^^^^^ reference syntax 1.0.0 src/`class.ts`/Class#
//                    ^^^^^^^^^ reference syntax 1.0.0 src/`class.ts`/
import { Enum } from './enum'
//       ^^^^ reference syntax 1.0.0 src/`enum.ts`/Enum#
//                   ^^^^^^^^ reference syntax 1.0.0 src/`enum.ts`/
import { newFunction } from './function'
//       ^^^^^^^^^^^ reference syntax 1.0.0 src/`function.ts`/newFunction().
//                          ^^^^^^^^^^^^ reference syntax 1.0.0 src/`function.ts`/
import { newInterface as renamedInterface } from './interface'
//       ^^^^^^^^^^^^ reference syntax 1.0.0 src/`interface.ts`/newInterface().
//                       ^^^^^^^^^^^^^^^^ reference syntax 1.0.0 src/`interface.ts`/newInterface().
//                                               ^^^^^^^^^^^^^ reference syntax 1.0.0 src/`interface.ts`/

export function useEverything(): string {
//              ^^^^^^^^^^^^^ definition syntax 1.0.0 src/`import.ts`/useEverything().
  return (
    new Class('a').classProperty +
//      ^^^^^ reference syntax 1.0.0 src/`class.ts`/Class#`<constructor>`().
//                 ^^^^^^^^^^^^^ reference syntax 1.0.0 src/`class.ts`/Class#classProperty.
    renamedInterface().methodSignature('a') +
//  ^^^^^^^^^^^^^^^^ reference syntax 1.0.0 src/`interface.ts`/newInterface().
//                     ^^^^^^^^^^^^^^^ reference syntax 1.0.0 src/`interface.ts`/Interface#methodSignature().
    Enum[Enum.A] +
//  ^^^^ reference syntax 1.0.0 src/`enum.ts`/Enum#
//       ^^^^ reference syntax 1.0.0 src/`enum.ts`/Enum#
//            ^ reference syntax 1.0.0 src/`enum.ts`/Enum#A.
    newFunction() +
//  ^^^^^^^^^^^ reference syntax 1.0.0 src/`function.ts`/newFunction().
    namespace.a.value
//  ^^^^^^^^^ reference syntax 1.0.0 src/`namespace.ts`/
//            ^ reference syntax 1.0.0 src/`namespace.ts`/a/
//              ^^^^^ reference syntax 1.0.0 src/`namespace.ts`/a/value.
  )
}

export function dynamicImport(): Promise<void> {
//              ^^^^^^^^^^^^^ definition syntax 1.0.0 src/`import.ts`/dynamicImport().
//                               ^^^^^^^ reference typescript 5.7.3 lib/`lib.es5.d.ts`/Promise#
//                               ^^^^^^^ reference typescript 5.7.3 lib/`lib.es2015.iterable.d.ts`/Promise#
//                               ^^^^^^^ reference typescript 5.7.3 lib/`lib.es2015.promise.d.ts`/Promise.
//                               ^^^^^^^ reference typescript 5.7.3 lib/`lib.es2015.symbol.wellknown.d.ts`/Promise#
//                               ^^^^^^^ reference typescript 5.7.3 lib/`lib.es2018.promise.d.ts`/Promise#
  return import('./function').then(c => c.newFunction())
//              ^^^^^^^^^^^^ reference syntax 1.0.0 src/`function.ts`/
//                            ^^^^ reference typescript 5.7.3 lib/`lib.es5.d.ts`/Promise#then().
//                                 ^ definition local 3
//                                      ^ reference local 3
//                                        ^^^^^^^^^^^ reference syntax 1.0.0 src/`function.ts`/newFunction().
}

