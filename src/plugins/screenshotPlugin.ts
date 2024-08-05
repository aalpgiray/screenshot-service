import { Elysia } from "elysia";
import { ScreenshotService } from "../services/ScreenshotService";

export const screenshotPlugin = new Elysia({
	name: "ScreenshotPlugin",
})
	.decorate({
		screenshotService: await ScreenshotService.create(24),
	})
	.onStop(async ({ decorator: { screenshotService } }) => {
		await screenshotService.dispose();
	});
