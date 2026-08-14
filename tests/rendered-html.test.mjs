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
  assert.match(html, /Nắm quán\. Chốt việc\./);
  assert.match(html, /FnB Ăn Liền \(Demo quán\)/);
  assert.match(html, /Cần bạn xử lý/);
  assert.match(html, /Phân công việc/);
  assert.match(html, /Tín hiệu Loyalty hôm nay/);
  assert.match(html, /DNA thương hiệu/);
  assert.match(html, /Demo score/);
  assert.match(html, /Nguyễn Thái Học/);
  assert.match(html, /Trần Phú/);
  assert.match(html, />Vận hành</);
  assert.match(html, /ANLIEN Marketing/);
  assert.match(html, /ANLIEN Loyalty/);
  assert.match(html, /ANLIEN Ops/);
  assert.doesNotMatch(html, /PUBLIC PRODUCT SHOWROOM|Không cần đăng nhập|Bắt đầu ↓/);
  assert.doesNotMatch(html, /khách quay lại|chưa quay lại|phản hồi 2 sao|lệch bàn giao|sự cố mở/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders every product demo route", async () => {
  const routes = [
    ["/demo/marketing", /Quán là ai\. Hôm nay nên làm gì\?/],
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
