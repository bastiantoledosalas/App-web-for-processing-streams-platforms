'use client';

import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import { downloadExcel } from '@/lib/excel-utils';

interface DownloadButtonProps {
  data: any;
}

export function DownloadButton({ data }: DownloadButtonProps) {
  const handleDownload = () => {
    downloadExcel(data);
  };

  return (
    <Button
      onClick={handleDownload}
      className="flex items-center gap-2"
      variant="outline"
    >
      <FileSpreadsheet className="h-4 w-4" />
      Download Excel
    </Button>
  );
}