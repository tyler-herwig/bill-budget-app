import React, { useContext } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Box, AppBar, Select, MenuItem, InputLabel, FormControl, Button, useMediaQuery, useTheme, OutlinedInput, Chip } from '@mui/material';
import { Paid, AccountBalance } from '@mui/icons-material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeContext } from '../Context/DateRangeContext';
import { useExpenseCategoryContext } from '../Context/ExpenseCategoryContext.tsx';
import AddIncomeDialog from '../Dialogs/AddIncomeDialog.tsx';
import AddExpenseDialog from '../Dialogs/AddExpenseDialog.tsx';

const DateRangePickerComponent = ({ refetch }) => {
    const { dateRange, updateDateRange } = useContext(DateRangeContext);
    const { expenseCategories } = useExpenseCategoryContext();
    const [expenseCategory, setExpenseCategory] = React.useState([]);
    const [openIncomeDialog, setOpenIncomeDialog] = React.useState(false);
    const [openExpenseDialog, setOpenExpenseDialog] = React.useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Use `sm` breakpoint for mobile

    const handleCloseIncomeDialog = () => {
        setOpenIncomeDialog(false);
    }

    const handleCloseExpenseDialog = () => {    
        setOpenExpenseDialog(false);
    }

    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setExpenseCategory(
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    return (
        <>
            <AppBar
                position={isMobile ? "static" : "sticky"} // Sticky on desktop, static on mobile
                sx={{
                    padding: 2,
                    backgroundImage: theme.palette.mode === 'dark' ? 'linear-gradient(to right, #2b2b2b, #323232)' : '',
                    backgroundColor: theme.palette.mode === 'light' ? 'white' : ''
                }}
            >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'nowrap',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FilterAltIcon /> Filters
                            </Box>
                            <FormControl sx={{ mr: isMobile ? 0 : 3, minWidth: isMobile ? '100%' : 200 }}>
                                <InputLabel id="date-range-select-label">Date Range</InputLabel>
                                <Select
                                    labelId="date-range-select-label"
                                    value={dateRange.rangeType}
                                    onChange={(e) =>
                                        updateDateRange({
                                            startDate: dateRange.startDate,
                                            endDate: dateRange.endDate,
                                            rangeType: e.target.value,
                                        })
                                    }
                                    label="Date Range"
                                    sx={{ minWidth: isMobile ? '100%' : 180 }}
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
                                        flexDirection: 'row',
                                        gap: 2,
                                        width: '100%',
                                        justifyContent: isMobile ? 'space-between' : 'flex-start',
                                    }}
                                >
                                    <DatePicker
                                        label="Start Date"
                                        value={dateRange.startDate}
                                        onChange={(newValue) => {
                                            updateDateRange({
                                                startDate: newValue,
                                                endDate: dateRange.endDate,
                                                rangeType: 'custom',
                                            });
                                        }}
                                        renderInput={(params) => <TextField {...params} sx={{ flex: 1 }} />}
                                    />
                                    <DatePicker
                                        label="End Date"
                                        value={dateRange.endDate}
                                        onChange={(newValue) => {
                                            updateDateRange({
                                                startDate: dateRange.startDate,
                                                endDate: newValue,
                                                rangeType: 'custom',
                                            });
                                        }}
                                        renderInput={(params) => <TextField {...params} sx={{ flex: 1 }} />}
                                    />
                                </Box>
                            )}
                            
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel id="expense-category-label">Expense Category</InputLabel>
                                <Select
                                labelId="expense-category-label"
                                id="expense-category"
                                multiple
                                value={expenseCategory}
                                onChange={handleChange}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                    </Box>
                                )}
                                >
                                {expenseCategories.map((expenseCategory) => (
                                    <MenuItem
                                        key={expenseCategory._id}
                                        value={expenseCategory.description}
                                    >
                                    {expenseCategory.description}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Box>
                        {/* Buttons Section */}
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                                justifyContent: isMobile ? 'center' : 'flex-end',
                                width: isMobile ? '100%' : 'auto',
                            }}
                        >
                            <Button 
                                variant="contained" 
                                color="success" 
                                endIcon={<Paid/>} 
                                onClick={
                                    () => setOpenIncomeDialog(true)
                                }
                            >
                                Add Income
                            </Button>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                endIcon={<AccountBalance/>}
                                onClick={
                                    () => setOpenExpenseDialog(true)
                                }
                            >
                                Add Expense
                            </Button>
                        </Box>
                    </Box>
                </LocalizationProvider>
            </AppBar>

            {/* Add Income Dialog */}
            <AddIncomeDialog 
                open={openIncomeDialog} 
                handleClose={handleCloseIncomeDialog} 
                refetch={refetch} 
            />

            {/* Add Expense Dialog */}
            <AddExpenseDialog 
                open={openExpenseDialog} 
                handleClose={handleCloseExpenseDialog}
                refetch={refetch}
            />
        </>
    );
};

export default DateRangePickerComponent;