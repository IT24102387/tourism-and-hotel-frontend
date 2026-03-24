import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlaceDetails() {
  const { name } = useParams();
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchDescription();
  }, []);

  async function fetchDescription() {
    try {
      const res = await axios.post("http://localhost:5000/api/describe", {
        place: name
      });
      setDescription(res.data.description);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>{name}</h1>
      <p>{description}</p>
    </div>
  );
}