import { useState } from "react";
import { useRouter } from "next/router";

import styles from "@/styles/Search.module.css";
export default function Search() {
  const [term, setTerm] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const pathName = `/events/search?term=${term}`;
    router.push(pathName);
    setTerm("");
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setTerm(value);
  };

  return (
    <div className={styles.search}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={term}
          onChange={handleChange}
          placeholder="search for event"
        />
      </form>
    </div>
  );
}
