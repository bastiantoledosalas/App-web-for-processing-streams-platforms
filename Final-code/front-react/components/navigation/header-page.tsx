import React from 'react';

interface HeaderPageProps {
  title: string;
  description?: string | null;
  actions?: React.ReactNode;
}

export const HeaderPage = ({
  title,
  description,
  actions,
}: HeaderPageProps) => {
  return (
    <div className="space-y-2 flex justify-between items-center mb-3">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && <p>{description}</p>}
      </div>
      <div>{actions}</div>
    </div>
  );
};
