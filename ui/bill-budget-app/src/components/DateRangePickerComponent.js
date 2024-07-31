import React, { useContext, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Box, AppBar, Container, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeContext } from './DateRangeContext';

const DateRangePickerComponent = () => {
    const { dateRange, updateDateRange, setPredefinedDateRange } = useContext(DateRangeContext);

    return (
        <AppBar position="sticky" style={{ padding: 15 }} className='filter-bar'>
            <Container maxWidth="xl">
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FormControl>
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
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <DatePicker
                                    label="Start Date"
                                    value={dateRange.startDate}
                                    onChange={(newValue) => {
                                        updateDateRange({ startDate: newValue, endDate: dateRange.endDate, rangeType: 'custom' });
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={dateRange.endDate}
                                    onChange={(newValue) => {
                                        updateDateRange({ startDate: dateRange.startDate, endDate: newValue, rangeType: 'custom' });
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
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