"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteEvent } from "../../_actions/events";
import { useRouter } from "next/router";

interface DeleteDropdownItemProps {
  id: string;
  disabled: boolean;
}

export function DeleteDropdownItem({ id, disabled }: DeleteDropdownItemProps) {
  const router = useRouter();

  const handleDelete = async () => {
    await deleteEvent(id);
    router.replace(router.asPath);
  };

  return (
    <DropdownMenuItem onClick={handleDelete} disabled={disabled}>
      Delete
    </DropdownMenuItem>
  );
}