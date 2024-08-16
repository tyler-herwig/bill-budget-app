import React, { useContext } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Box, AppBar, Container, Select, MenuItem, InputLabel, FormControl, useMediaQuery, useTheme } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeContext } from './DateRangeContext';

const DateRangePickerComponent = () => {
    const { dateRange, updateDateRange } = useContext(DateRangeContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Use `sm` breakpoint for mobile

    return (
        <AppBar
            position={isMobile ? "static" : "sticky"} // Sticky on desktop, static on mobile
            sx={{ padding: 2 }}
            className='filter-bar'
        >
            <Container maxWidth="xl">
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row', // Stack vertically on mobile, row on desktop
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <FormControl sx={{ mb: isMobile ? 2 : 0 }}>
                            <InputLabel id="date-range-select-label">Date Range</InputLabel>
                            <Select
                                labelId="date-range-select-label"
                                value={dateRange.rangeType}
                                onChange={(e) => updateDateRange({startDate: dateRange.startDate, endDate: dateRange.endDate, rangeType: e.target.value})}
                                label="Date Range"
                                sx={{ minWidth: 180 }} // Adjust width here
                            >
                                <MenuItem value="thisWeek">This Week</MenuItem>
                                <MenuItem value="lastWeek">Last Week</MenuItem>
                                <MenuItem value="twoWeeks">Next 2 Weeks</MenuItem>
                                <MenuItem value="thisMonth">This Month</MenuItem>
                                <MenuItem value="lastMonth">Last Month</MenuItem>
                                <MenuItem value="sixMonths">Next 6 Months</MenuItem>
                                <MenuItem value="currentYear">Current Year</MenuItem>
                                <MenuItem value="custom">Custom</MenuItem>
                            </Select>
                        </FormControl>
                        {dateRange.rangeType === 'custom' && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row', // Keep date pickers on the same row
                                    gap: 2,
                                    width: '100%', // Full width to handle responsiveness
                                    justifyContent: isMobile ? 'space-between' : 'flex-start' // Adjust spacing on mobile
                                }}
                            >
                                <DatePicker
                                    label="Start Date"
                                    value={dateRange.startDate}
                                    onChange={(newValue) => {
                                        updateDateRange({ startDate: newValue, endDate: dateRange.endDate, rangeType: 'custom' });
                                    }}
                                    renderInput={(params) => <TextField {...params} sx={{ flex: 1 }} />}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={dateRange.endDate}
                                    onChange={(newValue) => {
                                        updateDateRange({ startDate: dateRange.startDate, endDate: newValue, rangeType: 'custom' });
                                    }}
                                    renderInput={(params) => <TextField {...params} sx={{ flex: 1 }} />}
                                />
                            </Box>
                        )}
                    </Box>
                </LocalizationProvider>
            </Container>
        </AppBar>
    );
};

export default DateRangePickerComponent;