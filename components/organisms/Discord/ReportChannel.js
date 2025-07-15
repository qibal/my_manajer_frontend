// Report Channel Component
import { useState, useEffect } from "react"
import {
    BarChart3,
} from "lucide-react"
import { Button } from "@/components/Shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/card"
import { ScrollArea } from "@/components/Shadcn/scroll-area"
import { Badge } from "@/components/Shadcn/badge"
import { Switch } from "@/components/Shadcn/switch"

export default function ReportChannel({ channel }) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-muted/50">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Report: {channel.name}</h3>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            Add Widget
                        </Button>
                        <Button variant="outline" size="sm">
                            Configure
                        </Button>
                        <Button size="sm">Export</Button>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { title: "Total Revenue", value: "$125,430", change: "+12.5%" },
                        { title: "Active Users", value: "2,847", change: "+5.2%" },
                        { title: "Conversion Rate", value: "3.24%", change: "-0.8%" },
                        { title: "Customer Satisfaction", value: "4.8/5", change: "+0.3" },
                        { title: "Response Time", value: "1.2s", change: "-0.3s" },
                        { title: "Error Rate", value: "0.05%", change: "-0.02%" },
                    ].map((metric, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metric.value}</div>
                                <p
                                    className={`text-xs ${metric.change.startsWith("+") ? "text-green-600" : metric.change.startsWith("-") ? "text-red-600" : "text-muted-foreground"}`}
                                >
                                    {metric.change} from last month
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Custom Data Sources</CardTitle>
                        <CardDescription>Connect and visualize data from any source</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">Project Database</p>
                                    <p className="text-sm text-muted-foreground">Connected to project-db channel</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">External API</p>
                                    <p className="text-sm text-muted-foreground">Custom endpoint integration</p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ScrollArea>
        </div>
    )
}