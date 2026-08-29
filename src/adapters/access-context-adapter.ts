import type { AccessContextAdapter } from "@/src/contracts/access-context";
import type { AccessContext } from "@/src/contracts/shell";
import { demoAccessContext } from "@/src/data/demo/access-fixture";

export class DemoAccessContextAdapter implements AccessContextAdapter {
  getAccessContext(): AccessContext {
    return demoAccessContext;
  }
}

// CoreAccessContextAdapter is intentionally interface-only in the contract.
// A future implementation must use a versioned backend contract; it must not
// query Core or a product database from the browser.
