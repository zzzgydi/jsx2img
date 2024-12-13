import puppeteer from "puppeteer";
import genericPool from "generic-pool";

class BrowserPool {
  private pool: genericPool.Pool<puppeteer.Browser>;

  constructor() {
    this.pool = this.createPool();
  }

  createPool() {
    const factory = {
      create: async () => {
        const browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            // "--disable-accelerated-2d-canvas",
            "--disable-gpu",
          ],
        });
        return browser;
      },
      destroy: async (browser: puppeteer.Browser) => {
        try {
          await browser.close();
        } catch (error) {
          console.error("Error destroying browser:", error);
        }
      },
      validate: (browser: puppeteer.Browser) => {
        return Promise.resolve(browser.connected);
      },
    };

    return genericPool.createPool(factory, {
      max: 5,
      min: 2,
      maxWaitingClients: 50,
      testOnBorrow: true,
      acquireTimeoutMillis: 30000,
      evictionRunIntervalMillis: 180000,
      idleTimeoutMillis: 300000,
      fifo: true,
    });
  }

  acquire() {
    return this.pool.acquire();
  }

  release(browser: puppeteer.Browser) {
    return this.pool.release(browser);
  }

  getStatus() {
    return {
      size: this.pool.size,
      available: this.pool.available,
      pending: this.pool.pending,
      max: this.pool.max,
      min: this.pool.min,
    };
  }

  async drain() {
    await this.pool.drain();
    await this.pool.clear();
  }
}

export const browserPool = new BrowserPool();
