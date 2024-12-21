import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import React from 'react';
import { signIn } from 'next-auth/react';

const GithubButton = () => {
  return (
    <Button
      variant="outline"
      onClick={() => {
        signIn('github');
      }}
    >
      <Icons.gitHub />
      GitHub
    </Button>
  );
};

export default GithubButton;
