export interface DbClientInterface {
  connect(uri: string): Promise<void>;
  disconnect(): Promise<void>;
}
