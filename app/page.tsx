import { getDemoSnapshot } from "@/src/adapters/demo-snapshot";
import { ShowroomApp } from "@/src/showroom/ShowroomApp";

export default function Home() {
  return <ShowroomApp page="overview" snapshot={getDemoSnapshot()} publicEntry />;
}
