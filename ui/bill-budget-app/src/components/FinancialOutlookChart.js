import React, { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';
import { PaychecksContext } from './PaychecksContext';
import { BillsContext } from './BillsContext';

export function FinancialOutlookChart() {
    const { paychecks } = useContext(PaychecksContext);
    const { bills } = useContext(BillsContext);

    const [chartData, setChartData] = useState({ labels: [], paychecks: [], bills: [] });

    useEffect(() => {
        const labelsSet = new Set();
        const paycheckTotalByMonth = {};
        const billsChartData = [];

        paychecks.forEach(paycheck => {
            let paycheckMonth = moment.utc(paycheck.date).format('YYYY-MM');
            labelsSet.add(moment.utc(paycheckMonth).format('MMM') + ', ' + moment.utc(paycheckMonth).format('YYYY'));

            if (!paycheckTotalByMonth[paycheckMonth]) {
                paycheckTotalByMonth[paycheckMonth] = 0;
            }
            paycheckTotalByMonth[paycheckMonth] += paycheck.amount;
        });

        const paychecksChartData = Object.entries(paycheckTotalByMonth)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(entry => entry[1]);

        const labels = Array.from(labelsSet);

        bills.forEach(billYears => {
            let totalBillsByMonth = billYears.months.map(month => month.totalAmount);
            billsChartData.push(...totalBillsByMonth);
        });

        setChartData({
            labels: labels,
            paychecks: paychecksChartData,
            bills: billsChartData
        });
    }, [paychecks, bills]);

    const dynamicChartData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Paychecks',
                data: chartData.paychecks,
                borderColor: 'rgba(76, 175, 80, 1)',
                backgroundColor: 'rgba(76, 175, 80, 0.2)'
            },
            {
                label: 'Bills',
                data: chartData.bills,
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