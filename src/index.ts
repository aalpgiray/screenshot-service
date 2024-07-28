import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { routes } from "./routes";

import { opentelemetry } from "@elysiajs/opentelemetry";

import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import {
	BatchSpanProcessor,
	TraceIdRatioBasedSampler,
} from "@opentelemetry/sdk-trace-node";

const bootstrap = async () => {
	new Elysia()
		.use(
			swagger({
				documentation: {
					info: {
						title: "Mentimeter screenshot API",
						description: "It's an API to take screenshots of a website",
						version: "1.0.0",
					},
				},
			}),
		)
		.use(
			opentelemetry({
				spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter({}))],
				sampler: new TraceIdRatioBasedSampler(0.1),
			}),
		)
		.group("/api", (group) => group.use(routes))
		.listen(3000);
};

void bootstrap();
