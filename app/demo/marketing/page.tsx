import { getDemoSnapshot } from "@/src/adapters/demo-snapshot";
import { ShowroomApp } from "@/src/showroom/ShowroomApp";

export default function DemoMarketingPage() {
  return <ShowroomApp page="marketing" snapshot={getDemoSnapshot()} />;
}

