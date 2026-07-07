#!/usr/bin/env node
// Static dev server with range requests: node serve.mjs [port]
import http from "http";
import { existsSync, statSync, readFileSync } from "fs";
import { resolve, extname, join, dirname } from "path";
import { URL } from "url";
const root = dirname(new URL(import.meta.url).pathname);
const port = parseInt(process.argv[2] || process.env.PORT || "4000", 10);
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".eot": "application/vnd.ms-fontobject",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mp3": "audio/mpeg",
  ".wasm": "application/wasm",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".pdf": "application/pdf"
};
http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]).trim();
  if (p.includes("..")) { res.writeHead(400); return res.end("bad"); }
  const cands = [p, p + ".html", join(p, "index.html"), p.replace(/\/$/, "") + ".html"];
  let file = null;
  for (const c of cands) { const abs = resolve(root, "." + c); if (existsSync(abs) && statSync(abs).isFile()) { file = abs; break; } }
  if (!file) { res.writeHead(404, { "content-type": "text/plain" }); return res.end("404 " + p); }
  const stat = statSync(file);
  const type = MIME[extname(file).toLowerCase()] || "application/octet-stream";
  const range = req.headers.range;
  if (range && /^bytes=/.test(range)) {
    const [s, e] = range.replace("bytes=", "").split("-");
    const start = parseInt(s || "0", 10), end = e ? parseInt(e, 10) : stat.size - 1;
    res.writeHead(206, { "content-type": type, "accept-ranges": "bytes", "content-range": `bytes ${start}-${end}/${stat.size}`, "content-length": end - start + 1 });
    return res.end(readFileSync(file).subarray(start, end + 1));
  }
  res.writeHead(200, { "content-type": type, "content-length": stat.size, "accept-ranges": "bytes", "cache-control": "no-store" });
  res.end(readFileSync(file));
}).listen(port, () => console.log("clone -> http://localhost:" + port));
