'use client'

import React, { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

const data = [
    { date: '2023-06-01', income: 650 },
    { date: '2023-06-15', income: 950 },
    { date: '2023-07-01', income: 850 },
    { date: '2023-07-15', income: 750 },
    { date: '2023-08-01', income: 800 },
    { date: '2023-08-15', income: 700 },
    { date: '2023-09-01', income: 750 },
    { date: '2023-09-15', income: 650 },
    { date: '2023-10-01', income: 550 },
    { date: '2023-10-15', income: 750 },
    { date: '2023-11-01', income: 900 },
    { date: '2024-06-01', income: 650 },
    { date: '2024-06-15', income: 950 },
    { date: '2024-07-01', income: 850 },
    { date: '2024-07-15', income: 750 },
    { date: '2024-08-01', income: 800 },
    { date: '2024-08-15', income: 700 },
    { date: '2024-09-01', income: 750 },
    { date: '2024-09-15', income: 650 },
    { date: '2024-10-01', income: 550 },
    { date: '2024-10-15', income: 750 },
    { date: '2024-11-01', income: 900 },
]

const zoomLevels = ['1m', '3m', '6m', '1y', 'max']

export default function IncomeChart() {
    const [zoomLevel, setZoomLevel] = useState('max')

    const getZoomedData = () => {
        const now = new Date()
        const threshold = new Date()

        switch (zoomLevel) {
            case '1m':
                threshold.setMonth(now.getMonth() - 1)
                break
            case '3m':
                threshold.setMonth(now.getMonth() - 3)
                break
            case '6m':
                threshold.setMonth(now.getMonth() - 6)
                break
            case '1y':
                threshold.setFullYear(now.getFullYear() - 1)
                break
            default:
                return data
        }

        return data.filter(item => new Date(item.date) >= threshold)
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Income Chart</CardTitle>
                <div className="flex space-x-2">
                    {zoomLevels.map(level => (
                        <Button
                            key={level}
                            variant={zoomLevel === level ? "default" : "outline"}
                            onClick={() => setZoomLevel(level)}
                        >
                            {level}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={getZoomedData()}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="income" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}