"use client";
import Form from "next/form";
import SearchFormReset from "./SearchFormReset";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
export default function SearchForm({ query }: { query?: string }) {
  const [inputValue, setInputValue] = useState(query || "");

  useEffect(() => {
    setInputValue(query || "");
  }, [query]);

  return (
    <Form action="/" scroll={false} className="search-form">
      <input
        name="query"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        type="text"
        className="search-input"
        placeholder="Search Startups"
      />
      <div className="flex gap-2">
        {query && <SearchFormReset />}
        <button type="submit" className="search-btn text-white">
          <Search className="size-5" />
        </button>
      </div>
    </Form>
  );
}
