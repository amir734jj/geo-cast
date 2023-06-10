import { Readable } from "stream";

export type FileInfo = { readable: Readable, filename: string };

export abstract class AbstractBlobProvider {
  abstract download(id: string): Promise<FileInfo>;

  abstract upload(id: string, stream: Buffer, filename: string): Promise<void>;
}