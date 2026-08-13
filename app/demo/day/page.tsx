import { getDemoSnapshot } from "@/src/adapters/demo-snapshot";
import { ShowroomApp } from "@/src/showroom/ShowroomApp";

export default function DemoDayPage() {
  return <ShowroomApp page="day" snapshot={getDemoSnapshot()} />;
}

