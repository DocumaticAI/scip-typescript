import * as path from 'path'
import * as url from 'url'

import * as ts from 'typescript'

import { Input } from './Input'
import * as lsif from './lsif'
import { LsifSymbol } from './LsifSymbol'
import { Options, lsif_typed } from './main'
import { Packages } from './Packages'
import { Visitor } from './Visitor'

export class Indexer {
  public options: Options
  public program: ts.Program
  public checker: ts.TypeChecker
  public symbolsCache: Map<ts.Node, LsifSymbol> = new Map()
  public packages: Packages
  constructor(public readonly config: ts.ParsedCommandLine, options: Options) {
    this.options = options
    this.program = ts.createProgram(config.fileNames, config.options)
    this.checker = this.program.getTypeChecker()
    this.packages = new Packages(options.project)
  }
  public index(): void {
    this.options.writeIndex(
      new lsif_typed.Index({
        metadata: new lsif_typed.Metadata({
          project_root: url.pathToFileURL(this.options.projectRoot).toString(),
          tool_info: new lsif_typed.ToolInfo({
            name: 'lsif-node',
            version: '1.0.0',
            arguments: [],
          }),
        }),
      })
    )
    const sourceFiles = this.program.getSourceFiles()
    if (sourceFiles.length === 0) {
      throw new Error('No source files')
    }
    // Visit every sourceFile in the program
    for (const sourceFile of this.program.getSourceFiles()) {
      const includes = this.config.fileNames.includes(sourceFile.fileName)
      if (includes) {
        const document = new lsif.lib.codeintel.lsif_typed.Document({
          relative_path: path.relative(
            this.options.projectRoot,
            sourceFile.fileName
          ),
          occurrences: [],
        })
        const input = new Input(sourceFile.fileName, sourceFile.getText())
        const visitor = new Visitor(
          this.checker,
          input,
          document,
          this.symbolsCache,
          this.packages,
          sourceFile
        )
        visitor.index()
        if (visitor.document.occurrences.length > 0) {
          this.options.writeIndex(
            new lsif.lib.codeintel.lsif_typed.Index({
              documents: [visitor.document],
            })
          )
        }
      }
    }
  }
}
