import { Chart as ChartJS, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDateAnalytics } from '@/lib/fetchers';

// Register necessary components
ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

export interface IMainAnalytics {
    filials: {
        filial: string,
        count: number
    }[],

    sales: number[],
    sales_year: number[]
}

const chartColors = {
    red: 'rgb(255, 99, 132)',
    blue: 'rgb(54, 162, 235)',
    green: 'rgb(75, 192, 192)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)',
    black: 'rgb(0, 0, 0)',
    aqua: 'rgb(0, 255, 255)',
    navy: 'rgb(0, 0, 128)',
};

const Charts = () => {
    const { data: analytics, isLoading, isError } = useQuery<IMainAnalytics>({
        queryKey: ["date_analytics"],
        queryFn: fetchDateAnalytics
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !analytics) {
        return <div>Error fetching data.</div>;
    }

    // Pie chart data based on filial counts
    const pieData = {
        labels: analytics.filials.map(f => f.filial),
        datasets: [
            {
                data: analytics.filials.map(f => f.count),
                backgroundColor: [
                    chartColors.red,
                    chartColors.blue,
                    chartColors.purple,
                    chartColors.green,
                    chartColors.yellow,
                    chartColors.grey,
                    chartColors.black,
                    chartColors.aqua,
                    chartColors.orange,
                    chartColors.navy,
                ],
            },
        ],
    };

    // Bar chart data for sales counts
    const barData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        datasets: [
            {
                label: 'Количество',
                backgroundColor: chartColors.red,
                borderColor: chartColors.red,
                borderWidth: 1,
                data: analytics.sales,  // Use API data for sales
            },
        ],
    };

    // Line chart data for yearly sales
    const lineData = {
        labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        datasets: [
            {
                label: 'Продажа',
                backgroundColor: chartColors.purple,
                borderColor: chartColors.purple,
                data: analytics.sales_year,  // Use API data for sales_year
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Месяц',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Количество',
                },
            },
        },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Pie Chart</h2>
                    <div className="h-64">
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Bar Chart</h2>
                    <div className="h-64">
                        <Bar data={barData} options={options} />
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Line Chart</h2>
                <div className="h-64">
                    <Line data={lineData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default Charts;
