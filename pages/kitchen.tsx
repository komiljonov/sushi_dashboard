'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/badge"
import { Clock, Plus, Printer, CheckCircle } from 'lucide-react'

const statuses = [
    { value: "NEW", name: "НОВЫЙ", color: "bg-blue-100 text-blue-800" },
    { value: "PREPARATION", name: "ЗАГОТОВКА", color: "bg-yellow-100 text-yellow-800" },
    { value: "READY", name: "ГОТОВ", color: "bg-green-100 text-green-800" },
    { value: "DELIVERING", name: "КУРЬЕР В ПУТИ", color: "bg-teal-100 text-teal-800" }
]

type OrderItem = {
    name: string;
    quantity: number;
    options?: string[];
}

type Order = {
    id: string;
    items: OrderItem[];
    timestamp: string;
}

// Mock data for orders
const initialOrders: Order[] = [
    { id: '1001', items: [{ name: 'Пепси 0,5', quantity: 1 }, { name: 'Гамбургер', quantity: 3, options: ['С сыром', 'Без лука'] }, { name: 'Лаваш мясной Standart острый', quantity: 2 }], timestamp: '15:22' },
    { id: '2001', items: [{ name: 'Гамбургер', quantity: 3, options: ['С сыром', 'Без лука'] }], timestamp: '15:22' },
    { id: '3001', items: [{ name: 'Лаваш мясной Standart острый', quantity: 2 }], timestamp: '15:22' },
    { id: '3002', items: [{ name: 'Дабл Бургер', quantity: 2, options: ['С сыром', 'Без лука'] }, { name: 'Пепси 0,5', quantity: 4 }, { name: 'Лаваш мясной Standart острый', quantity: 2 }, { name: 'Big Gamburger', quantity: 1, options: ['С сыром', 'Без лука'] }], timestamp: '15:22' },
    { id: '4001', items: [{ name: 'Дабл Бургер', quantity: 2, options: ['С сыром', 'Без лука'] }, { name: 'Пепси 0,5', quantity: 4 }, { name: 'Лаваш мясной Standart острый', quantity: 2 }, { name: 'Big Gamburger', quantity: 1, options: ['С сыром', 'Без лука'] }], timestamp: '15:22' },
]

export default function OrderDashboard() {
    const [orders, setOrders] = useState<Record<string, Order[]>>({
        NEW: initialOrders.slice(0, 2),
        PREPARATION: initialOrders.slice(2, 3),
        READY: initialOrders.slice(3, 4),
        DELIVERING: initialOrders.slice(4),
    })
    const [filter, setFilter] = useState('')
    const [draggedOrder, setDraggedOrder] = useState<Order | null>(null)

    const handleDragStart = (e: React.DragEvent, order: Order, status: string) => {
        setDraggedOrder(order)
        e.dataTransfer.setData('text/plain', JSON.stringify({ order, status }))
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent, targetStatus: string) => {
        e.preventDefault()
        const data = JSON.parse(e.dataTransfer.getData('text/plain'))
        const { order, status: sourceStatus } = data

        if (sourceStatus !== targetStatus) {
            const newOrders = { ...orders }
            newOrders[sourceStatus] = newOrders[sourceStatus].filter(o => o.id !== order.id)
            newOrders[targetStatus] = [order, ...newOrders[targetStatus]]
            setOrders(newOrders)
        }
        setDraggedOrder(null)
    }

    const filteredOrders = Object.fromEntries(
        Object.entries(orders).map(([status, statusOrders]) => [
            status,
            statusOrders.filter(order =>
                order.id.toLowerCase().includes(filter.toLowerCase()) ||
                order.items.some(item => item.name.toLowerCase().includes(filter.toLowerCase()))
            )
        ])
    )

    const handleAddOrder = (status: string) => {
        const newOrder: Order = {
            id: `${Date.now()}`,
            items: [{ name: 'Новый заказ', quantity: 1 }],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setOrders(prev => ({
            ...prev,
            [status]: [newOrder, ...prev[status]]
        }))
    }

    const handlePrintAll = (status: string) => {
        console.log(`Printing all orders from ${status}`)
        // Implement printing logic here
    }

    const handleCompleteAll = (status: string) => {
        const nextStatus = statuses[(statuses.findIndex(s => s.value === status) + 1) % statuses.length].value
        setOrders(prev => ({
            ...prev,
            [status]: [],
            [nextStatus]: [...prev[nextStatus], ...prev[status]]
        }))
    }

    return (
        <div className="p-4 bg-gray-100 h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Order Dashboard</h1>
                <div className="flex items-center">
                    <Input
                        type="text"
                        placeholder="Поиск по ID"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-64 mr-2"
                    />
                    <Badge variant="secondary" className="text-sm">
                        Всего: {Object.values(orders).flat().length}
                    </Badge>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 flex-grow overflow-hidden">
                {statuses.map(status => (
                    <Card
                        key={status.value}
                        className={`${status.color} overflow-hidden flex flex-col`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, status.value)}
                    >
                        <CardHeader className="py-3">
                            <CardTitle className="text-lg font-semibold flex justify-between items-center">
                                {status.name}
                                <Badge variant="secondary" className="text-sm">
                                    {filteredOrders[status.value].length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-y-auto">
                            {filteredOrders[status.value].map((order) => (
                                <div
                                    key={order.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, order, status.value)}
                                    className={`mb-3 bg-white rounded-lg shadow p-3 ${draggedOrder?.id === order.id ? 'opacity-50' : ''}`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold">ID: {order.id}</span>
                                        <div className="flex items-center text-gray-500">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span>{order.timestamp}</span>
                                        </div>
                                    </div>
                                    <ul className="text-sm">
                                        {order.items.map((item, i) => (
                                            <li key={i} className="mb-1">
                                                {item.quantity} x {item.name}
                                                {item.options && (
                                                    <ul className="pl-4 text-xs text-gray-500">
                                                        {item.options.map((option, j) => (
                                                            <li key={j}>{option}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                        <div className="p-3 bg-white border-t flex justify-between">
                            <Button size="sm" variant="outline" onClick={() => handleAddOrder(status.value)}>
                                <Plus className="w-4 h-4 mr-1" /> Добавить
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handlePrintAll(status.value)}>
                                <Printer className="w-4 h-4 mr-1" /> Печать всех
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleCompleteAll(status.value)}>
                                <CheckCircle className="w-4 h-4 mr-1" /> Завершить все
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}