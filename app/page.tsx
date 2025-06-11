"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Download, Menu, X, Edit3 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { ThemeDebug } from "@/components/theme-debug"

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const STORAGE_KEY = "markit-notes"

export default function MarkItApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY)
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }))
        setNotes(parsedNotes)
      } catch (error) {
        console.error("Error loading notes:", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    }
  }, [notes, isLoading])

  // Auto-save current note
  useEffect(() => {
    if (!currentNote) return

    const timeoutId = setTimeout(() => {
      setNotes((prev) =>
        prev.map((note) => (note.id === currentNote.id ? { ...currentNote, updatedAt: new Date() } : note)),
      )
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [currentNote])

  const createNewNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "# New Note\n\nStart writing your markdown here...",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setNotes((prev) => [newNote, ...prev])
    setCurrentNote(newNote)
    setSidebarOpen(false)
  }, [])

  const deleteNote = useCallback(
    (noteId: string) => {
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
      if (currentNote?.id === noteId) {
        setCurrentNote(null)
      }
    },
    [currentNote],
  )

  const updateCurrentNote = useCallback(
    (updates: Partial<Note>) => {
      if (!currentNote) return
      const updatedNote = { ...currentNote, ...updates }
      setCurrentNote(updatedNote)
    },
    [currentNote],
  )

  const exportNote = useCallback(() => {
    if (!currentNote) return

    const blob = new Blob([currentNote.content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentNote.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [currentNote])

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [notes, searchTerm])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading MarkIt...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-card border-r transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Logo size="md" />
                <h1 className="text-xl font-bold">MarkIt</h1>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button onClick={createNewNote} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Notes List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No notes found" : "No notes yet"}
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    className={`mb-2 cursor-pointer transition-colors hover:bg-accent ${
                      currentNote?.id === note.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => {
                      setCurrentNote(note)
                      setSidebarOpen(false)
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{note.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {note.content.replace(/[#*`]/g, "").substring(0, 100)}...
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{formatDate(note.updatedAt)}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNote(note.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            {currentNote && (
              <Input
                value={currentNote.title}
                onChange={(e) => updateCurrentNote({ title: e.target.value })}
                className="text-lg font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0"
                placeholder="Note title..."
              />
            )}
          </div>
          {currentNote && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {formatDate(currentNote.updatedAt)}
              </Badge>
              <Button variant="outline" size="sm" onClick={exportNote}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          )}
        </div>

        {/* Editor and Preview */}
        {currentNote ? (
          <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            {/* Editor */}
            <div className="flex-1 flex flex-col border-r">
              <div className="p-4 border-b bg-muted/50">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  <span className="text-sm font-medium">Editor</span>
                </div>
              </div>
              <div className="flex-1 p-4">
                <Textarea
                  value={currentNote.content}
                  onChange={(e) => updateCurrentNote({ content: e.target.value })}
                  placeholder="Start writing your markdown..."
                  className="w-full h-full resize-none border-none shadow-none focus-visible:ring-0 font-mono text-sm"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b bg-muted/50">
                <div className="flex items-center gap-2">
                  <Logo size="sm" />
                  <span className="text-sm font-medium">Preview</span>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>,
                      p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="mb-4 ml-6 list-disc">{children}</ul>,
                      ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children }) => (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">{children}</pre>
                      ),
                    }}
                  >
                    {currentNote.content}
                  </ReactMarkdown>
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          // Welcome Screen
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <Logo size="lg" className="mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Welcome to MarkIt</h2>
              <p className="text-muted-foreground mb-6">
                Your powerful markdown note-taking companion. Create, edit, and organize your thoughts with live
                preview.
              </p>
              <Button onClick={createNewNote} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Button>
            </div>
          </div>
        )}
        {/* Debug info - remove in production */}
        <ThemeDebug />
      </div>
    </div>
  )
}
