'use client';
import React, { useEffect } from 'react';
import { DataTable } from './data-table';
import { ColumnDef } from '@tanstack/react-table';
import { columns as initialColumns, User } from './columns';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';


export const ListUsers = () => {
  const [users, setUsers] = React.useState([]);
  const [columns, setColumns] = React.useState<ColumnDef<User>[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);;
  const router = useRouter();
  const { data: session} = useSession();

  useEffect(() => {
    setColumns([
      ...initialColumns,
      {
        id: 'actions',
        cell: ({ row }: any) => {
          const user = row.original;
          return (
            <div className="flex space-x-2">
              {/* Ver detalles del usuario */}
              <Dialog open={!!selectedUser} onOpenChange={(open) => { if (!open) setSelectedUser(null); }}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => handleView(user)}>Ver</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Detalles del Usuario</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Card className="space-y-4">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold">Información del Usuario</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          <div>
                            <Label>Nombre</Label>
                            <Input value={selectedUser?.name} readOnly className="bg-gray-200 text-black" />
                          </div>
                          <div>
                            <Label>Apellido</Label>
                            <Input value={selectedUser?.lastname} readOnly className="bg-gray-200 text-black" />
                          </div>
                          <div>
                            <Label>Correo Electrónico</Label>
                            <Input value={selectedUser?.email} readOnly className="bg-gray-200 text-black" />
                          </div>
                          <div>
                            <Label>Rol</Label>
                            <Input value={selectedUser?.role} readOnly className="bg-gray-200 text-black" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Editar usuario */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => handleEdit(user)}>Editar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Nombre</Label>
                      <Input
                        id="name"
                        value={selectedUser?.name || ''}
                        onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Correo</Label>
                      <Input
                        id="email"
                        value={selectedUser?.email || ''}
                        onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                        className="col-span-3"
                      />
                    </div>
                    <Button onClick={handleSaveChanges} type="submit">Guardar cambios</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Eliminar usuario */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" onClick={() => handleDelete(user)}>Eliminar</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar Usuario</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no puede ser deshecha. Se eliminará permanentemente la información y cuenta del usuario de nuestro servidor.
                      ¿Estás seguro de querer eliminar esta cuenta?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleConfirmDelete(user.id)}>Continuar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
      },
    ]);
  }, [initialColumns, selectedUser]);


  // Funciones para manejar acciones

  const handleView = (user: User) => {
    setSelectedUser(user); // Ver detalles del usuario
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user); // Hacer editable el usuario
  };

  const handleSaveChanges = async () => {
    if (selectedUser) {
      try {
        await axios.put(`http://localhost:3000/api/users/${selectedUser._id}`, selectedUser);
        toast.success('Usuario actualizado correctamente');
        setSelectedUser(null);
        getUsers();
      } catch (error) {
        toast.error('Error al actualizar el usuario');
      }
    }
  };

  

  const handleDelete = (user: User) => {
    setSelectedUser(user); // Guardar el usuario a eliminar
  };

  const handleConfirmDelete = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`);
      toast.success('Usuario eliminado correctamente');
      setSelectedUser(null);
      getUsers();
    } catch (error) {
      toast.error('Error al eliminar el usuario');
    }
  };

  const getUsers = async () => {
    axios.get('http://localhost:3000/api/users',{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    })
    .then((response) => {
      setUsers(response.data);
    })
    .catch((error) =>{
      console.log(error);
      setUsers([]);
    });
  };

  useEffect(() => {
    if (!session) return;
    const user = session.user as any;
    localStorage.setItem('token', user.token);
    getUsers();
  }, [session]);

  
  
  return (
    <div>
      <DataTable columns={columns} data={users} />
    </div>
  );
};
