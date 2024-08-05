import { Elysia, t } from "elysia";
import { screenshotPlugin } from "../../plugins/screenshotPlugin";

export const screenshotRoute = new Elysia()
	.use(screenshotPlugin)
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
