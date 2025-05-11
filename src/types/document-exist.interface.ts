export interface DocumentExistInterface {
  exists(documentId: string): Promise<boolean>;
}
