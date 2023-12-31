require('dotenv').config()
const WebSocket = require('ws')
const http = require('http')
const Y = require('yjs')
const ywsUtils = require('y-websocket/bin/utils')
const { MongodbPersistence } = require('y-mongodb-provider')
const setupWSConnection = ywsUtils.setupWSConnection

const production = process.env.PRODUCTION != null
const port = process.env.PORT || 4000

const server = http.createServer((request, response) => {
    if (request.url === '/health') {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(
            JSON.stringify({
                response: 'ok',
            })
        )
        return
    }
})
const wss = new WebSocket.Server({ server })

wss.on('connection', (conn, req) => {
    setupWSConnection(conn, req, {
        gc: req.url.slice(1) !== 'ws/prosemirror-versions',
    })
})

const mdb = new MongodbPersistence(process.env.DATABASE_URL, {
    flushSize: 100,
    multipleCollections: true,
})

ywsUtils.setPersistence({
    bindState: async (docName, ydoc) => {
        const persistedYdoc = await mdb.getYDoc(docName)
        const newUpdates = Y.encodeStateAsUpdate(ydoc)
        mdb.storeUpdate(docName, newUpdates)
        Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc))
        ydoc.on('update', async (update) => {
            mdb.storeUpdate(docName, update)
        })
    },
    writeState: async () => {
        return new Promise((resolve) => {
            resolve()
        })
    },
})

// log some stats
// setInterval(() => {
//     let conns = 0
//     docs.forEach((doc) => {
//         conns += doc.conns.size
//     })
//     const stats = {
//         conns,
//         docs: docs.size,
//         websocket: `ws://localhost:${port}`,
//         http: `http://localhost:${port}`,
//     }
//     console.log(`${new Date().toISOString()} Stats: ${JSON.stringify(stats)}`)
// }, 10000)

server.listen(port)

console.log(
    `Listening to http://localhost:${port} (${
        production ? 'production + ' : ''
    }`
)
