import React from 'react'; // Import React to avoid linter errors
import { Pie } from 'react-chartjs-2'; // Assuming you're using Chart.js with React
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components and plugins
Chart.register(...registerables, ChartDataLabels);

const ShareDistributionCard = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                data: data.values,
                backgroundColor: data.colors,
                hoverBackgroundColor: data.hoverColors,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // Position the legend at the top
                labels: {
                    boxWidth: 20, // Adjust the box width for legend items
                    padding: 15, // Add padding between legend items
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`; // Customize tooltip label
                    },
                },
            },
            // Disable percentage labels on the pie chart
            datalabels: {
                display: false, // Disable default labels
            },
        },
        elements: {
            arc: {
                borderWidth: 2, // Adjust border width for better visibility
            },
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
        },
    };

    return (
        <div className="share-distribution-card">
            <div className="content">
                {/* Remove the Share Distribution heading if it exists */}
                {/* <h2>Share Distribution</h2> */}
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
};

export default ShareDistributionCard; 