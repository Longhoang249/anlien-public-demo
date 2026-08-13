import { getDemoSnapshot } from "@/src/adapters/demo-snapshot";
import { ShowroomApp } from "@/src/showroom/ShowroomApp";

export default function DemoLoyaltyPage() {
  return <ShowroomApp page="loyalty" snapshot={getDemoSnapshot()} />;
}

