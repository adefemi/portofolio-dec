import { JourneyChrome } from "@/components/journey/Journey";
import { Sections } from "@/components/journey/Sections";

export default function Page() {
  return (
    <>
      <JourneyChrome />
      <main className="journey">
        <Sections />
      </main>
    </>
  );
}
