import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface DriverSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const DriverSearchBar: React.FC<DriverSearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by Name or License Number...'
}) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} size="small" edge="end">
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};
export default DriverSearchBar;
