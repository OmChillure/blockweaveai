"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from "lucide-react"

const tagCategories = {
  "Task Type": [
    "Natural Language Processing",
    "Computer Vision",
    "Audio Processing",
    "Multimodal",
    "Reinforcement Learning",
    "Tabular Data",
  ],
  "Input/Output": [
    "Text-to-Text",
    "Text-to-Image",
    "Image-to-Text",
    "Text-to-Speech",
    "Speech-to-Text",
    "Text-to-Video",
  ],
  "Model Architecture": [
    "Transformer",
    "CNN",
    "RNN",
    "GAN",
    "LSTM",
    "Attention Mechanism",
  ],
  "Language": [
    "English",
    "Chinese",
    "Spanish",
    "French",
    "German",
    "Multilingual",
  ],
  "License": [
    "Open Source",
    "Commercial",
    "Research Only",
    "Creative Commons",
  ],
}

export function FilterSidebarComponent() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleReset = () => {
    setSelectedTags([])
    setSearchTerm("")
  }

  const filteredCategories = Object.entries(tagCategories).reduce(
    (acc, [category, tags]) => {
      const filteredTags = tags.filter((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
      if (filteredTags.length > 0) {
        acc[category] = filteredTags
      }
      return acc
    },
    {} as Record<string, string[]>
  )

  return (
    <aside className="bg-background text-foreground p-4 rounded-lg shadow-lg col-span-2 flex flex-col h-[calc(100vh-2rem)] max-h-[800px]">
      <h2 className="text-xl font-bold mb-4">Filter Models</h2>
      <Input
        type="search"
        placeholder="Search tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="flex-grow mb-4">
        <div className="space-y-6">
          {Object.entries(filteredCategories).map(([category, tags]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-2">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedTags.map((tag) => (
          <div
            key={tag}
            className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center"
          >
            {tag}
            <button
              onClick={() => handleTagClick(tag)}
              className="ml-1 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <Button onClick={handleReset} variant="outline" className="w-full">
        Reset Filters
      </Button>
    </aside>
  )
}