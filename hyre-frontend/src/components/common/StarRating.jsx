import { Box, IconButton } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";

export default function StarRating({
  value = 0,
  onChange,
  max = 5,
}) {
  return (
    <Box>
      {Array.from({ length: max }).map((_, index) => {
        const ratingValue = index + 1;

        return (
          <IconButton
            key={ratingValue}
            size="small"
            onClick={() => onChange(ratingValue)}
          >
            {ratingValue <= value ? (
              <Star color="warning" />
            ) : (
              <StarBorder />
            )}
          </IconButton>
        );
      })}
    </Box>
  );
}
