'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, Box, Shirt, Sun, Coffee, Home, Briefcase, Book, Music, Camera, Utensils, ChevronLeft, QrCode } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const QRCode = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), { ssr: false })

const ICON_MAP = {
    Box, Shirt, Sun, Coffee, Home, Briefcase, Book, Music, Camera, Utensils
}

export default function InventoryItemPage() {
    const params = useParams()
    const id = params.id as string
    const [item, setItem] = useState<InventoryItem | null>(null)

    useEffect(() => {
        if (id) {
            // In a real application, you would fetch the item data from an API or database
            const mockItem: InventoryItem = {
                id: Number(id),
                name: "Flyttlådor Förråd",
                color: "bg-red-200",
                icon: "Box",
                starred: false,
                items: [
                    { name: "Kvar att göra i förrådet", mark: "Alla" },
                    { name: "Grejer som ligger löst i förrådet", mark: "Alla" },
                    { name: "Gamla böcker", mark: "V" },
                    { name: "Vinterkläderna", mark: "E" },
                    { name: "Sommardekorationer", mark: "Alla" },
                ],
                description: "Innehåller diverse saker från förrådet som behöver sorteras och organiseras."
            }
            setItem(mockItem)
        }
    }, [id])

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP]
    const qrCodeValue = `${window.location.href}`
    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="min-h-screen bg-background p-4 md:p-8 flex justify-center">
                <div className="w-full max-w-4xl space-y-8">
                    <div className="flex items-center justify-between">
                        <Link href="/homepage" passHref>
                            <Button variant="ghost" className="flex items-center space-x-2">
                                <ChevronLeft className="h-4 w-4" />
                                <span>Tillbaka till översikt</span>
                            </Button>
                        </Link>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex items-center space-x-2">
                                    <QrCode className="h-4 w-4" />
                                    <span className="hidden md:inline">Visa QR-kod</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>QR-kod för denna låda</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col items-center justify-center p-4">
                                    <QRCode value={qrCodeValue} size={200} />
                                    <p className="mt-4 text-sm text-center">Skanna denna kod för att identifiera denna låda</p>
                                    <p className="mt-2 text-xs text-center text-muted-foreground">Kod: {qrCodeValue}</p>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card className={`${item.color} shadow-lg`}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {IconComponent && <IconComponent className="w-8 h-8" />}
                                    <div>
                                        <CardTitle className="text-2xl md:text-3xl font-bold">{item.name}</CardTitle>
                                        <CardDescription>{item.description}</CardDescription>
                                    </div>
                                </div>
                                <Star className={`w-6 h-6 ${item.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="all" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="all">Alla</TabsTrigger>
                                    <TabsTrigger value="v">V</TabsTrigger>
                                    <TabsTrigger value="e">E</TabsTrigger>
                                </TabsList>
                                <TabsContent value="all">
                                    <ItemList items={item.items} />
                                </TabsContent>
                                <TabsContent value="v">
                                    <ItemList items={item.items.filter(i => i.mark === 'V')} />
                                </TabsContent>
                                <TabsContent value="e">
                                    <ItemList items={item.items.filter(i => i.mark === 'E')} />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    )
}

function ItemList({ items }: { items: Array<{ name: string; mark: string }> }) {
    return (
        <ScrollArea className="h-[300px] w-full rounded-md border">
            <div className="p-4">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                        <span>{item.name}</span>
                        <Badge variant={item.mark === 'V' ? 'secondary' : item.mark === 'E' ? 'destructive' : 'default'}>
                            {item.mark}
                        </Badge>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

interface InventoryItem {
    id: number;
    name: string;
    color: string;
    icon: string;
    starred: boolean;
    items: Array<{ name: string; mark: string }>;
    description: string;
}