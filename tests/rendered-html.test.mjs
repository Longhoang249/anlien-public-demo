import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the ANLIEN public showroom", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Hôm nay quán có gì cần chú ý\?/);
  assert.match(html, /FnB Ăn Liền \(Demo quán\)/);
  assert.match(html, /Dữ liệu mô phỏng/);
  assert.match(html, /Marketing/);
  assert.match(html, /Loyalty/);
  assert.match(html, /Ops/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders every product demo route", async () => {
  const routes = [
    ["/demo/marketing", /Hôm nay page nên đăng gì\?/],
    ["/demo/loyalty", /Khách của quán đang thế nào\?/],
    ["/demo/ops", /Không ở quán, vẫn biết mọi việc đến đâu\./],
    ["/demo/day", /Một ngày với ANLIEN/i],
  ];

  for (const [pathname, expected] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(await response.text(), expected, pathname);
  }
});

