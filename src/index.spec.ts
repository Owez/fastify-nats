import { ConnectionOptions } from "nats"
import { FastifyNatsOptions, getServers } from "."

const defaultServer = "nats://demo.nats.io:4222";

type Options = FastifyNatsOptions & ConnectionOptions

describe("Get servers", () => {
    it("should use the default over everything", () => {
        const opts = {
            defaultServer: true,
            servers: ["this", "should", "not", "work"]
        } as Options
        const gotServers = getServers(opts)
        expect(gotServers).toEqual(defaultServer)
    })

    it("should use the normal servers", () => {
        const servers = ["cool", "servers", "here"]
        const opts = {
            servers
        } as Options
        const gotServers = getServers(opts)
        expect(gotServers).toEqual(servers)
    })

    it("should use the normal servers if it's just a string", () => {
        const servers = "cool.server.example.com:4222"
        const opts = {
            servers
        } as Options
        const gotServers = getServers(opts)
        expect(gotServers).toEqual(servers)
    })

    it("should use the default if servers are empty", () => {
        const opts = {
            servers: []
        } as Options
        const gotServers = getServers(opts)
        expect(gotServers).toEqual(defaultServer)
    })

    it("should use the default if servers are non-existent", () => {
        const opts = {} as Options
        const gotServers = getServers(opts)
        expect(gotServers).toEqual(defaultServer)
    })
})