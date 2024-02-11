import { FastifyInstance } from "fastify";
import nats, { ConnectionOptions, connect } from "nats";

const defaultServer = "nats://demo.nats.io:4222";

/**
 * Custom configuration options for the plugin past the NATS connection options
 */
export interface FastifyNatsOptions {
    defaultServer?: boolean
    drainOnClose?: boolean
}

type Options = FastifyNatsOptions & ConnectionOptions

/**
 * Plugin for Fastify to connect to NATS
 * 
 * This registers with Fastify and adds the `nats` and `nc` properties to the Fastify instance. You can pass in any native NATS connection options directly, as well as custom options for the plugin defined in {@link FastifyNatsOptions}.
 * 
 * @example
 * import Fastify from "fastify";
 * import fastifyNats from "fastify-nats";
 * 
 * const fastify = Fastify();
 * await fastify.register(fastifyNats, { servers: "nats.example.com:4222" });
 * 
 * // Publish a message using the client
 * fastify.nc.publish("subject", "message");
 * 
 * // Get the library itself if required
 * console.log(fastify.nats);
 * @param fastify Fastify instance to use
 * @param opts Configuration options to use
 */
export default async function fastifyNats(fastify: FastifyInstance, opts: Options) {
    opts.servers = getServer(opts);
    await natsWrapper(fastify, opts);
}

async function natsWrapper(fastify: FastifyInstance, opts: Options) {
    const nc = await connect(opts);

    fastify.decorate("nats", nats);
    fastify.decorate("nc", nc);

    fastify.addHook("onClose", async () => {
        if (opts.drainOnClose) {
            await nc.drain();
        } else {
            await nc.flush();
            await nc.close();
        }
    });
}

function getServer(opts: Options): string | string[] {
    if (opts.defaultServer) return defaultServer;
    return opts.servers || defaultServer;
}
