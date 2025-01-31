import db from "@/db/db"
import { PageHeader } from "../../../_components/PageHeader"
import { PlaceForm } from "../../_components/placeForm"

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const attraction = await db.attraction.findUnique({ where: { id } })

  return (
    <>
      <PageHeader>Edit Attraction</PageHeader>
      <PlaceForm attraction={attraction} />
    </>
  )
}