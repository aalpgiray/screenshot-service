// test/index.test.ts
import { describe, expect, it } from "bun:test";
import { screenshotRoute } from "./index";

describe("/screenshots", () => {
	it("stress test", async () => {
		const iterations = 3;
		const requests = Array.from({ length: iterations }).map(() =>
			screenshotRoute.handle(
				new Request(
					"http://localhost/screenshot?width=1980&height=1080&url=https://google.com",
				),
			),
		);

		const responses = await Promise.all(requests);

		expect(responses.length).toBe(iterations);
	});

	it("should return a screenshot", async () => {
		const response = await screenshotRoute.handle(
			new Request(
				"http://localhost/screenshot?width=1980&height=1080&url=https://google.com",
			),
		);

		expect(response.headers.get("Content-Type")).toBe("image/png");
	});
});
