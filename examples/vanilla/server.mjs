import { createReadStream, existsSync, statSync } from "node:fs"
import { extname, join, normalize } from "node:path"
import { createServer } from "node:http"
import { fileURLToPath } from "node:url"

const PORT = 4173
const rootDir = normalize(join(fileURLToPath(new URL("../../", import.meta.url))))

/** Maps file extensions to simple content types for static serving. */
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8"
}

/** Resolves request path to a file in repository root without directory traversal. */
const resolvePath = (urlPath) => {
  const safePath = normalize(urlPath).replace(/^\/+/, "")
  const fullPath = join(rootDir, safePath)

  if (!fullPath.startsWith(rootDir)) {
    return null
  }

  return fullPath
}

/** Returns an existing file path or null when not found. */
const getFilePath = (urlPath) => {
  const requested = resolvePath(urlPath)
  if (!requested) {
    return null
  }

  if (existsSync(requested) && statSync(requested).isFile()) {
    return requested
  }

  if (existsSync(requested) && statSync(requested).isDirectory()) {
    const indexPath = join(requested, "index.html")
    if (existsSync(indexPath)) {
      return indexPath
    }
  }

  return null
}

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://localhost:${PORT}`)
  let pathName = requestUrl.pathname

  if (pathName === "/") {
    pathName = "/examples/vanilla/"
  }

  const filePath = getFilePath(pathName)
  if (!filePath) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" })
    response.end("Not found")
    return
  }

  const ext = extname(filePath)
  const contentType = contentTypes[ext] ?? "application/octet-stream"

  response.writeHead(200, { "content-type": contentType })
  createReadStream(filePath).pipe(response)
})

server.listen(PORT, () => {
  console.log(`Vanilla example available at http://localhost:${PORT}/examples/vanilla/`)
})
