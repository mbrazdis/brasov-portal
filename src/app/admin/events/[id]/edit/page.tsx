import db from "@/db/db"
import { PageHeader } from "../../../_components/PageHeader"
import { EventsForm } from "../../_componets/EventsForm"

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const event = await db.event.findUnique({ where: { id } })

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <EventsForm event={event} />
    </>
  )
}