import express from "express";
import cors from 'cors';

import { serverConfig, logger } from "./config";
import { urlRouter } from "./routes/url.routes";
import * as trpcExpress from "@trpc/server/adapters/express";

const app = express();

app.use(cors());

app.use('/trpc', trpcExpress.createExpressMiddleware({
    router: urlRouter
}));

app.listen(serverConfig.PORT, async () => {
    logger.info(`server started at ${serverConfig.PORT}`);
});