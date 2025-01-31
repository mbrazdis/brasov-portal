"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { addNews, updateNews } from "../../_actions/news";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { News } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

export function NewsForm({ news }: { news?: News | null }) {
  const [error, action] = useActionState(
    news == null ? addNews : updateNews.bind(null, news.id),
    {}
  );
  const [id, setId] = useState(news?.id || uuidv4());

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
          defaultValue={news?.title || ""}
        />
        {error.title && <div className="text-destructive">{error.title}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          required
          defaultValue={news?.content || ""}
        />
        {error.content && (
          <div className="text-destructive">{error.content}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          type="datetime-local"
          id="date"
          name="date"
          required
          defaultValue={news?.date ? new Date(news.date).toISOString().slice(0, 16) : ""}
        />
        {error.date && <div className="text-destructive">{error.date}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          required={news == null}
        />
        {error.image && (
          <div className="text-destructive">{error.image}</div>
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