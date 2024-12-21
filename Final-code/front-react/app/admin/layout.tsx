import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/app-sidebar';
import { TopNavigation } from '@/components/global/top-navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <ToastContainer />
      <AppSidebar />
      <main className="w-full">
        <TopNavigation />
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
