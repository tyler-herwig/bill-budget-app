import React, {useContext} from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Box, AppBar, Container } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeContext } from './DateRangeContext';

const DateRangePickerComponent = () => {
    const { dateRange, updateDateRange } = useContext(DateRangeContext);

    return (
        <AppBar position="sticky" style={{ padding: 15 }} className='filter-bar'>
            <Container maxWidth="xl">
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <DatePicker
                            label="Start Date"
                            value={dateRange.startDate}
                            onChange={(newValue) => {
                                updateDateRange({startDate: newValue, endDate: dateRange.endDate})
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker
                            label="End Date"
                            value={dateRange.endDate}
                            onChange={(newValue) => {
                                updateDateRange({startDate: dateRange.startDate, endDate: newValue})
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Box>
                </LocalizationProvider>
            </Container>
        </AppBar>
    );
};

export default DateRangePickerComponent;