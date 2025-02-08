"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { addAttraction, updateAttraction } from "../../_actions/places";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Attraction } from "@prisma/client";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';

export function PlaceForm({ attraction }: { attraction?: Attraction | null }) {
  const [error, action] = useActionState(
    attraction == null ? addAttraction : updateAttraction.bind(null, attraction.id),
    {}
  );
  const [coordinates, setCoordinates] = useState({
    camera_x: attraction?.camera_x || 0,
    camera_y: attraction?.camera_y || 0,
    camera_z: attraction?.camera_z || 0,
  });
  const [id, setId] = useState(attraction?.id || uuidv4());

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
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={attraction?.name || ""}
        />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={attraction?.description || ""}
        />
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          type="text"
          id="location"
          name="location"
          required
          defaultValue={attraction?.location || ""}
        />
        {error.location && (
          <div className="text-destructive">{error.location}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="coordinates">Coordinates</Label>
        <div className="flex space-x-2">
          <Input
            type="number"
            id="camera_x"
            name="camera_x"
            required
            value={coordinates.camera_x}
            onChange={(e) => setCoordinates({ ...coordinates, camera_x: parseFloat(e.target.value) })}
            placeholder="Camera X"
          />
          <Input
            type="number"
            id="camera_y"
            name="camera_y"
            required
            value={coordinates.camera_y}
            onChange={(e) => setCoordinates({ ...coordinates, camera_y: parseFloat(e.target.value) })}
            placeholder="Camera Y"
          />
          <Input
            type="number"
            id="camera_z"
            name="camera_z"
            required
            value={coordinates.camera_z}
            onChange={(e) => setCoordinates({ ...coordinates, camera_z: parseFloat(e.target.value) })}
            placeholder="Camera Z"
          />
        </div>
        {(error.camera_x || error.camera_y || error.camera_z) && (
          <div className="text-destructive">
            {error.camera_x && <div>{error.camera_x}</div>}
            {error.camera_y && <div>{error.camera_y}</div>}
            {error.camera_z && <div>{error.camera_z}</div>}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={attraction == null} />
        {attraction != null && (
          <Image
            src={attraction.imagePath}
            height="400"
            width="400"
            alt="Attraction Image"
          />
        )}
        {error.image && <div className="text-destructive">{error.image}</div>}
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