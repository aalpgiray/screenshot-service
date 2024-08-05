import { type Browser, chromium } from "playwright";

export class ScreenshotService {
	private browsers: Browser[];

	private constructor(browsers: Browser[]) {
		this.browsers = browsers;
	}

	public static async create(numberOfBrowsers: number) {
		const browsers = await Promise.all(
			Array.from({ length: numberOfBrowsers }).map(() =>
				chromium.launch({
					headless: true,
				}),
			),
		);

		return new ScreenshotService(browsers);
	}

	private async acquireBrowser() {
		while (this.browsers.length === 0) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		const browser = this.browsers.shift();

		if (!browser) {
			throw new Error("No browsers available");
		}

		return browser;
	}

	private releaseBrowser(browser: Browser) {
		this.browsers.push(browser);
	}

	public async takeScreenshot(url: string, width: number, height: number) {
		const browser = await this.acquireBrowser();

		try {
			const context = await browser.newContext({
				viewport: {
					width,
					height,
				},
			});

			const page = await context.newPage();

			await page.goto(url);

			await page.waitForLoadState("networkidle");

			const imageBuffer = await page.screenshot({
				type: "png",
				animations: "disabled",
				caret: "hide",
			});

			void context.close({
				reason: "normal",
			});

			this.releaseBrowser(browser);

			return imageBuffer;
		} catch (error) {
			this.releaseBrowser(browser);

			throw error;
		}
	}

	async dispose() {
		await Promise.all(this.browsers.map((browser) => browser.close()));
	}
}
