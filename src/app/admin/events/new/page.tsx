import { PageHeader } from "../../_components/PageHeader";
import { EventsForm } from "../_componets/EventsForm";

export default function NewEventPage() {
  return (
    <>
      <PageHeader>Add Event</PageHeader>
      <EventsForm />
    </>
  );
}