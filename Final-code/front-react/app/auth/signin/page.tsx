'use client';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const INITIAL_VALUES = {
  email: '',
  password: '',
};

const SigninPage = () => {
  const { data: session, status } = useSession();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: INITIAL_VALUES,
  });
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin');
    }
  }, [session, status, router]);

  if (status === 'authenticated') {
    return null;
  }

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    form.reset(INITIAL_VALUES);
    // emite un toast de éxito
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <CardHeader className="space-y-1">
          <Link href="/" className="flex justify-center">
            <Image
              src="/wss-black.png"
              width={250}
              height={32}
              alt="logo"
              className="pr-1"
            />
          </Link>
          <br />
          <CardTitle className="text-xl text-center">
            Accede a tu cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form id="form" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button className="w-full" type="submit">
                Ingresar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SigninPage;
