import { RedisClientType } from 'redis';

export abstract class AbstractRedisClient {
  private tokenExpiryTime: number = 604800;
  protected client: RedisClientType;

  constructor(client: RedisClientType) {
    this.client = client;
  }

  public async count(key: string): Promise<number> {
    const allKeys = await this.getAllKeys(key);
    return allKeys.length;
  }

  public exists(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.count(key)
        .then((count) => {
          return resolve(count >= 1 ? true : false);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  public async getOne<T>(key: string): Promise<T> {
    try {
      const reply = await this.client.get(key);
      return <T>reply;
    } catch (error) {
      throw error;
    }
  }

  public async getAllKeys(wildcard: string): Promise<string[]> {
    try {
      const results = await this.client.keys(wildcard);
      return results;
    } catch (error) {
      throw error;
    }
  }

  public async getAllKeyValue(wildcard: string): Promise<any[]> {
    try {
      const results = await this.client.keys(wildcard);
      const allResults = await Promise.all(
        results.map(async (key) => {
          const value = await this.getOne(key);
          return { key, value };
        })
      );
      return allResults;
    } catch (error) {
      throw error;
    }
  }

  public set(key: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client
        .set(key, value)
        .then((reply) => {
          this.client.expire(key, this.tokenExpiryTime);
          resolve(reply);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public deleteOne(key: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client
        .del(key)
        .then((reply) => {
          resolve(reply);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public testConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client
        .set('test', 'connected')
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
