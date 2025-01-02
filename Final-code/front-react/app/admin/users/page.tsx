'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { ListUsers } from './list';
import { HeaderPage } from '@/components/navigation/header-page';
import { Button} from '@/components/ui/button'; // Asegúrate de que tienes estos componentes
import { Input } from '@/components/ui/input';
import { Select, SelectItem,SelectTrigger, SelectValue, SelectContent} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogAction, AlertDialogCancel,AlertDialogTitle} from '@/components/ui/alert-dialog'; // Usando AlertDialog para mostrar el formulario
import axios from 'axios';
import { toast } from 'react-toastify';

const userSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  lastname: z.string().min(1, { message: "El apellido es requerido" }),
  email: z.string().email({ message: "Correo electrónico inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  role: z.enum(["user", "admin"], { message: "Selecciona un rol válido" }),
});

type UserFormData = z.infer<typeof userSchema>;

const UsersPage = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [newUser, setNewUser] = useState<UserFormData>({
    name: '',
    lastname: '',
    email: '',
    password: '',
    role: 'user',
  });

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: 'onChange', // Para validar mientras el usuario escribe
    defaultValues: newUser,
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const response = await axios.post('http://localhost:3000/api/users', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });

      toast.success('Usuario creado exitosamente');
      setShowDialog(false); // Cerrar el formulario
      reset(); // Limpiar el formulario
    } catch (error) {
      toast.error('Error al crear el usuario');
    }
  };

  // Aseguramos que el valor de role sea uno de los posibles
  const handleRoleChange = (value: string) => {
    if (value === 'user' || value === 'admin') {
      setNewUser({ ...newUser, role: value as 'user' | 'admin' });
    }
  };

  return (
    <div>
    {/* Encabezado con botón para crear nueva simulación */}
    <HeaderPage
      title="Gestión de Usuarios"
      description="Listado de usuarios"
      actions={
        <Button onClick={() => setShowDialog(true)}>Crear nuevo usuario</Button>
      }
    />

    {/* Lista de simulaciones */}
    <ListUsers />
      

      {/* Mostrar el formulario en un Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
          <AlertDialogTitle>Crear Usuario Nuevo</AlertDialogTitle>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                {...register('name')}
                type="text"
                required
              />
              {errors.name && <p className="text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="lastname">Apellido</Label>
              <Input
                id="lastname"
                {...register('lastname')}
                type="text"
                required
              />
              {errors.lastname && <p className="text-red-600">{errors.lastname.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                {...register('email')}
                type="email"
                required
              />
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                {...register('password')}
                type="password"
                required
              />
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <Label>Rol</Label>
              <Select value={newUser.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between mt-4">
              <AlertDialogCancel onClick={() => setShowDialog(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction type="submit" disabled={!isValid}>
                Crear usuario
              </AlertDialogAction>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;