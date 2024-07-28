// test/index.test.ts
import { describe, expect, it } from "bun:test";
import { screenshotRoute } from "./index";

describe("/screenshots", () => {
  it.skip("stress test", async () => {
    const iterations = 96;
    const requests = Array.from({ length: iterations }).map(() =>
      screenshotRoute.handle(
        new Request(
          "http://localhost/screenshot?width=1980&height=1080&url=https://google.com"
        )
      )
    );

    const responses = await Promise.all(requests);

    expect(responses.length).toBe(iterations);
  }, 20000);

  it("should return a screenshot", async () => {
    const response = await screenshotRoute.handle(
      new Request(
        "http://localhost/screenshot?width=1980&height=1080&url=https://google.com"
      )
    );

    expect(response.headers.get("Content-Type")).toBe("image/png");
  });
});
