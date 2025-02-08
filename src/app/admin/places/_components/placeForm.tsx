"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, startTransition } from "react";
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
  const [camera_coordinates, setCameraCoordinates] = useState({
    camera_x: attraction?.camera_x || 0,
    camera_y: attraction?.camera_y || 0,
    camera_z: attraction?.camera_z || 0,
  });
  const [target_coordinates, setTargetCoordinates] = useState({
    target_x: attraction?.target_x || 0,
    target_y: attraction?.target_y || 0,
    target_z: attraction?.target_z || 0,
  });
  const [id, setId] = useState(attraction?.id || uuidv4());

  const handleSave = () => {
    const data = new FormData();
    data.append("id", id);
    data.append("name", (document.getElementById("name") as HTMLInputElement).value);
    data.append("map_name", (document.getElementById("map_name") as HTMLInputElement).value);
    data.append("description", (document.getElementById("description") as HTMLTextAreaElement).value);
    data.append("location", (document.getElementById("location") as HTMLInputElement).value);
    data.append("camera_x", camera_coordinates.camera_x.toString());
    data.append("camera_y", camera_coordinates.camera_y.toString());
    data.append("camera_z", camera_coordinates.camera_z.toString());
    data.append("target_x", target_coordinates.target_x.toString());
    data.append("target_y", target_coordinates.target_y.toString());
    data.append("target_z", target_coordinates.target_z.toString());
    const imageFile = (document.getElementById("image") as HTMLInputElement).files?.[0];
    if (imageFile) {
      data.append("image", imageFile);
    }

    startTransition(() => {
      action(data);
    });
  };

  return (
    <form className="space-y-8">
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
        <Label htmlFor="map_name">Map Name</Label>
        <Input
          type="text"
          id="map_name"
          name="map_name"
          required
          defaultValue={attraction?.map_name || ""}
        />
        {error.map_name && <div className="text-destructive">{error.map_name}</div>}
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
        <Label htmlFor="coordinates">Camera Coordinates</Label>
        <div className="flex space-x-2">
          <Input
            type="number"
            id="camera_x"
            name="camera_x"
            required
            value={camera_coordinates.camera_x}
            onChange={(e) => setCameraCoordinates({ ...camera_coordinates, camera_x: parseFloat(e.target.value) })}
            placeholder="Camera X"
          />
          <Input
            type="number"
            id="camera_y"
            name="camera_y"
            required
            value={camera_coordinates.camera_y}
            onChange={(e) => setCameraCoordinates({ ...camera_coordinates, camera_y: parseFloat(e.target.value) })}
            placeholder="Camera Y"
          />
          <Input
            type="number"
            id="camera_z"
            name="camera_z"
            required
            value={camera_coordinates.camera_z}
            onChange={(e) => setCameraCoordinates({ ...camera_coordinates, camera_z: parseFloat(e.target.value) })}
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
        <Label htmlFor="coordinates">Target Coordinates</Label>
        <div className="flex space-x-2">
          <Input
            type="number"
            id="target_x"
            name="target_x"
            required
            value={target_coordinates.target_x}
            onChange={(e) => setTargetCoordinates({ ...target_coordinates, target_x: parseFloat(e.target.value) })}
            placeholder="Target X"
          />
          <Input
            type="number"
            id="target_y"
            name="target_y"
            required
            value={target_coordinates.target_y}
            onChange={(e) => setTargetCoordinates({ ...target_coordinates, target_y: parseFloat(e.target.value) })}
            placeholder="Target Y"
          />
          <Input
            type="number"
            id="target_z"
            name="target_z"
            required
            value={target_coordinates.target_z}
            onChange={(e) => setTargetCoordinates({ ...target_coordinates, target_z: parseFloat(e.target.value) })}
            placeholder="Target Z"
          />
        </div>
        {(error.target_x || error.target_y || error.target_z) && (
          <div className="text-destructive">
            {error.target_x && <div>{error.target_x}</div>}
            {error.target_y && <div>{error.target_y}</div>}
            {error.target_z && <div>{error.target_z}</div>}
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
      <Button type="button" onClick={handleSave}>Save</Button>
    </form>
  );
}