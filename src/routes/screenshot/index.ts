import { Elysia, t } from "elysia";
import { ScreenshotService } from "../../services/ScreenshotService";

export const screenshotRoute = new Elysia()
	.decorate({
		screenshotService: await ScreenshotService.create(24),
	})
	.onStop(async ({ decorator: { screenshotService } }) => {
		await screenshotService.dispose();
	})
	.group("/screenshot", (group) =>
		group.get(
			"/",
			async ({ query: { url, width, height }, screenshotService }) => {
				const imageBuffer = await screenshotService.takeScreenshot(
					url,
					width,
					height,
				);

				return new Response(imageBuffer, {
					headers: {
						"Content-Type": "image/png",
					},
				});
			},
			{
				query: t.Object({
					url: t.String(),
					width: t.Numeric(),
					height: t.Numeric(),
				}),
			},
		),
	);
