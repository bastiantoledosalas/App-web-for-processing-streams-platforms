
"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { DropdownMenuGroup, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

type User = {
  _id: string;
  name: string;
  lastname: string;
  email: string;
};

export const UserNavigation = () => {
  const { data: session,status }        = useSession();
  const router                          = useRouter();
  const [isClient, setIsClient]         = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userData, setUserData]         = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userName, setUserName]         = useState<string | null>(session?.user?.name ?? null);
  const [passwords, setPasswords]       = useState({currentPassword: '', newPassword: '' });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword]         = useState(false);

  useEffect(() => {
    setIsClient(true);   // Asegura que el código solo se ejecute en el cliente
  }, []);

  const getUserInformation = async () => {
    if(!session?.user.email) return;
    try {
      const token = localStorage.getItem('token');
      if(!token) {
        throw new Error("No se encontró el token de autenticación");
      }
      const response = await axios.get(`http://localhost:3000/api/users/by-email/${session?.user.email}`,
        {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setUserData(response.data);
      setSelectedUser(response.data);
      setUserName(response.data.name);
    } catch (error: any) {
      toast.error(
        error.response?.data.nessage || 'Error al obtener la información del usuario'
      );
    }
  };

useEffect(() => {
  getUserInformation(); // Llama a getUserInformation al cargar la sesión
}, [session]);

const handleSaveChanges = async () => {
  if (!selectedUser) return;
  try {
    const token = localStorage.getItem('token');
    if(!token){
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await axios.patch(
      `http://localhost:3000/api/users/${selectedUser._id}`,
      {
        name    : selectedUser.name,
        lastname: selectedUser.lastname,
        email   : selectedUser.email,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      toast.success('Usuario actualizado correctamente');
      setUserName(selectedUser.name);
      // Re-fetch de la información del usuario
      getUserInformation();
      setIsDialogOpen(false);
    } else {
      toast.error('Error al actualizar el usuario');
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "Error al actualizar el usuario"
    );
  }
};

const handleChangePassword = async () => {
  if (!selectedUser) return;
  try {
    const token = localStorage.getItem('token');
    if (!token){
      throw new Error("No se encontró el token de autenticación");
    }
    const response = await axios.put(
      `http://localhost:3000/api/users/${selectedUser._id}/password`,
      passwords,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      }
    );

    if (response.status === 200){
      toast.success('Contraseña actualizada correctamente');
      setPasswords({ currentPassword: '', newPassword: '' });
      setIsDialogOpen(false);
    }else {
      toast.error('Error al actualizar la contraseña');
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || 'Error al actualizar la contraseña'
    );
  }
};
  
if (status === 'loading' || !session || !isClient) return null;

  return (
    <div>
    {/* Dropdown con datos del usuario */}
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer group inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent data-[state=open]:bg-accent w-auto">
      <div className="flex items-center gap-x-2">
          {userName && (
            <Image
              src={`https://ui-avatars.com/api/?name=${userName ?? ''}`}
              width={24}
              height={24}
              className="rounded-full"
              alt="avatar"
            />
          )}
          {userName ?? ''}
        </div>
      </DropdownMenuTrigger>

      {/* Opciones de menú */}
      <DropdownMenuContent className="w-56 bg-white shadow-lg rounded-lg border border-gray-300 mt-1">
        <DropdownMenuLabel className="px-4 py-2 text-gray-700">Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="px-3 py-1" onClick={() => setIsDialogOpen(true)}> Perfil </DropdownMenuItem>
            <DropdownMenuItem className="px-3 py-1" onClick={() => signOut()}>Cerrar Sesión </DropdownMenuItem>
          </DropdownMenuGroup>
      </DropdownMenuContent>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Información del Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              Modifica aquí tu información o cambia tu contraseña.
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
                value={selectedUser?.name || ''}
                onChange={(e) =>
                  setSelectedUser((prev) => (prev ? { ...prev, name: e.target.value } : null))
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastname">Apellido</Label>
              <Input
                id="lastname"
                value={selectedUser?.lastname || ''}
                onChange={(e) =>
                  setSelectedUser((prev) => (prev ? { ...prev, lastname: e.target.value } : null))
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                value={selectedUser?.email || ''}
                onChange={(e) =>
                  setSelectedUser((prev) => (prev ? { ...prev, email: e.target.value } : null))
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
  </DropdownMenu>
  </div>
  );
};

