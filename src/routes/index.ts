import { Elysia } from "elysia";
import { screenshotRoute } from "./screenshot";

export const routes = new Elysia().use(screenshotRoute);
