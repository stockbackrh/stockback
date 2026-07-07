#!/usr/bin/env node
// Static dev server with range requests: node serve.mjs [port]
import http from "http";
import { existsSync, statSync, readFileSync } from "fs";
import { resolve, extname, join, dirname } from "path";
import { URL } from "url";
const root = dirname(new URL(import.meta.url).pathname);
const port = parseInt(process.argv[2] || process.env.PORT || "4000", 10);
const MIME = {
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
