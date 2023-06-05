import { AbstractBlobProvider } from "src/abstracts/abstract.file.provider";
import { Readable, Stream } from "stream";
import fs from 'fs/promises'
import path from "path";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FileSystemBlobProvider extends AbstractBlobProvider {

  folder_name = "recordings";

  async download(id: string): Promise<Readable> {
    return Readable.from(await fs.readFile(path.join(process.cwd(), this.folder_name, id)));
  }

  async upload(id: string, stream: Stream): Promise<void> {
    await fs.writeFile(path.join(process.cwd(), this.folder_name, id), stream);
  }
}
