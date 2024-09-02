import { createTRPCProxyClient, httpBatchLink } from "@trpc/react-query";

import { UrlRouter } from "../../server/src/routes/url.routes";

const trpcClient = createTRPCProxyClient<UrlRouter>({
    links: [
        httpBatchLink({
            url: `${import.meta.env.VITE_BACKEND_SERVICE}/trpc`
        }),
    ]
});

export default trpcClient;