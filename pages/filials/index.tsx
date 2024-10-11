'use client'

import { useEffect, useMemo, useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/Label"
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import Link from "next/link"
import { ExternalLink, Edit } from "lucide-react"
import { Layout } from "@/components/Layout"
import { request } from "@/lib/api"
import { queryClient } from "@/lib/query"
import { Controller, useForm } from "react-hook-form"
import { Skeleton } from "@/components/ui/skeleton"

interface ILocation {
  id: string
  latitude: number
  longitude: number
  address: string | null
}

interface IFilial {
  id: string
  name_uz: string
  name_ru: string
  phone_number: string;
  location: ILocation
}

type FilialCreate = Omit<Omit<IFilial, 'id'>, 'location'> & {
  loc_latitude: number,
  loc_longitude: number
}

const generateRandomWord = (length: number = 8): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('')
}

const deleteFilialAttachment = async (filialId: string): Promise<void> => {
  await request.delete(`filials/${filialId}`)
}

const createFilial = async (filial: FilialCreate): Promise<IFilial> => {
  const { data } = await request.post<IFilial>('filials', filial)
  return data
}

const updateFilial = async ({ filial, data }: { filial: IFilial, data: FilialCreate }): Promise<IFilial> => {
  const { data: req_data } = await request.put<IFilial>(`filials/${filial.id}`, data)
  return req_data
}

const fetchFilials = async (): Promise<IFilial[]> => {
  const { data } = await request.get<IFilial[]>('filials')
  return data
}

const LocationPicker = ({ location }: { location: { loc_latitude: number, loc_longitude: number } }) => {
  const position = { lat: location.loc_latitude, lng: location.loc_longitude }
  return <Marker position={position} />
}

const FilialTable = ({ filials, onDelete, onEdit }: { filials: IFilial[], onDelete: (filial: IFilial) => void, onEdit: (filial: IFilial) => void }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nomi (UZ)</TableHead>
        <TableHead>Nomi (RU)</TableHead>
        <TableHead>Telefon raqami</TableHead>
        <TableHead>Joylashuv</TableHead>
        <TableHead>Harakatlar</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {filials.map((filial) => (
        <TableRow key={filial.id}>
          <TableCell>{filial.name_uz}</TableCell>
          <TableCell>{filial.name_ru}</TableCell>
          <TableCell>{filial.phone_number}</TableCell>
          <TableCell>
            <Link className="flex items-center text-blue-500 hover:text-blue-700" href={`https://www.google.com/maps/@${filial.location.latitude},${filial.location.longitude},17z`}>
              <ExternalLink className="h-4 w-4 mr-1" /> Joylashuv
            </Link>
          </TableCell>
          <TableCell>
            <Button variant="outline" onClick={() => onEdit(filial)} className="mr-2">
              <Edit className="h-4 w-4 mr-1" /> Tahrirlash
            </Button>
            <Button variant="destructive" onClick={() => onDelete(filial)}>
              O&apos;chirish
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

function DeleteModal({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) {
  const [confirmWord, setConfirmWord] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isMatch, setIsMatch] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setConfirmWord(generateRandomWord())
      setUserInput('')
      setIsMatch(false)
    }
  }, [isOpen])

  useEffect(() => {
    setIsMatch(userInput.toLowerCase() === confirmWord.toLowerCase())
  }, [userInput, confirmWord])

  const handleConfirm = () => {
    if (isMatch) {
      onConfirm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aniq filialni o&apos;chirmoqchimisiz?</DialogTitle>
          <DialogDescription>
            Filialni aniq o&apos;chirmoqchimisiz? Filialni o&apos;chirgandan keyin u foydalanuvchilarga ko&apos;rinmaydi.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <p className="mb-2">O&apos;chirishni tasdiqlash uchun &quot;{confirmWord}&quot; so&apos;zini kiriting:</p>
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Tasdiqlash so'zini kiriting"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!isMatch}>O&apos;chirish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const FilialModal = ({ isOpen, onClose, onSubmit, filial, mode }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FilialCreate) => void
  filial?: IFilial
  mode: 'create' | 'edit'
}) => {
  const { register, control, handleSubmit, reset } = useForm<FilialCreate>()



  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places']
  });


  const mapCenter = useMemo(() => ({
    lat: filial ? filial.location.latitude : 1,
    lng: filial ? filial.location.longitude : 1
  }), [filial])

  useEffect(() => {
    if (filial) {
      reset({
        "name_uz": filial.name_uz,
        "name_ru": filial.name_ru,
        "phone_number": filial.phone_number,
        "loc_latitude": filial.location.latitude,
        "loc_longitude": filial.location.longitude
      })
    }
  }, [filial, reset])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] max-h-[1000px] bg-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? "Yangi filial qo'shish" : "Filialni tahrirlash"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name_uz" className="text-right">
                Nomi (UZ)
              </Label>
              <Input
                id="name_uz"
                {...register("name_uz", { required: "Nomi bo'sh bo'lishi mumkin emas." })}
                className="col-span-3"
              />
            </div>


            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name_ru" className="text-right">
                Nomi (RU)
              </Label>
              <Input
                id="name_ru"
                {...register("name_ru", { required: "Nomi bo'sh bo'lishi mumkin emas." })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number" className="text-right">
                Telefon raqam
              </Label>
              <Input
                id="phone_number"
                {...register("phone_number", { required: "Telefon raqam bo'sh bo'lmasligi kerak." })}
                className="col-span-3"
              />
            </div>



            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                {/* Location {watch("loc_latitude")} {watch("loc_longitude")} */}
              </Label>
              <div className="col-span-3 h-[200px]">
                {isLoaded && (
                  <Controller
                    name="loc_latitude"
                    control={control}
                    render={({ field: latitude }) => (
                      <Controller
                        name="loc_longitude"
                        control={control}
                        render={({ field: longitude }) => (
                          <GoogleMap
                            center={mapCenter}
                            zoom={13}
                            onClick={(e: google.maps.MapMouseEvent) => {
                              latitude.onChange(e.latLng?.lat())
                              longitude.onChange(e.latLng?.lng())
                            }}
                            mapContainerStyle={{ height: '100%', width: '100%' }}
                          >
                            <LocationPicker location={{ loc_longitude: longitude.value, loc_latitude: latitude.value }} />
                          </GoogleMap>
                        )}
                      />
                    )}
                  />
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{mode === 'create' ? 'Yaratish' : 'Saqlash'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FilialManagement() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [filialToDelete, setFilialToDelete] = useState<IFilial | null>(null)
  const [isFilialModalOpen, setIsFilialModalOpen] = useState<boolean>(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [currentFilial, setCurrentFilial] = useState<IFilial | undefined>()

  const { data: filials, isLoading, isError } = useQuery<IFilial[]>({ queryFn: fetchFilials, queryKey: ['filials'] })

  const deleteMutation = useMutation({
    mutationFn: deleteFilialAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filials'] })
    },
  })

  const createMutation = useMutation({
    mutationFn: createFilial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filials'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateFilial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filials'] })
    },
  })

  const handleDelete = (filial: IFilial) => {
    setFilialToDelete(filial)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (filialToDelete) {
      deleteMutation.mutate(filialToDelete.id)
      setIsDeleteModalOpen(false)
    }
  }

  const handleEdit = (filial: IFilial) => {
    setModalMode('edit')
    setCurrentFilial(filial)
    setIsFilialModalOpen(true)
  }

  const handleSubmit = (data: FilialCreate) => {
    if (modalMode === 'create') {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsFilialModalOpen(false)
        }
      })
    } else if (currentFilial) {
      updateMutation.mutate({ data: data, filial: currentFilial }, {
        onSuccess: () => {
          setIsFilialModalOpen(false)
        }
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return <div>Error loading filials</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Filiallar</h1>
        {/* <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Filial qo&apos;shish
        </Button> */}
      </div>

      {filials && <FilialTable filials={filials} onDelete={handleDelete} onEdit={handleEdit} />}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <FilialModal
        isOpen={isFilialModalOpen}
        onClose={() => setIsFilialModalOpen(false)}
        onSubmit={handleSubmit}
        filial={currentFilial}
        mode={modalMode}
      />
    </div>
  )
}

export default function Page() {
  return (
    <Layout page="filials">
      <FilialManagement />
    </Layout>
  )
}