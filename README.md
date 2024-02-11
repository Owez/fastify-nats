# NATS for Fastify

Modern plugin for using a NATS client within Fastify

This plugin is based upon the [nats.js](https://github.com/nats-io/nats.js) library and fully supports TypeScript. It's a partial and *safe* rewrite of the legacy [fastify-nats-client](https://github.com/smartiniOnGitHub/fastify-nats-client) plugin and aims to supersede it.

## Usage

To install this plugin, simply install it via your package manager:

```shell
npm i fastify-nats
```

You can then start using it inside of your app:

```ts
import Fastify from "fastify";
import fastifyNats from "fastify-nats";

const fastify = Fastify();
await fastify.register(fastifyNats, { servers: "nats.example.com:4222" });

// Publish a message using the client
fastify.nc.publish("subject", "message");

// Get the library itself if required
console.log(fastify.nats);
```

## Options

You can directly pipe any nats.js options straight into the plugin at register-time like so:

```ts
await fastify.register(fastifyNats, {
    servers: ["coolserver.net:4222", "backup.com:4222"],
    maxPingOut: 5,
    pass: "password123"
});
```

The plugin also includes the `defaultServer` and `drainOnClose` booleans, enabling you to fallback to the NATS demo server and drain instead of flushing on exit respectively.
