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

  assert.match(adapter, /CoreAccessContextAdapterContract/);
  assert.match(adapter, /readonly enabled: boolean/);
  assert.match(adapter, /if \(context\.mode === "PUBLIC_DEMO"\) return "PUBLIC_DEMO"/);
  assert.doesNotMatch(adapter, /fetch\(|supabase|service.role|authorization/i);
});

test("keeps the concrete Core adapter disabled and fail-closed", async () => {
  const [adapter, apiContract, destinations, fixtures] = await Promise.all([
    read("src/adapters/core-access-context-adapter.ts"),
    read("src/contracts/core-access-api.ts"),
    read("src/config/product-destinations.ts"),
    read("src/data/demo/private-access-fixtures.ts"),
  ]);

  assert.match(adapter, /new CoreAccessContextAdapter\(\{ enabled: false \}\)/);
  for (const failure of [
    "not_authenticated",
    "not_member",
    "not_entitled",
    "core_unavailable",
    "invalid_response",
    "adapter_error",
  ]) {
    assert.match(`${adapter}\n${fixtures}`, new RegExp(`"${failure}"`));
  }
  assert.doesNotMatch(adapter, /authorization|service.role|cookie/i);
  for (const wireField of [
    "source_system_id",
    "source_entity_type",
    "source_entity_id",
    "organization_id",
    "display_name",
    "entitlement_id",
    "entitlement_status",
  ]) {
    assert.match(apiContract, new RegExp(wireField));
  }
  assert.match(destinations, /privateHref: null/g);
  assert.match(destinations, /independent_product_sign_in/g);
  assert.doesNotMatch(destinations, /https?:\/\//);
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
