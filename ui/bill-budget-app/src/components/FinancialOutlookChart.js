import React, { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';
import { IncomeContext } from './IncomeContext';
import { ExpensesContext } from './ExpensesContext';

export function FinancialOutlookChart() {
    const { incomes } = useContext(IncomeContext);
    const { expenses } = useContext(ExpensesContext);

    const [chartData, setChartData] = useState({ labels: [], incomes: [], expenses: [] });

    useEffect(() => {
        const labelsSet = new Set();
        const incomesTotalByMonth = {};
        const expensesChartData = [];

        incomes.forEach(income => {
            let incomeMonth = moment.utc(income.date_received).format('YYYY-MM');
            labelsSet.add(moment.utc(incomeMonth).format('MMM') + ', ' + moment.utc(incomeMonth).format('YYYY'));

            if (!incomesTotalByMonth[incomeMonth]) {
                incomesTotalByMonth[incomeMonth] = 0;
            }
            incomesTotalByMonth[incomeMonth] += income.total_income;
        });

        const incomesChartData = Object.entries(incomesTotalByMonth)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(entry => entry[1]);

        const labels = Array.from(labelsSet);

        expenses.forEach(expenseMonthYear => {
            let totalExpensesByMonth = expenseMonthYear.totalAmount;
            expensesChartData.push(totalExpensesByMonth);
        });

        setChartData({
            labels: labels,
            incomes: incomesChartData,
            expenses: expensesChartData
        });
    }, [incomes, expenses]);

    const dynamicChartData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Income',
                data: chartData.incomes,
                borderColor: 'rgba(76, 175, 80, 1)',
                backgroundColor: 'rgba(76, 175, 80, 0.2)'
            },
            {
                label: 'Expenses',
                data: chartData.expenses,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)'
            },
        ],
    };

    return (
        <Line
            data={dynamicChartData}
            options={{
                elements: {
                    line: {
                        tension: 0.25
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                            useBorderRadius: true,
                            borderRadius: 5
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return tooltipItem.dataset.label + ': $' + tooltipItem.raw.toFixed(2);
                            },
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return '$' + value.toFixed(2);
                            },
                        },
                    },
                },
            }}
        />
    )
}