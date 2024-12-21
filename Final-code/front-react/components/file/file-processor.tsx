import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface FileProcessorProps {
  onProcessed: (data: any) => void;
}

const FileProcessor = ({ onProcessed }: FileProcessorProps) => {
  const [fileContent, setFileContent] = useState('');

  const handleFileRead = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const text = e.target.result;
        const formattedText = text
          .split('\n')
          .map((line: any) => {
            const num = parseFloat(line.trim());
            return isNaN(num) ? null : num.toFixed(8);
          })
          .filter((line: any) => line !== null)
          .join('\n');
        setFileContent(formattedText);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <Input type="file" accept=".dat" onChange={handleFileRead} />
      {fileContent && (
        <>
          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>Datos del Archivo</AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[200px] w-[455px] rounded-md border p-4">
                  <pre>{fileContent}</pre>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Button
            type="button"
            size={'sm'}
            className="w-full"
            onClick={() => onProcessed(JSON.stringify(fileContent))}
          >
            Procesar
          </Button>
        </>
      )}
    </div>
  );
};

export default FileProcessor;
