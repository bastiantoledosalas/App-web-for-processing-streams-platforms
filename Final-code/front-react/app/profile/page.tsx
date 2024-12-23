
"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface UserData{
  _id: string;
  name: string;
  lastname: string;
  email: string;
  password?: string;
  role:string;
}


const ProfilePage = () => {
  const { data: session } = useSession();  // Obtener la sesión actual
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);                // Almacenar los datos del usuario recibidos del bff
  const [selectedUser, setSelectedUser] = React.useState<UserData | null>(null)   // Estado para el usuario a editar
  const [isEditing, setIsEditing] = useState(false);
  const [passwords, setPasswords] = React.useState({ currentPassword: '', newPassword: '' });


  // Si no hay sesión, redireccionar al inicio de sesión
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">No estás autenticado.</p>
      </div>
    );
  }
  // Obtener información del usuario cuando hay sesión
  useEffect(() => {
    const getUserInformation = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/by-email/${session.user.email}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
          withCredentials: true,
        });
        setUserData(response.data);       // Guardamos los datos obtenidos del BFF en el estado
        setSelectedUser(response.data);   // Establecer los datos seleccionados al inicio
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        toast.error('Error al obtener la información del usuario');
      }
    };
  
    if (session) {
      getUserInformation();  // Llamamos a la API solo si hay sesión
    }
  }, [session]);  // Este useEffect se ejecuta cada vez que cambia la sesión  
  
  if (!userData) return <div>Loading...</div>;

   // Función para manejar la edición del perfil
   const handleEdit = () => {
    setIsEditing(true);
  };
  
  // Función para guardar los cambios del perfil
  const handleSaveChanges = async () => {
    if (selectedUser) {
      try {
        await axios.put(`http://localhost:3000/api/users/${selectedUser._id}`, selectedUser);
        toast.success('Usuario actualizado correctamente');
        setUserData(selectedUser);
      } catch (error) {
        toast.error('Error al actualizar el usuario');
      }
    }
  };

  const handleChangePassword = async () => {
    const{currentPassword,newPassword} = passwords;
    if(!currentPassword || !newPassword){
      toast.error('Debes completar ambos campos');
      return;
    }
  
    if (newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
  
    try {
      await axios.put(`http://localhost:3000/api/users/${selectedUser?._id}/password`, passwords);
      toast.success('Contraseña actualizada correctamente');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar la contraseña');
    }
  };

  // Datos del usuario autenticado
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Volver al menú principal
        </button>
      </div>
  
      {/* Tarjeta con los datos del usuario */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center gap-6">
          <Image
            src={`https://ui-avatars.com/api/?name=${session.user.name}`}
            width={80}
            height={80}
            className="rounded-full border"
            alt="avatar"
          />
          <div>
            <p className="text-lg font-semibold">{userData.name}</p>
            <p className="text-gray-500">Apellido: {userData.lastname}</p>
            <p className="text-gray-500">Correo Electrónico: {userData.email}</p>
            <p className="text-gray-500">Rol: {userData.role}</p>
          </div>
        </div>
      </div>
  
      {/* Botón para editar */}
      <Button
        onClick={() => setIsEditing(true)}
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Editar
      </Button>
  
      {/* Si estamos en modo edición, mostrar los tabs */}
      {isEditing && (
        <div className="mt-6">
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Usuario</TabsTrigger>
              <TabsTrigger value="password">Contraseña</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Usuario</CardTitle>
                  <CardDescription>
                    Haz tus cambios aqui. Haz Click para guardar cuando estes listo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={selectedUser?.name}
                      onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="col-span-3"
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lastname'>Apellido</Label>
                    <Input
                      id='lastname'
                      value={userData.lastname}
                      onChange={(e) => setSelectedUser(prev => prev ? { ...prev, lastname: e.target.value} : null)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      value={userData.email || ''}
                      onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                      className="col-span-3"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveChanges} type="submit">Guardar cambios</Button>
                </CardFooter>
              </Card>
            </TabsContent>
  
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Contraseña</CardTitle>
                  <CardDescription>
                    Cambia la contraseña aquí.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="password">Contraseña Actual</Label>
                    <Input
                      id="password"
                      value={userData.password || ''}
                      onChange={(e) => setSelectedUser(prev => prev ? { ...prev, password: e.target.value } : null)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">Nueva Contraseña</Label>
                    <Input id="new" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleChangePassword} type="submit">Actualizar contraseña</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
  
export default ProfilePage;