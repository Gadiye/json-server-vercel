const jsonServer = require('json-server')
const fs = require('fs')
const path = require('path')

const server = jsonServer.create()

// Use environment variable for port, default to 3000
const port = process.env.PORT || 3000

try {
    const filePath = path.join(__dirname, 'db.json')
    const data = fs.readFileSync(filePath, "utf-8");
    const db = JSON.parse(data);
    const router = jsonServer.router(db)

    const middlewares = jsonServer.defaults()

    server.use(middlewares)
    
    // Add this before server.use(router)
    server.use(jsonServer.rewriter({
        '/api/*': '/$1',
        '/blog/:resource/:id/show': '/:resource/:id'
    }))
    
    server.use(router)
    
    server.listen(port, () => {
        console.log(`JSON Server is running on port ${port}`)
    })
} catch (error) {
    console.error('Error starting server:', error)
}

// Export the Server API
module.exports = server