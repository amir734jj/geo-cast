import { AbstractBlobProvider, type FileInfo } from 'src/abstracts/abstract.file.provider'
import { Readable } from 'stream'
import fsAsync from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { Injectable } from '@nestjs/common'
import { glob } from 'glob'

@Injectable()
export class FileSystemBlobProvider extends AbstractBlobProvider {
  folder_name = 'recordings'

  constructor () {
    super()
    if (!fsSync.existsSync(this.folder_name)) {
      fsSync.mkdirSync(this.folder_name)
    }
  }

  async download (id: string): Promise<FileInfo> {
    const pattern = path.join(process.cwd(), this.folder_name, `${id}*`).replace(/\\/g, '/')
    const [file] = await glob(pattern)
    return {
      readable: Readable.from(await fsAsync.readFile(file)),
      filename: path.basename(file).substring(id.length + 1)
    }
  }

  async upload (id: string, stream: Buffer, filename: string, _userId?: number): Promise<void> {
    await fsAsync.writeFile(path.join(process.cwd(), this.folder_name, `${id}-${filename}`), stream)
  }

  async delete (id: string): Promise<void> {
    const pattern = path.join(process.cwd(), this.folder_name, `${id}*`).replace(/\\/g, '/')
    const files = await glob(pattern)
    await Promise.all(files.map(file => fsAsync.unlink(file)))
  }
}
