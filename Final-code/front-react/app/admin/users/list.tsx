'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { ColumnDef } from '@tanstack/react-table';
import { columns as initialColumns, User } from './columns';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


import {AlertDialog,
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'react-toastify';


export const ListUsers = () => {
  const [users, setUsers] = React.useState([]);
  const [columns, setColumns] = React.useState<ColumnDef<User>[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [editedUser, setEditedUser] = React.useState<User | null>(null);
  const [passwords, setPasswords] = React.useState({ currentPassword: '', newPassword: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword]         = useState(false);

  const router = useRouter();
  const { data: session} = useSession();


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
  }

  const handleView = (user: User) => {
    setSelectedUser(user); // Ver detalles del usuario
  };

  const handleEdit = (user: User) => {
    setEditedUser({ ...user });
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedUser) {
      const { name, value } = e.target;
      setEditedUser({
        ...editedUser,
        [name]: value,  // Actualizar solo el campo modificado
      });
    }
  };

  axios.get('http://localhost:3000/api/users',{
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    withCredentials: true,
  })

  const handleSaveChanges = async () => {
    if (editedUser) {
      try {
        await axios.put(`http://localhost:3000/api/users/${editedUser._id}`, 
        editedUser,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials:true,
        });

        toast.success('Usuario actualizado correctamente');
        setIsDialogOpen(false);
        setSelectedUser(null);
        getUsers();
      } catch (error) {
        toast.error('Error al actualizar el usuario');
      }
    }
  };

  const handleChangePassword = async () => {
    if (editedUser && passwords.currentPassword && passwords.newPassword) {
      try {
        await axios.put(`http://localhost:3000/api/users/${editedUser._id}/password`,
          passwords,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials:true,
          });
        toast.success('Contraseña actualizada correctamente');
        setPasswords({ currentPassword: '', newPassword: '' });
        setSelectedUser(null);
      } catch (error) {
        toast.error('Error al actualizar la contraseña');
      }
    }
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user); // Guardar el usuario a eliminar
  };

  const handleConfirmDelete = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`,{
        headers:{
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      toast.success('Usuario eliminado correctamente');
      
      setSelectedUser(null);
      getUsers();
    } catch (error) {
      toast.error('Error al eliminar el usuario');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditedUser(null); // Limpiar el usuario editado
  };
  

  useEffect(() => {
    getUsers();
  }, []);

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
              <Dialog>
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
              <AlertDialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" onClick={() => handleEdit(user)}>Editar</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogHeader>
                 <AlertDialogTitle>Información del Usuario</AlertDialogTitle> 
                  <AlertDialogDescription>
                  Modifica aquí la información o cambia la contraseña.
                  </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Tabs defaultValue="account">
                    <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Usuario</TabsTrigger>
                    <TabsTrigger value="password">Contraseña</TabsTrigger>
                  </TabsList>

{/* Información del Usuario */}
        <TabsContent value="account">
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={editedUser?.name || ''}
                onChange={(e) =>
                  setEditedUser((prev) => (prev ? { ...prev, name: e.target.value } : null))
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastname">Apellido</Label>
              <Input
                id="lastname"
                value={editedUser?.lastname|| ''}
                onChange={(e) =>
                  setEditedUser((prev) => (prev ? { ...prev, lastname: e.target.value } : null))
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                value={editedUser?.email || ''}
                onChange={(e) =>
                  setEditedUser((prev) => (prev ? { ...prev, email: e.target.value } : null))
                }
              />
            </div>
          </div>

          {/* Botón para guardar la información del usuario */}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveChanges}>Guardar Información</AlertDialogAction>
          </AlertDialogFooter>
        </TabsContent>

        {/* Cambio de Contraseña */}
        <TabsContent value="password">
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          {/* Botón para cambiar la contraseña */}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangePassword}>Cambiar Contraseña</AlertDialogAction>
          </AlertDialogFooter>
        </TabsContent>
      </Tabs>
    </AlertDialogContent>
  </AlertDialog>
              {/* Eliminar usuario */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" onClick={() => handleDelete(user)}>Eliminar</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar Usuario</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción es irreversible. La cuenta del usuario y toda la información asociada serán eliminadas permanentemente de nuestro servidor.
                      ¿Estás seguro de que deseas continuar?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleConfirmDelete(user._id)}>Continuar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
      },
    ]);
  }, [initialColumns, selectedUser, editedUser, passwords, isDialogOpen]);

  return (
    <div>
      <DataTable columns={columns} data={users} />
    </div>
  );
};
