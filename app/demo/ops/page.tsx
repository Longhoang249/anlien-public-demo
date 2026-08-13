import { getDemoSnapshot } from "@/src/adapters/demo-snapshot";
import { ShowroomApp } from "@/src/showroom/ShowroomApp";

export default function DemoOpsPage() {
  return <ShowroomApp page="ops" snapshot={getDemoSnapshot()} />;
}

