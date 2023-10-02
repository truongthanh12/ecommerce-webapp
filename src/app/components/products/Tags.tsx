import { Cancel } from "@mui/icons-material";
import { Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, memo } from "react";

interface TagsProps {
  data: string;
  handleDelete: (value: string) => void;
}

const Tags: React.FC<TagsProps> = ({ data, handleDelete }) => {
  return (
    <Box
      sx={{
        background: "#283240",
        height: "100%",
        display: "flex",
        padding: "0.4rem 0.75rem",
        margin: "0 0.5rem 0 0",
        justifyContent: "center",
        alignContent: "center",
        color: "#ffffff",
        borderRadius: "20px"
      }}
    >
      <Stack direction="row" gap={1}>
        <Typography>{data.substring(0, 20)}</Typography>
        <Cancel
          sx={{ cursor: "pointer" }}
          onClick={() => {
            handleDelete(data);
          }}
        />
      </Stack>
    </Box>
  );
};

interface InputTagsProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}
const InputTags: React.FC<InputTagsProps> = ({ tags, setTags }) => {
  const tagRef = useRef<HTMLInputElement>(null);

  const handleDelete = (value: string) => {
    const newtags = tags.filter((val) => val !== value);
    setTags(newtags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagRef.current && tagRef.current.value && tags.length < 5) {
        setTags([...tags, tagRef.current.value]);
        tagRef.current.value = "";
      }
    }
  };

  return (
    <TextField
      inputRef={tagRef}
      fullWidth
      sx={{ margin: "1rem 0" }}
      placeholder={tags.length < 5 ? "Enter tags" : ""}
      onKeyDown={handleKeyDown}
      InputProps={{
        startAdornment: (
          <Box sx={{ margin: "0 0.2rem 0 0", display: "flex" }}>
            {tags.map((data, index) => {
              return (
                <Tags data={data} handleDelete={handleDelete} key={index} />
              );
            })}
          </Box>
        ),
      }}
    />
  );
};

export default memo(InputTags);
