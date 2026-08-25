"""
AI 接口本地中转代理（解决浏览器跨域问题）

用法：
  python proxy.py                      # 默认转发到 Kimi 会员端点
  python proxy.py https://api.deepseek.com   # 也可以转发到别的服务

然后在工具的「记录」页把接口地址填成：
  http://127.0.0.1:8787/v1
模型按会员档位填（如 k3-256k / kimi-for-coding），Key 照常填。

原理：浏览器直连 api.kimi.com/coding 时，跨域预检（OPTIONS）拿不到许可，
请求被浏览器拦截。这个代理在本机转发请求并补上跨域许可头，浏览器就放行。
只监听 127.0.0.1，不对外开放；不记录、不修改任何内容。
"""
import sys
import urllib.request
import urllib.error
import os
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

TARGET = "https://api.kimi.com/coding"
PORT = 8787
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "daily-english-data.json")


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def _cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        # Chrome 私网访问保护（PNA）：从网页访问本机代理需要这个许可头
        self.send_header("Access-Control-Allow-Private-Network", "true")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors_headers()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            body = b'{"ok":true}'
            self.send_response(200)
            self._cors_headers()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if self.path == "/data":
            # 应用数据落盘：换浏览器/换地址也不丢
            if os.path.isfile(DATA_FILE):
                with open(DATA_FILE, "rb") as f:
                    data = f.read()
            else:
                data = b"{}"
            self.send_response(200)
            self._cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        if self.path.startswith("/v1/"):
            self._forward()
            return
        # 直接托管应用页面：页面与 API 同源，彻底绕开跨域/私网访问限制
        path = self.path.split("?")[0]
        if path == "/":
            path = "/index.html"
        fp = os.path.normpath(os.path.join(BASE_DIR, path.lstrip("/")))
        if not fp.startswith(BASE_DIR) or not os.path.isfile(fp):
            self._send(404, b'{"error":"not found"}')
            return
        with open(fp, "rb") as f:
            data = f.read()
        self.send_response(200)
        self._cors_headers()
        self.send_header("Content-Type", mimetypes.guess_type(fp)[0] or "application/octet-stream")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path == "/data":
            import json
            try:
                length = int(self.headers.get("Content-Length") or 0)
                body = self.rfile.read(length)
                parsed = json.loads(body.decode("utf-8"))
                if not isinstance(parsed, dict) or "days" not in parsed:
                    raise ValueError("bad shape")
                tmp = DATA_FILE + ".tmp"
                with open(tmp, "wb") as f:
                    f.write(body)
                os.replace(tmp, DATA_FILE)
                self._send(200, b'{"ok":true}')
            except Exception as e:
                self._send(400, ('{"error":"%s"}' % str(e).replace('"', "'")).encode("utf-8"))
            return
        self._forward()

    def _forward(self):
        try:
            length = int(self.headers.get("Content-Length") or 0)
            body = self.rfile.read(length) if length else None
            req = urllib.request.Request(TARGET + self.path, data=body, method=self.command)
            req.add_header("Content-Type", self.headers.get("Content-Type", "application/json"))
            auth = self.headers.get("Authorization")
            if auth:
                req.add_header("Authorization", auth)
            with urllib.request.urlopen(req, timeout=120) as resp:
                self._send(resp.status, resp.read())
        except urllib.error.HTTPError as e:
            self._send(e.code, e.read())
        except Exception as e:
            msg = ('{"error":{"message":"proxy error: %s"}}' % str(e).replace('"', "'")).encode("utf-8")
            self._send(502, msg)

    def _send(self, status, data):
        self.send_response(status)
        self._cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *args):
        pass


class Server(ThreadingHTTPServer):
    # 防止多实例叠加在同一端口上（旧进程不退，新进程静默失败）
    allow_reuse_address = False


if __name__ == "__main__":
    if len(sys.argv) > 1:
        TARGET = sys.argv[1].rstrip("/")
    print("AI proxy: http://127.0.0.1:%s  ->  %s" % (PORT, TARGET))
    print("工具里接口地址填: http://127.0.0.1:%s/v1" % PORT)
    Server(("127.0.0.1", PORT), Handler).serve_forever()
