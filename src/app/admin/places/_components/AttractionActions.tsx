"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteAttraction } from "../../_actions/places";
import { useRouter } from "next/router";

interface DeleteDropdownItemProps {
  id: number;
  disabled: boolean;
}

export function DeleteDropdownItem({ id, disabled }: DeleteDropdownItemProps) {
  const router = useRouter();

  const handleDelete = async () => {
    await deleteAttraction(id.toString());
    router.replace(router.asPath); 
  };

  return (
    <DropdownMenuItem onClick={handleDelete} disabled={disabled}>
      Delete
    </DropdownMenuItem>
  );
}