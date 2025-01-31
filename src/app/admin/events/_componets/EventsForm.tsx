"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { addEvent, updateEvent } from "../../_actions/events";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Event } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

export function EventsForm({ event }: { event?: Event | null }) {
  const [error, action] = useActionState(
    event == null ? addEvent : updateEvent.bind(null, event.id),
    {}
  );
  const [id, setId] = useState(event?.id || uuidv4());

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="id">ID</Label>
        <Input
          type="text"
          id="id"
          name="id"
          required
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        {error.id && <div className="text-destructive">{error.id}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={event?.title || ""}
        />
        {error.title && <div className="text-destructive">{error.title}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={event?.description || ""}
        />
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          type="datetime-local"
          id="date"
          name="date"
          required
          defaultValue={event?.date ? new Date(event.date).toISOString().slice(0, 16) : ""}
        />
        {error.date && <div className="text-destructive">{error.date}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          type="text"
          id="location"
          name="location"
          required
          defaultValue={event?.location || ""}
        />
        {error.location && (
          <div className="text-destructive">{error.location}</div>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}