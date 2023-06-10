import { AbstractBlobProvider, FileInfo } from "src/abstracts/abstract.file.provider";
import { Readable } from "stream";
import { Injectable } from "@nestjs/common";
import { BlobServiceClient } from "@azure/storage-blob";

@Injectable()
export class AzureBlobProvider extends AbstractBlobProvider {

  folder_name = "recordings";

  constructor(
    private readonly blobServiceClient: BlobServiceClient
  ) {
    super();
  }

  async download(id: string): Promise<FileInfo> {
    const containerClient = this.blobServiceClient.getContainerClient("recordings");
    const blockBlobClient = containerClient.getBlockBlobClient(id);

    return { 
      readable: Readable.from(await blockBlobClient.downloadToBuffer()),
      filename: (await blockBlobClient.getProperties()).metadata["filename"]
    }
  }

  async upload(id: string, stream: Buffer, filename: string): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient("recordings");
    const blockBlobClient = containerClient.getBlockBlobClient(id);
    await blockBlobClient.uploadData(stream);
    await blockBlobClient.setMetadata({ filename });
  }
}