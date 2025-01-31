import db from "@/db/db"
import { PageHeader } from "../../../_components/PageHeader"
import { NewsForm } from "../../_components/NewsForm"

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const news = await db.news.findUnique({ where: { id } })

  return (
    <>
      <PageHeader>Edit News</PageHeader>
      <NewsForm news={news} />
    </>
  )
}