"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
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
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select a Problem</DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Choose a problem to start practicing
          </Typography>
        </Box>

        <List>
          {problems.map((p) => (
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
