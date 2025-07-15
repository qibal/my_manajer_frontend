// Database Channel Component (Notion-like)
import { useState, useEffect } from "react"
import {
    Database,
} from "lucide-react"
import { Button } from "@/components/Shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/card"
import { Input } from "@/components/Shadcn/input"
import { ScrollArea } from "@/components/Shadcn/scroll-area"
import { Badge } from "@/components/Shadcn/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/select"
import { Label } from "@/components/Shadcn/label"
import { Switch } from "@/components/Shadcn/switch"

export default function DatabaseChannel({ channel }) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-muted/50">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Database: {channel.name}</h3>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            Add Property
                        </Button>
                        <Button variant="outline" size="sm">
                            Filter
                        </Button>
                        <Button variant="outline" size="sm">
                            Sort
                        </Button>
                        <Button size="sm">New</Button>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Custom Database Properties</CardTitle>
                            <CardDescription>Configure your database fields and views</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Property Name</Label>
                                    <Input placeholder="Enter property name" />
                                </div>
                                <div>
                                    <Label>Property Type</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="date">Date</SelectItem>
                                            <SelectItem value="select">Select</SelectItem>
                                            <SelectItem value="checkbox">Checkbox</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-3 font-medium">Name</th>
                                    <th className="text-left p-3 font-medium">Status</th>
                                    <th className="text-left p-3 font-medium">Priority</th>
                                    <th className="text-left p-3 font-medium">Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4].map((i) => (
                                    <tr key={i} className="border-t">
                                        <td className="p-3">Task {i}</td>
                                        <td className="p-3">
                                            <Badge variant="outline">In Progress</Badge>
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="destructive">High</Badge>
                                        </td>
                                        <td className="p-3">2024-01-{15 + i}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
