import { AbstractBlobProvider } from "src/abstracts/abstract.file.provider";
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

  async download(id: string): Promise<Readable> {
    const containerClient = this.blobServiceClient.getContainerClient("recordings");
    const blockBlobClient = containerClient.getBlockBlobClient(id);

    return Readable.from(await blockBlobClient.downloadToBuffer());
  }


  async upload(id: string, stream: Readable): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient("recordings");
    const blockBlobClient = containerClient.getBlockBlobClient(id);

    await blockBlobClient.uploadStream(stream);
  }

}