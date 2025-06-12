import React from 'react';

export function ClassicHomePage() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8 mt-24">
      <div className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
          Welcome to Color & Craft
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This is the classic view of our website. Simple, fast, and easy to navigate.
        </p>
      </div>
    </main>
  );
} 