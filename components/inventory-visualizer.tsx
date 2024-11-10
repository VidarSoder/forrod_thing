// @ts-nocheck

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Box, Shirt, Sun, Coffee, Home, Briefcase, Book, Music, Camera, Utensils, Plus, Trash2 } from 'lucide-react'

const INITIAL_INVENTORY = [
  {
    id: 1, name: "Flyttlådor Förråd", color: "bg-red-200", icon: "Box", starred: false, items: [
      { name: "Kvar att göra i förrådet", mark: "Alla" },
      { name: "Grejer som ligger löst i förrådet", mark: "Alla" }
    ]
  },
  {
    id: 2, name: "Vänster hylla", color: "bg-blue-200", icon: "Home", starred: true, items: [
      { name: "Låda: Högtider", mark: "V" },
      { name: "Låda: Packa", mark: "Alla" },
      { name: "Röd resväska (L)", mark: "E" },
      { name: "Grå resväska (V)", mark: "E" }
    ]
  },
  {
    id: 3, name: "Höger stege", color: "bg-green-200", icon: "Sun", starred: false, items: [
      { name: "Popuptält (L)", mark: "Alla" },
      { name: "Liggunderlag (L)", mark: "Alla" },
      { name: "Vit taklampa (3 spotlights)", mark: "Alla" }
    ]
  },
]

const ICON_MAP = {
  Box, Shirt, Sun, Coffee, Home, Briefcase, Book, Music, Camera, Utensils
}

const COLOR_OPTIONS = [
  { value: "bg-red-200", label: "Röd" },
  { value: "bg-blue-200", label: "Blå" },
  { value: "bg-green-200", label: "Grön" },
  { value: "bg-yellow-200", label: "Gul" },
  { value: "bg-purple-200", label: "Lila" },
  { value: "bg-pink-200", label: "Rosa" },
  { value: "bg-indigo-200", label: "Indigo" },
  { value: "bg-gray-200", label: "Grå" },
]

const UNBOXED_ITEMS = [
  "IKEA-kasse: Ingrids arv från Gerd",
  "Dörr till garderoben i kontoret (Djäkne)",
  "Tavla (x1)",
  "Grön resväska (L)",
  "Bordsfläkt (vänster hylla)",
  "Vidar: Brunt bord (arv från Bo)",
  "Jordpåse (planteringsjord)",
  "Sido-del till stringhyllan (stora)",
  "Turkosa utemöbler (Götgatan)",
  "1 Kruka"
]

export function InventoryVisualizerComponent() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY)
  const [filter, setFilter] = useState("")
  const [markFilter, setMarkFilter] = useState("")
  const [editingItem, setEditingItem] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory')
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory))
  }, [inventory])

  const toggleStar = (id: number) => {
    setInventory(inventory.map(item =>
      item.id === id ? { ...item, starred: !item.starred } : item
    ))
  }
  const updateItem = (updatedItem: { id: number; name: string; color: string; icon: string; starred: boolean; items: { name: string; mark: string }[] }) => {
    setInventory(inventory.map(item =>
      item.id === updatedItem.id ? { ...item, ...updatedItem } : item
    ))
    setEditingItem(null)
  }

  const addNewBox = (newBox: { id: number; name: string; color: string; icon: string; starred: boolean; items: { name: string; mark: string }[] }) => {
    setInventory([...inventory, { ...newBox, id: Date.now(), items: [] }])
    setIsCreating(false)
  }

  const filteredInventory = inventory.filter(item =>
    (item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.items.some(subItem => subItem.name.toLowerCase().includes(filter.toLowerCase()))) &&
    (markFilter === "" || item.items.some(subItem => subItem.mark === markFilter))
  )

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inventarievisualiserare</h1>
      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Filtrera objekt..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-grow"
        />
        <Select value={markFilter} onValueChange={setMarkFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrera efter märkning" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="-">Alla</SelectItem>
            <SelectItem value="V">V</SelectItem>
            <SelectItem value="E">E</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Alla</TabsTrigger>
          <TabsTrigger value="starred">Stjärnmärkta</TabsTrigger>
          <TabsTrigger value="unboxed">Oförpackade objekt</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map(item => (
              <InventoryCard key={item.id} item={item} toggleStar={toggleStar} setEditingItem={setEditingItem} />
            ))}
            <Card className="flex items-center justify-center cursor-pointer hover:bg-gray-100" onClick={() => setIsCreating(true)}>
              <Plus className="w-8 h-8 text-gray-400" />
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="starred">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.filter(item => item.starred).map(item => (
              <InventoryCard key={item.id} item={item} toggleStar={toggleStar} setEditingItem={setEditingItem} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="unboxed">
          <Card>
            <CardHeader>
              <CardTitle>Oförpackade objekt</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {UNBOXED_ITEMS.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {editingItem && (
        <EditItemDialog item={editingItem} updateItem={updateItem} onClose={() => setEditingItem(null)} />
      )}
      {isCreating && (
        <CreateBoxDialog addNewBox={addNewBox} onClose={() => setIsCreating(false)} />
      )}
    </div>
  )
}

interface InventoryCardProps {
  item: {
    id: string;
    icon: string;
    color: string;
    name: string;
    starred: boolean;
    items: { name: string; mark: string }[];
  };
  toggleStar: (id: string) => void;
  setEditingItem: (item: any) => void;
}

function InventoryCard({ item, toggleStar, setEditingItem }: InventoryCardProps) {
  const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP]

  return (
    <Card className={`${item.color} overflow-hidden transition-all hover:shadow-lg`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          {IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
          {item.name}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleStar(item.id)}
          className="hover:bg-transparent"
        >
          <Star className={`w-5 h-5 ${item.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-1 mb-4">
          {item.items.slice(0, 3).map((subItem: { name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; mark: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined }, index: React.Key | null | undefined) => (
            <li key={index} className="truncate flex items-center justify-between">
              <span>{subItem.name}</span>
              {subItem.mark && (
                <span className="text-xs font-semibold bg-gray-200 px-1 rounded">{subItem.mark}</span>
              )}
            </li>
          ))}
          {item.items.length > 3 && (
            <li className="text-gray-500">+ {item.items.length - 3} fler objekt</li>
          )}
        </ul>
        <Button variant="outline" size="sm" className="w-full" onClick={() => setEditingItem(item)}>
          Visa & Redigera
        </Button>
      </CardContent>
    </Card>
  )
}

function EditItemDialog({ item, updateItem, onClose }) {
  const [editedItem, setEditedItem] = useState(item)

  const handleChange = (field: string, value: string | any[]) => {
    setEditedItem((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleItemChange = (index: string | number, field: string, value: string) => {
    const newItems = [...editedItem.items]
    newItems[index] = { ...newItems[index], [field]: value }
    handleChange('items', newItems)
  }

  const handleSave = () => {
    updateItem(editedItem)
    onClose()
  }

  const handleRedirect = (id: string) => {
    window.location.href = `/homepage/${id}`
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-full max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Redigera objekt: {item.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Namn
              </Label>
              <Input
                id="name"
                value={editedItem.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Färg
              </Label>
              <Select
                value={editedItem.color}
                onValueChange={(value) => handleChange('color', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Välj en färg" />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${color.value}`}></div>
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Ikon
              </Label>
              <Select
                value={editedItem.icon}
                onValueChange={(value) => handleChange('icon', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Välj en ikon" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ICON_MAP).map((iconName) => (
                    <SelectItem key={iconName} value={iconName}>
                      <div className="flex items-center">
                        {React.createElement(ICON_MAP[iconName], { className: "w-4 h-4 mr-2" })}
                        {iconName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4 space-y-2">
              {editedItem.items.map((subItem: { name: string | number | readonly string[] | undefined; mark: string | undefined }, index: React.Key | null | undefined) => (
                <div key={index} className="flex gap-2 items-start">
                  <textarea
                    value={subItem.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    className="flex-grow p-2 border rounded-md min-h-[40px] resize-none"
                    style={{
                      height: 'auto',
                      overflow: 'hidden'
                    }}
                    onInput={(e) => {
                      e.target.style.height = 'auto'
                      e.target.style.height = e.target.scrollHeight + 'px'
                    }}
                  />
                  <Select
                    value={subItem.mark}
                    onValueChange={(value) => handleItemChange(index, 'mark', value)}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="Märk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">Alla</SelectItem>
                      <SelectItem value="V">V</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      const newItems = editedItem.items.filter((_: any, i: any) => i !== index)
                      handleChange('items', newItems)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => handleChange('items', [...editedItem.items, { name: '', mark: 'Alla' }])}
                variant="outline"
                size="sm"
              >
                Lägg till objekt
              </Button>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4">
          <Button className='mr-2' onClick={() => handleRedirect(item.id)}>Gå till låda</Button>
          <Button onClick={handleSave}>Spara ändringar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CreateBoxDialog({ addNewBox, onClose }) {
  const [newBox, setNewBox] = useState({ name: '', color: 'bg-gray-200', icon: 'Box' })

  const handleChange = (field: string, value: string) => {
    setNewBox(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    addNewBox(newBox)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Skapa ny låda</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Namn
            </Label>
            <Input
              id="name"
              value={newBox.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Färg
            </Label>
            <Select
              value={newBox.color}
              onValueChange={(value) => handleChange('color', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Välj en färg" />
              </SelectTrigger>
              <SelectContent>
                {COLOR_OPTIONS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${color.value}`}></div>
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Ikon
            </Label>
            <Select
              value={newBox.icon}
              onValueChange={(value) => handleChange('icon', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Välj en ikon" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(ICON_MAP).map((iconName) => (
                  <SelectItem key={iconName} value={iconName}>
                    <div className="flex items-center">
                      {React.createElement(ICON_MAP[iconName], { className: "w-4 h-4 mr-2" })}
                      {iconName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Skapa låda</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}