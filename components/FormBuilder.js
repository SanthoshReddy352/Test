'use client'

// --- START OF FIX: Import React ---
import React, { useState, useEffect } from 'react'
// --- END OF FIX ---
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'url', label: 'URL' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
]

export default function FormBuilder({ initialFields = [], onSave, eventId }) {
  const storageKey = `formBuilder-${eventId}`; // Unique key per event

  const [fields, setFields] = useState(() => {
    // Try to load from session storage first
    if (typeof window !== 'undefined') {
      const savedFields = window.sessionStorage.getItem(storageKey);
      if (savedFields) {
        return JSON.parse(savedFields);
      }
    }
    // Otherwise, use initial fields
    return initialFields.length > 0 ? initialFields : [];
  });
  
  const [isSaving, setIsSaving] = useState(false)

  // Auto-save to session storage on any change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(storageKey, JSON.stringify(fields));
    }
  }, [fields, storageKey]);

  const addField = (index) => {
    const newField = {
      id: uuidv4(),
      type: 'text',
      label: '',
      required: false,
      options: [],
    }
    // Insert new field at the specified index
    const newFields = [...fields];
    newFields.splice(index + 1, 0, newField);
    setFields(newFields);
  }

  const updateField = (index, updates) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...updates }
    setFields(newFields)
  }

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
  }

  const moveField = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === fields.length - 1) return;

    const newFields = [...fields];
    const item = newFields[index];
    
    if (direction === 'up') {
      newFields.splice(index, 1); // Remove item
      newFields.splice(index - 1, 0, item); // Insert item one position up
    } else { // direction === 'down'
      newFields.splice(index, 1); // Remove item
      newFields.splice(index + 1, 0, item); // Insert item one position down
    }
    
    setFields(newFields);
  }

  const handleSave = async () => {
    // Validate fields
    const validFields = fields.filter(f => f.label.trim() !== '')
    if (validFields.length === 0 && fields.length > 0) { // Allow saving an empty form
      alert('Please add at least one field with a label, or remove the empty field.')
      return
    }

    setIsSaving(true)
    try {
      await onSave(validFields)
      // Clear session storage on successful save
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('Error saving form:', error)
      alert('Failed to save form. Please try again. Your work is saved in this session.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Form Builder</h2>
      </div>

      {fields.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <p className="mb-4">No fields added yet</p>
              <Button onClick={() => addField(-1)} className="bg-brand-gradient text-white font-semibold hover:opacity-90 transition-opacity">
                <Plus size={16} className="mr-2" />
                Add First Field
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <React.Fragment key={field.id || index}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-sm font-medium">
                        Field {index + 1}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                       <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveField(index, 'up')}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-white disabled:opacity-30 w-8 h-8"
                      >
                        <ArrowUp size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveField(index, 'down')}
                        disabled={index === fields.length - 1}
                        className="text-gray-400 hover:text-white disabled:opacity-30 w-8 h-8"
                      >
                        <ArrowDown size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeField(index)}
                        className="text-red-500 hover:text-red-700 w-8 h-8"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Field Type */}
                  <div className="space-y-2">
                    <Label>Field Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(index, { type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Field Label */}
                  <div className="space-y-2">
                    <Label>Field Label *</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      placeholder="e.g., Team Name, Email Address"
                    />
                  </div>

                  {/* Dropdown Options */}
                  {field.type === 'dropdown' && (
                    <div className="space-y-2">
                      <Label>Options (comma-separated)</Label>
                      <Input
                        value={field.options?.join(', ') || ''}
                        onChange={(e) =>
                          updateField(index, {
                            options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean), // Also filter empty strings
                          })
                        }
                        placeholder="e.g., Option 1, Option 2, Option 3"
                      />
                    </div>
                  )}

                  {/* Placeholder */}
                  {['text', 'email', 'number', 'url', 'textarea'].includes(field.type) && (
                    <div className="space-y-2">
                      <Label>Placeholder (optional)</Label>
                      <Input
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(index, { placeholder: e.target.value })}
                        placeholder="e.g., Enter your team name"
                      />
                    </div>
                  )}

                  {/* Required Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`required-${index}`}
                      checked={field.required}
                      onCheckedChange={(checked) =>
                        updateField(index, { required: checked })
                      }
                    />
                    <Label htmlFor={`required-${index}`} className="font-normal">
                      Required field
                    </Label>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-center my-2">
                <Button variant="outline" size="sm" onClick={() => addField(index)} className="w-full">
                  <Plus size={16} className="mr-2" />
                  Add New Field Here
                </Button>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            onClick={handleSave}
            className="bg-brand-gradient text-white font-semibold hover:opacity-90 transition-opacity"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Form to Database'}
          </Button>
        </div>
      )}
    </div>
  )
}