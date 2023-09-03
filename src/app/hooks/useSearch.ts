import { useEffect, useState } from "react";
import debounce from "lodash/debounce";

export const useSearch = (data: any) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<any>(data);

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const handleSearch = debounce((text) => {
    const lowercaseSearchText = text.toLowerCase();

    // Use Array filter to find data matching the search text in lowercase
    const filtered = data.filter((item: any) =>
      item.name.toLowerCase().includes(lowercaseSearchText)
    );

    setFilteredData(filtered);
  }, 500);

  const onSearchInputChange = (e: any) => {
    const text = e.target.value;
    setSearchText(text);
    handleSearch(text);
  };

  return { searchText, onSearchInputChange, filteredData };
};
