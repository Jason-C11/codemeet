import { useState } from "react";
import {
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CircleIcon from "@mui/icons-material/Circle";

type RoomUser = {
  socketID: string;
  username: string;
};

interface RoomUsersProps {
  users: RoomUser[];
}

const RoomUsers = ({ users }: RoomUsersProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <Badge badgeContent={users.length} color="success">
          <PeopleIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              mt: 1,
              width: 280,
              borderRadius: 2,
              overflow: "hidden",
            },
          },
        }}
      >
        <Stack>
          {/* Header */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <PeopleIcon fontSize="small" />

                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Participants
                </Typography>
              </Stack>

              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  backgroundColor: "success.main",
                  color: "success.contrastText",
                  fontWeight: 600,
                }}
              >
                {users.length} online
              </Typography>
            </Stack>
          </Box>

          <Divider />

          {/* Participants */}
          <List
            dense
            disablePadding
            sx={{
              maxHeight: 240,
              overflowY: "auto",
              py: 0.5,
            }}
          >
            {users.map((user) => (
              <ListItem
                key={user.socketID}
                sx={{
                  px: 2,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <CircleIcon
                  sx={{
                    fontSize: 8,
                    mr: 1.5,
                    color: "success.main",
                  }}
                />

                <ListItemText
                  primary={user.username}
                  sx={{
                    primary: {
                      variant: "body2",
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      </Popover>
    </>
  );
};

export default RoomUsers;
