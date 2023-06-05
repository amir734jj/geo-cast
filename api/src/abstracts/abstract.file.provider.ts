import { Readable } from "stream";

export abstract class AbstractBlobProvider {
  abstract download(id: string): Promise<Readable>;

  abstract upload(id: string, stream: Readable): Promise<void>;
}