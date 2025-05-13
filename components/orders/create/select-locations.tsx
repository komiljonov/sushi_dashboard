'use client'

import { fetchUserLocations } from '@/lib/mutators'
import { ILocation } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { useFormContext } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/Input'

const SelectLocations = () => {
  const { watch, setValue } = useFormContext()
  const user = watch('user')
  const phone = watch('phone')

  console.log('phone', phone, phone?.length);

  useEffect(() => {
    if (phone?.length < 13) {
      setValue('user', "")
    }
  }, [phone, setValue])

  const { data: locations = [], isLoading } = useQuery<ILocation[]>({
    queryKey: ['locations', user],
    queryFn: () => fetchUserLocations(user),
    enabled: !!user,
  })

  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredLocations = query.length
    ? locations.filter((loc) =>
        loc.address.toLowerCase().includes(query.toLowerCase())
      )
    : locations

  const handleSelect = (location: ILocation) => {
    setValue('location.latitude', location.latitude)
    setValue('location.longitude', location.longitude)
    setIsOpen(false)
    setQuery(location.address)
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="w-full" ref={containerRef}>
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Mavjud lokatsiyalar"
          className="w-full input"
        />

        <AnimatePresence>
          {isOpen && filteredLocations.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-1 w-full bg-white border shadow-md rounded max-h-60 overflow-auto"
            >
              {filteredLocations.map((loc) => (
                <li
                  key={loc.id}
                  onClick={() => handleSelect(loc)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {loc.address}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {isOpen && !isLoading && filteredLocations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute z-50 mt-1 w-full bg-white border rounded shadow text-sm px-4 py-2 text-gray-500"
          >
            {!user ? 'Foydalanuvchini tanlang!' : user && locations.length === 0 ? 'Lokatsiyalar mavjud emas' : 'Lokatsiyalar topilmadi'}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SelectLocations
