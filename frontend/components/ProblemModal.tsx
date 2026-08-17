"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";

import { Problem } from "@/lib/types/Problem";

type Props = {
  open: boolean;
  onClose: () => void;
  problems: Problem[];
  onSelect: (problem: Problem) => void;
};

export default function ProblemModal({
  open,
  onClose,
  problems,
  onSelect,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        transition: {
          onExited: () => setSearchQuery(""),
        },
      }}
    >
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search for a problem"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ my: 2 }}
        />
        <List>
          {filteredProblems.map((p) => (
            <ListItemButton
              key={p.problemId}
              onClick={() => {
                onSelect(p);
                onClose();
              }}
            >
              <ListItemText primary={p.title} secondary={p.difficulty} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
