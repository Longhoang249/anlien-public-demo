import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("declares the five approved shell states and a fail-closed Core boundary", async () => {
  const [contract, adapter] = await Promise.all([
    read("src/contracts/shell.ts"),
    read("src/contracts/access-context.ts"),
  ]);

  for (const state of [
    "PUBLIC_DEMO",
    "SIGNED_IN_PLACEHOLDER",
    "BUSINESS_SELECTED",
    "PRODUCT_AVAILABLE",
    "PRODUCT_UNAVAILABLE",
  ]) {
    assert.match(contract, new RegExp(`"${state}"`));
  }

  assert.match(adapter, /CoreAccessContextAdapter/);
  assert.match(adapter, /connection: "not-configured"/);
  assert.match(adapter, /if \(context\.mode === "PUBLIC_DEMO"\) return "PUBLIC_DEMO"/);
  assert.doesNotMatch(adapter, /fetch\(|supabase|service.role|authorization/i);
});

test("uses deterministic synthetic multi-Business fixture with entitlement variation", async () => {
  const fixture = await read("src/data/demo/access-fixture.ts");

  assert.match(fixture, /FnB Ăn Liền \(Demo quán\)/);
  assert.match(fixture, /Bếp thử nghiệm \(Demo\)/);
  assert.match(fixture, /product: "marketing"/);
  assert.match(fixture, /product: "loyalty"/);
  assert.match(fixture, /product: "ops"/);
  assert.match(fixture, /status: "inactive"/);
  assert.match(fixture, /source: "synthetic"/);
  assert.doesNotMatch(fixture, /MUA cafe|647d80be|qozuyhozgxjkmcmellpx/i);
});

test("keeps product ownership behind the AccessContext adapter", async () => {
  const [snapshot, implementation, launcher] = await Promise.all([
    read("src/adapters/demo-snapshot.ts"),
    read("src/adapters/access-context-adapter.ts"),
    read("src/showroom/ProductLauncher.tsx"),
  ]);

  assert.match(snapshot, /DemoAccessContextAdapter/);
  assert.match(implementation, /versioned backend contract/);
  assert.match(launcher, /isProductAvailable/);
  assert.match(launcher, /Not enabled/);
  assert.doesNotMatch(`${snapshot}\n${implementation}\n${launcher}`, /createClient|from\(|rpc\(/);
});
