"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteNews } from "../../_actions/news";
import { useRouter } from "next/router";

interface DeleteDropdownItemProps {
  id: string;
  disabled?: boolean; 
}

export function DeleteDropdownItem({ id, disabled = false }: DeleteDropdownItemProps) {
  const router = useRouter();

  const handleDelete = async () => {
    await deleteNews(id);
    router.replace(router.asPath);
  };

  return (
    <DropdownMenuItem onClick={handleDelete} disabled={disabled}>
      Delete
    </DropdownMenuItem>
  );
}